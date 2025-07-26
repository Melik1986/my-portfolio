import { IconData } from '../types/spiral';

export class SpiralIconFactory {
  static createIcon(iconData: IconData, offset: number): SVGElement {
    const svg = this.createSvgElement(iconData);
    const use = this.createUseElement(iconData.id);

    svg.appendChild(use);
    svg.dataset.offset = offset.toString();

    return svg;
  }

  private static createSvgElement(iconData: IconData): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.classList.add('tech-icon', `tech-icon--${iconData.name}`, 'icon');

    return svg;
  }

  private static createUseElement(iconId: string): SVGUseElement {
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconId}`);

    return use;
  }
}
