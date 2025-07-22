import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationProps } from '@/types/use-card-animation.types';

gsap.registerPlugin(ScrollTrigger);

export const useCardAnimation = ({
  direction = 'vertical',
  activationThreshold = 0.3,
  onActivate,
  onDeactivate,
}: AnimationProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const tl = gsap.timeline({ paused: true });
    tl.from(content.children, { opacity: 0, y: 50, stagger: 0.1 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        if (progress >= activationThreshold) {
          tl.play();
          onActivate?.();
        } else {
          tl.pause().progress(0);
          onDeactivate?.();
        }
      },
    });

    gsap.set(section, { [direction === 'horizontal' ? 'xPercent' : 'yPercent']: 100 });
    gsap.to(section, {
      [direction === 'horizontal' ? 'xPercent' : 'yPercent']: 0,
      scale: 0.9,
      borderRadius: '14px',
      scrollTrigger: {
        trigger: section,
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [direction, activationThreshold, onActivate, onDeactivate]);

  return { sectionRef, contentRef };
};
