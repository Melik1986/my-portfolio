'use client';

import { useGsap } from '@/lib/hooks/useGsap';
import { useAuroraAnimation } from '@/modules/AboutSection/hooks/useAuroraAnimation';
import './AboutAnimation.module.scss';

export function AboutAnimation() {
  const { containerRef } = useGsap({});
  useAuroraAnimation(containerRef);

  return (
    <div
      ref={containerRef}
      className="about__animation"
      id="aurora-container"
      data-animation="fade-up"
      data-duration="0.8"
      data-ease="power2.out"
    >
      {/* Canvas будет добавлен сюда с помощью JavaScript */}
    </div>
  );
}
