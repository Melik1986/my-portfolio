'use client';

import { useEffect } from 'react';
import { initCriticalPreloading } from './chunkPreloader';
import { initResourcePreloading } from './resourcePreloader';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Инициализируем предзагрузку критических чанков
    initCriticalPreloading();

    // Инициализируем предзагрузку статических ресурсов
    initResourcePreloading();
  }, []);

  return <>{children}</>;
}
