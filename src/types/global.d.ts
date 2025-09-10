import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
    MotionPathPlugin: typeof MotionPathPlugin;
    ScrollSmoother: typeof ScrollSmoother;
  }
}