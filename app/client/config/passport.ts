// path: src/config/passport.ts
/**
 * Конфигурация аутентификации с использованием Passport.js
 * Поддерживает стратегии аутентификации: JWT, локальная аутентификация, OAuth
 */

import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { User } from '@db/models';
import ApiError from '@utils/ApiError';
import config from './config';

// Опции для JWT стратегии
const jwtOptions: StrategyOptions = {
  // Извлекаем JWT из заголовка Authorization
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  
  // Секретный ключ для проверки подписи
  secretOrKey: config.jwt.secret,
  
  // Учитываем временную метку истечения срока действия токена
  ignoreExpiration: false,
  
  // Указываем издателя токена
  issuer: config.jwt.issuer,
  
  // Указываем аудиторию токена
  audience: config.jwt.audience,
  
  // Алгоритм подписи
  algorithms: ['HS256'],
};

// JWT стратегия для аутентификации по токену
const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload: any, done: any) => {
    try {
      // Проверяем, что в токене есть ID пользователя
      if (!payload.sub) {
        return done(null, false, { message: 'Неверный формат токена' });
      }
      
      // Ищем пользователя в базе данных
      const user = await User.findById(payload.sub);
      
      // Если пользователь не найден
      if (!user) {
        return done(null, false, { message: 'Пользователь не найден' });
      }
      
      // Если пользователь заблокирован
      if (!user.isActive) {
        return done(null, false, { message: 'Учетная запись отключена' });
      }
      
      // Возвращаем пользователя
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

// Локальная стратегия для аутентификации по email/паролю
const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
  async (email: string, password: string, done: any) => {
    try {
      // Ищем пользователя по email
      const user = await User.findOne({ email });
      
      // Если пользователь не найден
      if (!user) {
        return done(null, false, { message: 'Неверный email или пароль' });
      }
      
      // Проверяем пароль
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      
      // Если пароль неверный
      if (!isMatch) {
        return done(null, false, { message: 'Неверный email или пароль' });
      }
      
      // Если пользователь заблокирован
      if (!user.isActive) {
        return done(null, false, { message: 'Учетная запись отключена' });
      }
      
      // Возвращаем пользователя без хеша пароля
      const { passwordHash, ...userWithoutHash } = user.toObject();
      return done(null, userWithoutHash);
    } catch (error) {
      return done(error);
    }
  }
);

// Google OAuth стратегия
const googleStrategy = new GoogleStrategy(
  {
    clientID: config.oauth.google.clientId,
    clientSecret: config.oauth.google.clientSecret,
    callbackURL: `${config.api.baseUrl}/auth/google/callback`,
    scope: ['profile', 'email'],
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Поиск или создание пользователя на основе данных из Google
      let user = await User.findOne({ 'oauth.google.id': profile.id });
      
      // Если пользователь не найден, проверяем по email
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        
        // Если пользователь с таким email уже существует, привязываем аккаунт Google
        if (user) {
          user.oauth = user.oauth || {};
          user.oauth.google = {
            id: profile.id,
            accessToken,
            refreshToken,
          };
          await user.save();
        } else {
          // Создаем нового пользователя
          user = new User({
            email: profile.emails?.[0]?.value,
            username: profile.displayName || profile.username || `user_${Date.now()}`,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value,
            isActive: true,
            oauth: {
              google: {
                id: profile.id,
                accessToken,
                refreshToken,
              },
            },
          });
          await user.save();
        }
      }
      
      // Обновляем токены доступа
      user.oauth = user.oauth || {};
      user.oauth.google = {
        id: profile.id,
        accessToken,
        refreshToken,
      };
      await user.save();
      
      // Возвращаем пользователя
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

// Инициализация Passport
const initializePassport = () => {
  // Сериализация пользователя в сессию
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  // Десериализация пользователя из сессии
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Подключаем стратегии
  passport.use('jwt', jwtStrategy);
  passport.use('local', localStrategy);
  
  // Подключаем OAuth стратегии, если настроены
  if (config.oauth.google.clientId) {
    passport.use('google', googleStrategy);
  }
  
  // Можно добавить другие стратегии (Facebook, GitHub и т.д.)
  
  return passport;
};

// Middleware для проверки аутентификации
export const authenticateJwt = (req: any, res: any, next: any) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(new ApiError('Ошибка аутентификации', 500));
    }
    
    if (!user) {
      return next(new ApiError('Требуется авторизация', 401));
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware для проверки ролей
export const authorize = (roles: string[] = []) => {
  return (req: any, res: any, next: any) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ApiError('Доступ запрещен', 403));
    }
    next();
  };
};

export default initializePassport;
