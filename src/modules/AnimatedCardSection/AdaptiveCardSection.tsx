'use client';

import React, { useEffect, useState } from 'react';
import { AnimatedCardSection } from './AnimatedCardSection';

interface AdaptiveCardSectionProps {
  id: string;
  title: string;
  sectionIndex: number;
  children: React.ReactNode;
  mobileConfig?: {
    split: boolean;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    leftTitle?: string;
    rightTitle?: string;
  };
}

// Хук для определения мобильного устройства
function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isClient };
}

// Компонент для рендеринга разделенных карточек
function SplitCards({ 
  id, 
  title, 
  sectionIndex, 
  mobileConfig 
}: Pick<AdaptiveCardSectionProps, 'id' | 'title' | 'sectionIndex' | 'mobileConfig'>) {
  return (
    <>
      <AnimatedCardSection 
        id={`${id}-left`} 
        title={mobileConfig?.leftTitle || `${title} Content`} 
        sectionIndex={sectionIndex + 0.1}
      >
        {mobileConfig?.leftContent}
      </AnimatedCardSection>
      <AnimatedCardSection 
        id={`${id}-right`} 
        title={mobileConfig?.rightTitle || `${title} Visual`} 
        sectionIndex={sectionIndex + 0.2}
      >
        {mobileConfig?.rightContent}
      </AnimatedCardSection>
    </>
  );
}

export function AdaptiveCardSection({
  id,
  title,
  sectionIndex,
  children,
  mobileConfig,
}: AdaptiveCardSectionProps) {
  const { isMobile, isClient } = useMobileDetection();

  // На сервере или десктопе рендерим обычную карточку
  if (!isClient || !isMobile || !mobileConfig?.split) {
    return (
      <AnimatedCardSection id={id} title={title} sectionIndex={sectionIndex}>
        {children}
      </AnimatedCardSection>
    );
  }

  // Для мобильной версии с разделением
  return <SplitCards id={id} title={title} sectionIndex={sectionIndex} mobileConfig={mobileConfig} />;
}