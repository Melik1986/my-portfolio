export type AnimationType =
  | 'slide-left'
  | 'slide-down'
  | 'slide-right'
  | 'slide-up'
  | 'zoom-in'
  | 'svg-draw'
  | 'text-reveal'
  | 'fade-up'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up';

export interface AnimationData {
  animation?: AnimationType;
  duration?: string;
  ease?: string;
  stagger?: string;
  groupDelay?: string;
}

export interface AnimationConfig {
  animation: AnimationType;
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  groupDelay?: number;
}

export interface AnimationProps {
  direction?: 'horizontal' | 'vertical';
  activationThreshold?: number;
  onActivate?: () => void;
  onDeactivate?: () => void;
}
