/**
 * Глобальное завершение для тестов анимаций
 * Выполняется один раз после всех тестов
 */

import { FullConfig } from '@playwright/test';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🏁 Starting global teardown for animation tests...');

  try {
    const reportsDir = join(process.cwd(), 'test-reports');
    const resultsDir = join(process.cwd(), 'test-results');

    // Собираем все JSON отчеты
    const jsonReports: any[] = [];

    try {
      const reportFiles = readdirSync(reportsDir)
        .filter((file) => file.startsWith('animations-timings-') && file.endsWith('.json'))
        .map((file) => join(reportsDir, file));

      for (const reportFile of reportFiles) {
        try {
          const reportContent = readFileSync(reportFile, 'utf-8');
          const report = JSON.parse(reportContent);
          jsonReports.push(report);
        } catch (error) {
          console.warn(`⚠️  Failed to read report file ${reportFile}:`, error);
        }
      }
    } catch (error) {
      console.warn('⚠️  No report files found or failed to read reports directory');
    }

    // Генерируем сводный отчет
    const summaryReport = generateSummaryReport(jsonReports);

    // Сохраняем сводный отчет
    const summaryPath = join(reportsDir, 'animation-test-summary.json');
    writeFileSync(summaryPath, JSON.stringify(summaryReport, null, 2));

    // Обновляем основной лог файл
    const logPath = join(reportsDir, 'animations-timings.log');
    const summaryLines = [
      '',
      '=== ANIMATION TESTING SESSION COMPLETED ===',
      `Completed at: ${new Date().toISOString()}`,
      `Total test runs: ${summaryReport.totalTestRuns}`,
      `Total animations logged: ${summaryReport.totalAnimations}`,
      `Unique elements tested: ${summaryReport.uniqueElements}`,
      `Animation types found: ${summaryReport.animationTypes.join(', ')}`,
      '',
      'Performance Summary:',
      `- Average animation start time: ${summaryReport.averageAnimationTime.toFixed(2)}ms`,
      `- Fastest animation: ${summaryReport.fastestAnimation.toFixed(2)}ms`,
      `- Slowest animation: ${summaryReport.slowestAnimation.toFixed(2)}ms`,
      '',
      'Test Scenarios Results:',
      ...summaryReport.scenarioResults.map(
        (scenario: any) =>
          `- ${scenario.name}: ${scenario.animationsCount} animations, avg ${scenario.averageTime.toFixed(2)}ms`,
      ),
      '',
      'Critical Issues Found:',
      ...summaryReport.criticalIssues.map((issue: string) => `❌ ${issue}`),
      '',
      'Recommendations:',
      ...summaryReport.recommendations.map((rec: string) => `💡 ${rec}`),
      '',
      '=== END OF SESSION ===',
    ];

    try {
      const existingLog = readFileSync(logPath, 'utf-8');
      writeFileSync(logPath, existingLog + '\n' + summaryLines.join('\n'));
    } catch (error) {
      writeFileSync(logPath, summaryLines.join('\n'));
    }

    // Выводим результаты в консоль
    console.log('\n📊 ANIMATION TESTING SUMMARY');
    console.log('================================');
    console.log(`Total animations tested: ${summaryReport.totalAnimations}`);
    console.log(`Unique elements: ${summaryReport.uniqueElements}`);
    console.log(`Average start time: ${summaryReport.averageAnimationTime.toFixed(2)}ms`);

    if (summaryReport.criticalIssues.length > 0) {
      console.log('\n❌ CRITICAL ISSUES FOUND:');
      summaryReport.criticalIssues.forEach((issue: string) => {
        console.log(`   ${issue}`);
      });
    } else {
      console.log('\n✅ No critical issues found!');
    }

    if (summaryReport.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      summaryReport.recommendations.forEach((rec: string) => {
        console.log(`   ${rec}`);
      });
    }

    console.log(`\n📁 Detailed reports saved to: ${reportsDir}`);
    console.log(`📄 Summary report: ${summaryPath}`);
    console.log(`📝 Full log: ${logPath}`);

    console.log('\n✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  }
}

function generateSummaryReport(reports: any[]) {
  const allAnimations: any[] = [];
  const scenarioResults: any[] = [];
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  // Собираем все анимации из отчетов
  reports.forEach((report) => {
    if (report.browserLogs && Array.isArray(report.browserLogs)) {
      allAnimations.push(...report.browserLogs);
    }
  });

  // Анализируем данные
  const uniqueElements = new Set(allAnimations.map((anim) => anim.elementId)).size;
  const animationTypes = [...new Set(allAnimations.map((anim) => anim.dataAttribute))];

  const animationTimes = allAnimations
    .map((anim) => anim.timestamp)
    .filter((time) => typeof time === 'number');
  const averageAnimationTime =
    animationTimes.length > 0
      ? animationTimes.reduce((sum, time) => sum + time, 0) / animationTimes.length
      : 0;

  const fastestAnimation = animationTimes.length > 0 ? Math.min(...animationTimes) : 0;
  const slowestAnimation = animationTimes.length > 0 ? Math.max(...animationTimes) : 0;

  // Анализируем группы анимаций (элементы с одинаковыми data-атрибутами)
  const groupedAnimations = new Map<string, any[]>();
  allAnimations.forEach((anim) => {
    const key = anim.dataAttribute;
    if (!groupedAnimations.has(key)) {
      groupedAnimations.set(key, []);
    }
    groupedAnimations.get(key)!.push(anim);
  });

  // Проверяем критерии успешности

  // 1. Проверяем разницу старта между элементами одной группы ≤ 150ms
  groupedAnimations.forEach((animations, groupName) => {
    if (animations.length > 1) {
      const times = animations.map((anim) => anim.timestamp).sort((a, b) => a - b);
      const maxDiff = times[times.length - 1] - times[0];

      if (maxDiff > 150) {
        criticalIssues.push(
          `Group "${groupName}" has animation start difference of ${maxDiff.toFixed(2)}ms (> 150ms limit)`,
        );
      }
    }
  });

  // 2. Проверяем, что все элементы с data-animate запустили анимацию
  if (allAnimations.length === 0) {
    criticalIssues.push('No animations were detected during testing');
  }

  // 3. Генерируем рекомендации
  if (averageAnimationTime > 500) {
    recommendations.push('Consider optimizing animation start time - average is above 500ms');
  }

  if (slowestAnimation - fastestAnimation > 1000) {
    recommendations.push(
      'Large variance in animation start times detected - consider synchronization',
    );
  }

  if (animationTypes.length < 3) {
    recommendations.push(
      'Limited variety of animation types detected - verify all animations are working',
    );
  }

  // Анализируем результаты по сценариям
  reports.forEach((report, index) => {
    if (report.browserLogs && report.browserLogs.length > 0) {
      const scenarioAnimations = report.browserLogs;
      const scenarioTimes = scenarioAnimations.map((anim: any) => anim.timestamp);
      const scenarioAverage =
        scenarioTimes.reduce((sum: number, time: number) => sum + time, 0) / scenarioTimes.length;

      scenarioResults.push({
        name: `Test Run ${index + 1}`,
        animationsCount: scenarioAnimations.length,
        averageTime: scenarioAverage,
        phase: report.phase || 'unknown',
      });
    }
  });

  return {
    timestamp: new Date().toISOString(),
    totalTestRuns: reports.length,
    totalAnimations: allAnimations.length,
    uniqueElements,
    animationTypes,
    averageAnimationTime,
    fastestAnimation,
    slowestAnimation,
    scenarioResults,
    criticalIssues,
    recommendations,
    rawData: {
      allAnimations: allAnimations.slice(0, 100), // Ограничиваем для размера файла
      groupedAnimations: Object.fromEntries(
        Array.from(groupedAnimations.entries()).map(([key, value]) => [key, value.length]),
      ),
    },
  };
}

export default globalTeardown;
