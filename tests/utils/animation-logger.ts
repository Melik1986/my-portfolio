/**
 * Утилиты для логирования производительности анимаций
 * Отслеживает таймстампы запуска анимаций и сохраняет отчеты
 */

export interface AnimationLogEntry {
  timestamp: number;
  elementId: string;
  dataAttribute: string;
  sectionId: string;
  testScenario: string;
  animationType: string;
  duration?: number;
  delay?: number;
  groupDelay?: number;
}

export class AnimationLogger {
  private logs: AnimationLogEntry[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = performance.now();
  }

  /**
   * Логирует запуск анимации элемента
   */
  logAnimationStart(element: Element, sectionId: string, testScenario: string): void {
    const timestamp = performance.now() - this.startTime;
    const dataAttribute =
      element.getAttribute('data-animation') || 'unknown';
    const elementId = element.id || element.className || 'unnamed-element';
    const duration = element.getAttribute('data-duration');
    const delay = element.getAttribute('data-delay');
    const groupDelay = element.getAttribute('data-group-delay');

    const logEntry: AnimationLogEntry = {
      timestamp,
      elementId,
      dataAttribute,
      sectionId,
      testScenario,
      animationType: dataAttribute,
      duration: duration ? parseFloat(duration) : undefined,
      delay: delay ? parseFloat(delay) : undefined,
      groupDelay: groupDelay ? parseFloat(groupDelay) : undefined,
    };

    this.logs.push(logEntry);
    console.log(
      `[ANIMATION] ${testScenario} - ${sectionId} - ${dataAttribute} started at ${timestamp.toFixed(2)}ms`,
    );
  }

  /**
   * Получает все логи
   */
  getLogs(): AnimationLogEntry[] {
    return [...this.logs];
  }

  /**
   * Очищает логи
   */
  clearLogs(): void {
    this.logs = [];
    this.startTime = performance.now();
  }

  /**
   * Генерирует отчет в виде строки
   */
  generateReport(): string {
    const report = [
      '=== ANIMATION PERFORMANCE REPORT ===',
      `Generated at: ${new Date().toISOString()}`,
      `Total animations logged: ${this.logs.length}`,
      '',
      'Timestamp | Section | Element | Animation | Scenario',
      '---------|---------|---------|-----------|----------',
    ];

    this.logs.forEach((log) => {
      const line = `${log.timestamp.toFixed(2)}ms | ${log.sectionId} | ${log.elementId} | ${log.animationType} | ${log.testScenario}`;
      report.push(line);
    });

    // Анализ групповых задержек
    const groupAnalysis = this.analyzeGroupTimings();
    if (groupAnalysis.length > 0) {
      report.push('', '=== GROUP TIMING ANALYSIS ===');
      report.push(...groupAnalysis);
    }

    return report.join('\n');
  }

  /**
   * Анализирует таймстампы групп элементов
   */
  private analyzeGroupTimings(): string[] {
    const analysis: string[] = [];
    const groupedBySectionAndScenario = new Map<string, AnimationLogEntry[]>();

    // Группируем по секции и сценарию
    this.logs.forEach((log) => {
      const key = `${log.sectionId}-${log.testScenario}`;
      if (!groupedBySectionAndScenario.has(key)) {
        groupedBySectionAndScenario.set(key, []);
      }
      groupedBySectionAndScenario.get(key)!.push(log);
    });

    // Анализируем каждую группу
    groupedBySectionAndScenario.forEach((logs, key) => {
      if (logs.length > 1) {
        const timestamps = logs.map((log) => log.timestamp).sort((a, b) => a - b);
        const minTime = timestamps[0];
        const maxTime = timestamps[timestamps.length - 1];
        const timeDiff = maxTime - minTime;

        analysis.push(`${key}: ${timeDiff.toFixed(2)}ms spread (${logs.length} elements)`);

        // Проверяем критерий ≤ 150ms
        if (timeDiff > 150) {
          analysis.push(`  ⚠️  WARNING: Group timing exceeds 150ms threshold`);
        } else {
          analysis.push(`  ✅ Group timing within acceptable range`);
        }
      }
    });

    return analysis;
  }
}

/**
 * Глобальный экземпляр логгера
 */
export const animationLogger = new AnimationLogger();
