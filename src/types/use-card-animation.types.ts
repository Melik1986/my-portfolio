export interface AnimationProps {
  direction?: 'horizontal' | 'vertical';
  activationThreshold?: number;
  onActivate?: () => void;
  onDeactivate?: () => void;
}
