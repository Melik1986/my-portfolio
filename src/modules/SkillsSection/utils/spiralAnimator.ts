import { SpiralConfig } from '../types/spiral';

/**
 * Класс аниматора спиральных иконок
 * Управляет движением иконок по спиральной траектории
 */
export class SpiralAnimator {
  /** Текущий угол поворота спирали */
  private angle = 0;
  /** ID текущей анимации для возможности остановки */
  private animationId: number | null = null;

  constructor(private config: SpiralConfig) {}

  /**
   * Запускает анимацию спиральных иконок
   * Инициирует цикл анимации если она не запущена
   * @param icons - коллекция иконок для анимации
   */
  start(icons: NodeListOf<Element>): void {
    if (this.animationId) return;
    this.animate(icons);
  }

  /**
   * Останавливает анимацию спиральных иконок
   * Отменяет текущий кадр анимации и сбрасывает ID
   */
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Основной цикл анимации спиральных иконок
   * Обновляет угол поворота и позиции иконок в каждом кадре
   */
  private animate = (icons: NodeListOf<Element>): void => {
    this.angle += this.config.speed;
    this.updateIconPositions(icons);
    this.animationId = requestAnimationFrame(() => this.animate(icons));
  };

  /**
   * Обновляет позиции всех иконок в спирали
   * Вычисляет трансформацию для каждой иконки и применяет её
   */
  private updateIconPositions(icons: NodeListOf<Element>): void {
    icons.forEach((icon, i) => {
      const transform = this.calculateTransform(icon as HTMLElement, i);
      (icon as HTMLElement).style.transform = transform;
    });
  }

  /**
   * Вычисляет CSS трансформацию для иконки
   * Создает спиральную траекторию с масштабированием
   */
  private calculateTransform(icon: HTMLElement, index: number): string {
    const phase = index * ((Math.PI * 2) / this.config.numIcons);
    const offset = parseFloat(icon.dataset.offset || '0');

    const x = this.config.radiusX * Math.sin(this.angle + phase + offset);
    const y = this.config.radiusY * Math.sin((this.angle + phase + offset) * 2);
    const scale = Math.cos(this.angle + phase + offset) * 0.5 + 0.5;

    return `translate(${x}px, ${y}px) scale(${scale})`;
  }
}
