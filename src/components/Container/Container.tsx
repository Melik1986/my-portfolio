import React, { ReactNode } from 'react';
import styles from './Container.module.scss';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps) => {
  return <div className={`${styles.container} ${className}`.trim()}>{children}</div>;
};

export default Container;
