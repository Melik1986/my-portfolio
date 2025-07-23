'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Back } from 'gsap';
import { AnimationData, UseGsapAnimation } from '@/types/gsap.types';

gsap.registerPlugin(ScrollTrigger, Back);

export const useGsapAnimation: UseGsapAnimation = (ref, data) => {
  useEffect(() => {
    if (!ref.current) return;

    const duration = parseFloat(data.duration || '1');
    const ease = data.ease || 'power2.out';
    const stagger = parseFloat(data.stagger || '0');
    const delay = parseFloat(data.groupDelay || '0');

    let animationProps: gsap.TweenVars = { duration, ease, delay, stagger };

    switch (data.animation) {
      case 'slide-down':
        animationProps = { ...animationProps, y: -50, opacity: 0 };
        break;
      case 'zoom-in':
        animationProps = { ...animationProps, scale: 0, ease: Back.easeOut.config(1.7) };
        break;
      case 'slide-left':
        animationProps = { ...animationProps, x: -100, opacity: 0 };
        break;
      case 'slide-right':
        animationProps = { ...animationProps, x: 100, opacity: 0 };
        break;
      case 'svg-draw':
        animationProps = { ...animationProps, strokeDashoffset: 0 };
        if (
          ref.current &&
          'getTotalLength' in ref.current &&
          typeof (ref.current as unknown as SVGGeometryElement).getTotalLength === 'function'
        ) {
          const length = (ref.current as unknown as SVGGeometryElement).getTotalLength();
          gsap.set(ref.current, { strokeDasharray: length });
          gsap.set(ref.current, { strokeDashoffset: length });
        }
        break;
      default:
        return;
    }

    gsap.from(ref.current, animationProps);
  }, [data]);
};
