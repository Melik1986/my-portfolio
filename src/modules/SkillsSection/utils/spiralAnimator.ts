import { SpiralConfig } from '../types/spiral';

export class SpiralAnimator {
  private angle = 0;
  private animationId: number | null = null;

  constructor(private config: SpiralConfig) {}

  start(icons: NodeListOf<Element>): void {
    if (this.animationId) return;
    this.animate(icons);
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = (icons: NodeListOf<Element>): void => {
    this.angle += this.config.speed;
    this.updateIconPositions(icons);
    this.animationId = requestAnimationFrame(() => this.animate(icons));
  };

  private updateIconPositions(icons: NodeListOf<Element>): void {
    icons.forEach((icon, i) => {
      const transform = this.calculateTransform(icon as HTMLElement, i);
      (icon as HTMLElement).style.transform = transform;
    });
  }

  private calculateTransform(icon: HTMLElement, index: number): string {
    const phase = index * ((Math.PI * 2) / this.config.numIcons);
    const offset = parseFloat(icon.dataset.offset || '0');

    const x = this.config.radiusX * Math.sin(this.angle + phase + offset);
    const y = this.config.radiusY * Math.sin((this.angle + phase + offset) * 2);
    const scale = Math.cos(this.angle + phase + offset) * 0.5 + 0.5;

    return `translate(${x}px, ${y}px) scale(${scale})`;
  }
}
