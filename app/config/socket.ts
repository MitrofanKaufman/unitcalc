// path: src/config/socket.ts
/**
 * Конфигурация WebSocket-сервера и клиента
 * Обеспечивает двустороннюю связь в реальном времени между сервером и клиентами
 */

import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { Server as SocketIoServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from './config';
import logger from '@utils/logger';
import { UserDocument } from '@db/models/User';

type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => void;

// Интерфейс для событий сокета
interface ISocketEvent {
  event: string;
  handler: (socket: Socket, data: any, ack?: (response: any) => void) => Promise<void> | void;
}

// Интерфейс для комнат сокетов
interface ISocketRoom {
  name: string;
  sockets: Set<string>; // ID сокетов в комнате
}

// Класс для управления WebSocket-соединениями
class SocketManager {
  private static instance: SocketManager;
  private io: SocketIoServer | null = null;
  private rooms: Map<string, ISocketRoom> = new Map();
  private events: Map<string, ISocketEvent> = new Map();
  private middlewares: SocketMiddleware[] = [];
  
  private constructor() {}
  
  // Получить экземпляр SocketManager (синглтон)
  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }
  
  // Инициализация Socket.IO сервера
  public initialize(server: HttpServer): void {
    if (this.io) {
      logger.warn('WebSocket сервер уже инициализирован');
      return;
    }
    
    // Настройка CORS для WebSocket
    const ioOptions = {
      cors: {
        origin: config.cors.allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      path: '/socket.io',
      serveClient: false,
      pingInterval: 10000, // Интервал пинга (10 секунд)
      pingTimeout: 5000,   // Таймаут пинга (5 секунд)
      cookie: false,
    };
    
    this.io = new SocketIoServer(server, ioOptions);
    
    // Обработка подключений
    this.io.use(this.authenticateToken);
    
    // Применение промежуточного ПО
    this.middlewares.forEach(middleware => {
      this.io?.use(middleware);
    });
    
    // Обработка подключений клиентов
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId || 'anonymous';
      const clientId = socket.id;
      
      logger.info(`Клиент подключился: ${clientId} (User ID: ${userId})`);
      
      // Обработчик ошибок
      socket.on('error', (error) => {
        logger.error(`Ошибка сокета ${clientId}:`, error);
      });
      
      // Обработка отключения клиента
      socket.on('disconnect', (reason) => {
        logger.info(`Клиент отключился: ${clientId} (Причина: ${reason})`);
        
        // Удаляем сокет из всех комнат при отключении
        this.rooms.forEach((room, roomName) => {
          if (room.sockets.has(clientId)) {
            room.sockets.delete(clientId);
            logger.debug(`Клиент ${clientId} удален из комнаты ${roomName}`);
            
            // Если комната пуста, удаляем её
            if (room.sockets.size === 0) {
              this.rooms.delete(roomName);
              logger.debug(`Комната ${roomName} удалена, так как пуста`);
            }
          }
        });
      });
      
      // Регистрируем обработчики событий
      this.events.forEach((event) => {
        socket.on(event.event, async (data, ack) => {
          try {
            await event.handler(socket, data, ack);
          } catch (error) {
            logger.error(`Ошибка при обработке события ${event.event}:`, error);
            
            // Отправляем ошибку клиенту, если есть колбэк
            if (typeof ack === 'function') {
              ack({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
              });
            } else {
              // Иначе отправляем событие с ошибкой
              socket.emit('error', {
                event: event.event,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          }
        });
      });
      
      // Событие для входа в комнату
      socket.on('join_room', (roomName: string, ack?: (response: any) => void) => {
        try {
          this.joinRoom(socket, roomName);
          
          if (typeof ack === 'function') {
            ack({ success: true, room: roomName });
          }
          
          logger.debug(`Клиент ${clientId} вошел в комнату ${roomName}`);
        } catch (error) {
          logger.error(`Ошибка при входе в комнату ${roomName}:`, error);
          
          if (typeof ack === 'function') {
            ack({
              success: false,
              error: 'Failed to join room',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      });
      
      // Событие для выхода из комнаты
      socket.on('leave_room', (roomName: string, ack?: (response: any) => void) => {
        try {
          this.leaveRoom(socket, roomName);
          
          if (typeof ack === 'function') {
            ack({ success: true, room: roomName });
          }
          
          logger.debug(`Клиент ${clientId} вышел из комнаты ${roomName}`);
        } catch (error) {
          logger.error(`Ошибка при выходе из комнаты ${roomName}:`, error);
          
          if (typeof ack === 'function') {
            ack({
              success: false,
              error: 'Failed to leave room',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      });
      
      // Событие для проверки соединения
      socket.on('ping', (callback) => {
        if (typeof callback === 'function') {
          callback('pong');
        }
      });
    });
    
    logger.info('WebSocket сервер инициализирован');
  }
  
  // Аутентификация по JWT токену
  private authenticateToken = (
    socket: Socket,
    next: (err?: Error) => void
  ): void => {
    const token = socket.handshake.auth.token || 
                 socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      logger.warn('Попытка подключения без токена аутентификации');
      return next(new Error('Требуется аутентификация'));
    }
    
    try {
      const decoded = verify(token, config.jwt.secret) as { userId: string };
      
      if (!decoded.userId) {
        throw new Error('Неверный формат токена');
      }
      
      // Сохраняем ID пользователя в данных сокета
      socket.data.userId = decoded.userId;
      
      next();
    } catch (error) {
      logger.error('Ошибка аутентификации WebSocket:', error);
      next(new Error('Недействительный токен аутентификации'));
    }
  };
  
  // Добавить промежуточное ПО
  public use(middleware: SocketMiddleware): void {
    if (this.io) {
      this.io.use(middleware);
    } else {
      this.middlewares.push(middleware);
    }
  }
  
  // Зарегистрировать обработчик события
  public on(event: string, handler: ISocketEvent['handler']): void {
    this.events.set(event, { event, handler });
  }
  
  // Отправить событие всем клиентам
  public emitToAll(event: string, data: any): void {
    this.io?.emit(event, data);
  }
  
  // Отправить событие конкретному пользователю
  public emitToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;
    
    const sockets = this.io.sockets.sockets;
    
    for (const [socketId, socket] of sockets) {
      if (socket.data.userId === userId) {
        socket.emit(event, data);
      }
    }
  }
  
  // Отправить событие в комнату
  public emitToRoom(roomName: string, event: string, data: any): void {
    this.io?.to(roomName).emit(event, data);
  }
  
  // Войти в комнату
  public joinRoom(socket: Socket, roomName: string): void {
    // Проверяем, существует ли комната
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, {
        name: roomName,
        sockets: new Set(),
      });
    }
    
    const room = this.rooms.get(roomName)!;
    
    // Добавляем сокет в комнату
    socket.join(roomName);
    room.sockets.add(socket.id);
    
    logger.debug(`Клиент ${socket.id} добавлен в комнату ${roomName}`);
  }
  
  // Выйти из комнаты
  public leaveRoom(socket: Socket, roomName: string): void {
    if (!this.rooms.has(roomName)) {
      return;
    }
    
    const room = this.rooms.get(roomName)!;
    
    // Удаляем сокет из комнаты
    socket.leave(roomName);
    room.sockets.delete(socket.id);
    
    // Если комната пуста, удаляем её
    if (room.sockets.size === 0) {
      this.rooms.delete(roomName);
      logger.debug(`Комната ${roomName} удалена, так как пуста`);
    }
    
    logger.debug(`Клиент ${socket.id} удален из комнаты ${roomName}`);
  }
  
  // Получить список комнат
  public getRooms(): string[] {
    return Array.from(this.rooms.keys());
  }
  
  // Получить список сокетов в комнате
  public getSocketsInRoom(roomName: string): string[] {
    const room = this.rooms.get(roomName);
    return room ? Array.from(room.sockets) : [];
  }
  
  // Закрыть соединение с сокетом
  public disconnectSocket(socketId: string): void {
    const socket = this.io?.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true);
    }
  }
  
  // Закрыть все соединения
  public async close(): Promise<void> {
    if (this.io) {
      // Отключаем всех клиентов
      const sockets = await this.io.fetchSockets();
      sockets.forEach(socket => {
        socket.disconnect(true);
      });
      
      // Закрываем сервер
      this.io.close();
      this.io = null;
      
      // Очищаем комнаты
      this.rooms.clear();
      
      logger.info('WebSocket сервер остановлен');
    }
  }
}

// Экспортируем экземпляр SocketManager
const socketManager = SocketManager.getInstance();

// Вспомогательные функции для работы с сокетами
export const emitToAll = socketManager.emitToAll.bind(socketManager);
export const emitToUser = socketManager.emitToUser.bind(socketManager);
export const emitToRoom = socketManager.emitToRoom.bind(socketManager);
export const joinRoom = socketManager.joinRoom.bind(socketManager);
export const leaveRoom = socketManager.leaveRoom.bind(socketManager);
export const getRooms = socketManager.getRooms.bind(socketManager);
export const getSocketsInRoom = socketManager.getSocketsInRoom.bind(socketManager);

// Типы для событий сокетов
export interface ClientToServerEvents {
  // Системные события
  ping: (callback: (response: string) => void) => void;
  join_room: (roomName: string, ack?: (response: any) => void) => void;
  leave_room: (roomName: string, ack?: (response: any) => void) => void;
  
  // Пользовательские события (добавляются через socket.on в обработчиках)
  [event: string]: (...args: any[]) => void;
}

export interface ServerToClientEvents {
  // Системные события
  pong: (response: string) => void;
  error: (error: { event?: string; error: string; message: string }) => void;
  
  // Пользовательские события (добавляются через socket.emit)
  [event: string]: (...args: any[]) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
  user?: Partial<UserDocument>;
  [key: string]: any;
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export default socketManager;
