// Тестовый файл для диагностики анимаций
console.log('🔍 Диагностика анимаций запущена');

// Симуляция проблемы с timeline
const mockTimeline = {
  paused: () => true,
  duration: () => 2.5,
  progress: () => 0,
  play: () => console.log('▶️ Timeline.play() вызван'),
  reverse: () => console.log('◀️ Timeline.reverse() вызван'),
};

// Симуляция ScrollTrigger callbacks
const testScrollTriggerCallbacks = (sectionIndex) => {
  console.log(`\n🎯 Тестирование ScrollTrigger для секции ${sectionIndex}`);

  console.log(`🎯 ScrollTrigger onEnter - Section ${sectionIndex}:`, {
    timeline: mockTimeline,
    timelinePaused: mockTimeline.paused(),
    timelineProgress: mockTimeline.progress(),
    timelineDuration: mockTimeline.duration(),
  });

  mockTimeline.play();

  console.log(`▶️ Timeline play() called - Section ${sectionIndex}:`, {
    timelinePaused: mockTimeline.paused(),
    timelineProgress: mockTimeline.progress(),
  });
};

// Тестируем секции 1 и 2
testScrollTriggerCallbacks(1); // About Section
testScrollTriggerCallbacks(2); // Skills Section

console.log('\n📋 Возможные причины проблемы:');
console.log('1. Timeline создается в состоянии paused: true');
console.log('2. ScrollTrigger не срабатывает из-за неправильного селектора');
console.log('3. Элементы с data-animation не найдены в DOM');
console.log('4. Конфликт с ScrollSmoother');
console.log('5. Timeline.play() не изменяет состояние paused');

console.log('\n🔍 Диагностика завершена');
