import { ReactNode } from 'react';

/**
 * Пропсы базового компонента страницы
 */
export interface PageProps {
  /**
   * Дочерние элементы страницы
   */
  children?: ReactNode;
  
  /**
   * Дополнительные CSS-классы
   */
  className?: string;
  
  /**
   * Заголовок страницы (для мета-тегов и заголовка вкладки)
   */
  title?: string;
  
  /**
   * Описание страницы (для мета-тегов)
   */
  description?: string;
}

/**
 * Мета-данные страницы для роутера
 */
export interface PageMeta {
  /**
   * Путь к странице
   */
  path: string;
  
  /**
   * Компонент страницы
   */
  component: React.ComponentType<any>;
  
  /**
   * Заголовок страницы
   */
  title: string;
  
  /**
   * Описание страницы
   */
  description?: string;
  
  /**
   * Требуется ли аутентификация
   */
  requiresAuth?: boolean;
  
  /**
   * Роли, которым разрешен доступ
   */
  roles?: string[];
}
