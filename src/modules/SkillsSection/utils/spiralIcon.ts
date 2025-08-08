import { IconData } from '../types/spiral';

/**
 * Фабрика для создания SVG иконок в спиральной анимации
 * Генерирует SVG элементы с технологическими иконками
 */
export class SpiralIconFactory {
  /**
   * Создает SVG иконку для спиральной анимации
   * Генерирует SVG элемент с ссылкой на спрайт и смещением
   */
  static createIcon(iconData: IconData, offset: number): SVGElement {
    const svg = this.createSvgElement(iconData);
    const use = this.createUseElement(iconData.id);

    svg.appendChild(use);
    svg.dataset.offset = offset.toString();

    return svg;
  }

  /**
   * Создает базовый SVG элемент для иконки
   * Добавляет CSS классы для стилизации иконки
   */
  private static createSvgElement(iconData: IconData): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.classList.add('tech-icon', `tech-icon--${iconData.name}`, 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('fill', 'currentColor');

    return svg;
  }

  /**
   * Создает SVG use элемент для ссылки на спрайт
   * Устанавливает ссылку на конкретную иконку в спрайте
   */
  private static createUseElement(iconId: string): SVGUseElement {
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    use.setAttribute('href', `/icons/tech-icons.svg#${iconId}`);
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `/icons/tech-icons.svg#${iconId}`);

    return use;
  }
}
