'use client';

import React, { useEffect, useState } from 'react';
import { AnimatedCardSection } from './AnimatedCardSection';

interface ResponsiveCardWrapperProps {
  id: string;
  title: string;
  sectionIndex: number;
  children: React.ReactNode;
  splitOnMobile?: boolean; // Флаг для разделения на мобильных
}

export function ResponsiveCardWrapper({
  id,
  title,
  sectionIndex,
  children,
  splitOnMobile = false,
}: ResponsiveCardWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Если не нужно разделять или это десктоп - возвращаем как есть
  if (!splitOnMobile || !isMobile) {
    return (
      <AnimatedCardSection id={id} title={title} sectionIndex={sectionIndex}>
        {children}
      </AnimatedCardSection>
    );
  }

  // Для мобильных устройств разделяем контент
  const childrenArray = React.Children.toArray(children);
  
  // Предполагаем, что у нас есть компонент с двумя частями контента
  const leftContent = childrenArray[0];
  const rightContent = childrenArray[1];

  return (
    <>
      <AnimatedCardSection 
        id={`${id}-left`} 
        title={`${title} Content`} 
        sectionIndex={sectionIndex}
      >
        {leftContent}
      </AnimatedCardSection>
      <AnimatedCardSection 
        id={`${id}-right`} 
        title={`${title} Visual`} 
        sectionIndex={sectionIndex + 0.5} // Используем дробный индекс для второй части
      >
        {rightContent}
      </AnimatedCardSection>
    </>
  );
}