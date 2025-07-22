export interface AnimationProps {
  direction?: 'horizontal' | 'vertical';
  activationThreshold?: number;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export type AnimationData = {
  animation?: string;
  duration?: string;
  ease?: string;
  stagger?: string;
  groupDelay?: string;
};

export type UseGsapAnimation = (ref: React.RefObject<Element>, data: AnimationData) => void;
