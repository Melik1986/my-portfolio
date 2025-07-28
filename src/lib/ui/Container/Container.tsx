import React, { ReactNode } from 'react';
import styles from './Container.module.scss';

/**
 * Интерфейс пропсов для контейнера
 */
interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Контейнер для ограничения ширины контента
 * Центрирует содержимое и добавляет отступы
 */
function Container({ children, className = '' }: ContainerProps) {
  return <div className={`${styles.container} ${className}`.trim()}>{children}</div>;
}

export default Container;
