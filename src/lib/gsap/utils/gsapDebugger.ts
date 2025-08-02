'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Утилита для отладки GSAP анимаций
 * Предоставляет инструменты для анализа состояния анимаций и ScrollTrigger
 */
export class GSAPDebugger {
  private static instance: GSAPDebugger;
  private debugPanel: HTMLElement | null = null;

  static getInstance(): GSAPDebugger {
    if (!GSAPDebugger.instance) {
      GSAPDebugger.instance = new GSAPDebugger();
    }
    return GSAPDebugger.instance;
  }

  /**
   * Создает панель отладки в DOM
   */
  createDebugPanel(): void {
    if (this.debugPanel) return;

    this.debugPanel = document.createElement('div');
    this.debugPanel.id = 'gsap-debug-panel';
    this.debugPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      max-height: 400px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      overflow-y: auto;
      border: 1px solid #333;
    `;

    document.body.appendChild(this.debugPanel);
    this.updateDebugInfo();
  }

  /**
   * Обновляет информацию в панели отладки
   */
  updateDebugInfo(): void {
    if (!this.debugPanel) return;

    const scrollTriggers = ScrollTrigger.getAll();
    const timelines = gsap.globalTimeline.getChildren();
    
    let html = '<h3>🔍 GSAP Debug Panel</h3>';
    
    // Информация о ScrollTrigger
    html += `<h4>📜 ScrollTriggers (${scrollTriggers.length})</h4>`;
    scrollTriggers.forEach((st, index) => {
      const trigger = st.trigger as HTMLElement;
      const progress = st.progress;
      const isActive = st.isActive;
      
      html += `
        <div style="margin-bottom: 10px; padding: 5px; border: 1px solid #444; border-radius: 4px;">
          <strong>ST ${index + 1}:</strong> ${trigger?.id || trigger?.className || 'unnamed'}<br>
          <span style="color: ${isActive ? '#4CAF50' : '#f44336'}">● ${isActive ? 'Active' : 'Inactive'}</span><br>
          Progress: <span style="color: #2196F3">${(progress * 100).toFixed(1)}%</span><br>
          Start: ${st.start}<br>
          End: ${st.end}
        </div>
      `;
    });

    // Информация о Timeline
    html += `<h4>⏱️ Timelines (${timelines.length})</h4>`;
    timelines.forEach((tl, index) => {
      if (tl instanceof gsap.core.Timeline) {
        const progress = tl.progress();
        const duration = tl.duration();
        const paused = tl.paused();
        
        html += `
          <div style="margin-bottom: 8px; padding: 5px; border: 1px solid #444; border-radius: 4px;">
            <strong>TL ${index + 1}:</strong><br>
            <span style="color: ${paused ? '#ff9800' : '#4CAF50'}">● ${paused ? 'Paused' : 'Playing'}</span><br>
            Progress: <span style="color: #2196F3">${(progress * 100).toFixed(1)}%</span><br>
            Duration: ${duration.toFixed(2)}s
          </div>
        `;
      }
    });

    // Информация о элементах портфолио
    html += this.getPortfolioElementsInfo();

    this.debugPanel.innerHTML = html;
  }

  /**
   * Получает информацию о элементах портфолио
   */
  private getPortfolioElementsInfo(): string {
    const wrapper = document.querySelector('.portfolio__wrapper');
    if (!wrapper) return '<h4>❌ Portfolio wrapper not found</h4>';

    const items = Array.from(wrapper.children) as HTMLElement[];
    let html = `<h4>🎴 Portfolio Items (${items.length})</h4>`;

    items.forEach((item, index) => {
      const computedStyle = window.getComputedStyle(item);
      const transform = computedStyle.transform;
      const position = computedStyle.position;
      const zIndex = computedStyle.zIndex;
      const opacity = computedStyle.opacity;
      
      html += `
        <div style="margin-bottom: 8px; padding: 5px; border: 1px solid #444; border-radius: 4px;">
          <strong>Item ${index}:</strong> ${item.id || 'unnamed'}<br>
          Position: <span style="color: #ff9800">${position}</span><br>
          Z-Index: ${zIndex}<br>
          Opacity: ${opacity}<br>
          Transform: <span style="color: #9c27b0; font-size: 10px;">${transform !== 'none' ? transform.substring(0, 50) + '...' : 'none'}</span>
        </div>
      `;
    });

    return html;
  }

  /**
   * Логирует детальную информацию о ScrollTrigger в консоль
   */
  logScrollTriggerDetails(): void {
    console.group('🔍 GSAP ScrollTrigger Analysis');
    
    const scrollTriggers = ScrollTrigger.getAll();
    console.log(`Found ${scrollTriggers.length} ScrollTriggers`);
    
    scrollTriggers.forEach((st, index) => {
      console.group(`ScrollTrigger ${index + 1}`);
      console.log('Trigger element:', st.trigger);
      console.log('Progress:', st.progress);
      console.log('Is Active:', st.isActive);
      console.log('Start:', st.start);
      console.log('End:', st.end);
      console.log('Pin:', st.pin);
      console.log('Scroller:', st.scroller);
      console.groupEnd();
    });
    
    console.groupEnd();
  }

  /**
   * Анализирует CSS стили элементов портфолио
   */
  analyzePortfolioStyles(): void {
    console.group('🎨 Portfolio Styles Analysis');
    
    const wrapper = document.querySelector('.portfolio__wrapper');
    if (!wrapper) {
      console.error('Portfolio wrapper not found!');
      console.groupEnd();
      return;
    }

    console.log('Wrapper styles:', {
      position: getComputedStyle(wrapper).position,
      overflow: getComputedStyle(wrapper).overflow,
      height: getComputedStyle(wrapper).height,
      width: getComputedStyle(wrapper).width,
    });

    const items = Array.from(wrapper.children) as HTMLElement[];
    console.log(`Found ${items.length} portfolio items`);
    
    items.forEach((item, index) => {
      const styles = getComputedStyle(item);
      console.log(`Item ${index} (${item.id}):`, {
        position: styles.position,
        top: styles.top,
        left: styles.left,
        zIndex: styles.zIndex,
        transform: styles.transform,
        opacity: styles.opacity,
        visibility: styles.visibility,
      });
    });
    
    console.groupEnd();
  }

  /**
   * Удаляет панель отладки
   */
  removeDebugPanel(): void {
    if (this.debugPanel) {
      this.debugPanel.remove();
      this.debugPanel = null;
    }
  }

  /**
   * Запускает полный анализ
   */
  runFullAnalysis(): void {
    console.clear();
    console.log('🚀 Starting GSAP Full Analysis...');
    
    this.logScrollTriggerDetails();
    this.analyzePortfolioStyles();
    this.createDebugPanel();
    
    // Обновляем панель каждые 100мс
    setInterval(() => {
      this.updateDebugInfo();
    }, 100);
    
    console.log('✅ Analysis complete. Check the debug panel in the top-right corner.');
  }
}

// Экспортируем singleton instance
export const gsapDebugger = GSAPDebugger.getInstance();

// Добавляем в window для доступа из консоли
if (typeof window !== 'undefined') {
  (window as any).gsapDebugger = gsapDebugger;
}