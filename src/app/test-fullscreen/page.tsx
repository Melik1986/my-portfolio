'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './test-styles.css';

// Регистрируем плагины GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function TestFullscreenPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [currentTest, setCurrentTest] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const animatedBoxRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const smootherInstanceRef = useRef<any>(null);

  // Тест 1: GSAP анимации и fullscreen
  const testGSAPAnimation = async () => {
    setCurrentTest('GSAP Animation Test');
    const results: any = { test: 'GSAP Animation' };
    
    try {
      // Запускаем анимацию
      if (animatedBoxRef.current) {
        gsap.to(animatedBoxRef.current, {
          rotation: 360,
          scale: 1.5,
          duration: 2,
          repeat: -1,
          yoyo: true,
        });
      }

      // Пытаемся войти в fullscreen во время анимации
      if (videoRef.current) {
        results.animationActive = true;
        
        try {
          await videoRef.current.requestFullscreen();
          results.fullscreenSuccess = true;
          results.error = null;
          
          // Выходим из fullscreen через 2 секунды
          setTimeout(() => {
            document.exitFullscreen();
          }, 2000);
        } catch (error: any) {
          results.fullscreenSuccess = false;
          results.error = error.message;
        }
      }

      // Останавливаем анимацию
      gsap.killTweensOf(animatedBoxRef.current);
      
    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(prev => ({ ...prev, gsapAnimation: results }));
  };

  // Тест 2: ScrollSmoother и fullscreen
  const testScrollSmoother = async () => {
    setCurrentTest('ScrollSmoother Test');
    const results: any = { test: 'ScrollSmoother' };

    try {
      // Создаем ScrollSmoother
      smootherInstanceRef.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper-test',
        content: '#smooth-content-test',
        smooth: 2,
        effects: true,
      });

      results.scrollSmootherActive = true;

      // Пытаемся войти в fullscreen
      if (videoRef.current) {
        try {
          await videoRef.current.requestFullscreen();
          results.fullscreenSuccess = true;
          results.error = null;

          setTimeout(() => {
            document.exitFullscreen();
          }, 2000);
        } catch (error: any) {
          results.fullscreenSuccess = false;
          results.error = error.message;
        }
      }

      // Уничтожаем ScrollSmoother
      if (smootherInstanceRef.current) {
        smootherInstanceRef.current.kill();
        smootherInstanceRef.current = null;
      }

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(prev => ({ ...prev, scrollSmoother: results }));
  };

  // Тест 3: ScrollTrigger и fullscreen
  const testScrollTrigger = async () => {
    setCurrentTest('ScrollTrigger Test');
    const results: any = { test: 'ScrollTrigger' };

    try {
      // Создаем ScrollTrigger
      if (animatedBoxRef.current) {
        ScrollTrigger.create({
          trigger: animatedBoxRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
          animation: gsap.to(animatedBoxRef.current, {
            x: 100,
            rotation: 180,
          }),
        });
      }

      results.scrollTriggerActive = true;

      // Пытаемся войти в fullscreen
      if (videoRef.current) {
        try {
          await videoRef.current.requestFullscreen();
          results.fullscreenSuccess = true;
          results.error = null;

          setTimeout(() => {
            document.exitFullscreen();
          }, 2000);
        } catch (error: any) {
          results.fullscreenSuccess = false;
          results.error = error.message;
        }
      }

      // Очищаем ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(prev => ({ ...prev, scrollTrigger: results }));
  };

  // Тест 4: Асинхронные операции и fullscreen
  const testAsyncOperations = async () => {
    setCurrentTest('Async Operations Test');
    const results: any = { test: 'Async Operations' };

    try {
      // Запускаем множество асинхронных операций
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          new Promise(resolve => {
            setTimeout(() => resolve(i), Math.random() * 1000);
          })
        );
      }

      results.asyncOperationsRunning = true;

      // Пытаемся войти в fullscreen во время асинхронных операций
      if (videoRef.current) {
        try {
          await videoRef.current.requestFullscreen();
          results.fullscreenSuccess = true;
          results.error = null;

          setTimeout(() => {
            document.exitFullscreen();
          }, 2000);
        } catch (error: any) {
          results.fullscreenSuccess = false;
          results.error = error.message;
        }
      }

      // Ждем завершения всех операций
      await Promise.all(promises);
      results.asyncOperationsCompleted = true;

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(prev => ({ ...prev, asyncOperations: results }));
  };

  // Тест 5: CSS конфликты с GSAP
  const testCSSConflicts = async () => {
    setCurrentTest('CSS Conflicts Test');
    const results: any = { test: 'CSS Conflicts' };

    try {
      // Применяем CSS трансформации
      if (animatedBoxRef.current) {
        animatedBoxRef.current.style.transform = 'translateX(50px) rotate(45deg)';
        animatedBoxRef.current.style.transition = 'all 2s ease';
      }

      // Применяем GSAP анимацию поверх CSS
      if (animatedBoxRef.current) {
        gsap.to(animatedBoxRef.current, {
          x: 100,
          rotation: 90,
          duration: 2,
        });
      }

      results.cssAndGsapActive = true;

      // Пытаемся войти в fullscreen
      if (videoRef.current) {
        try {
          await videoRef.current.requestFullscreen();
          results.fullscreenSuccess = true;
          results.error = null;

          setTimeout(() => {
            document.exitFullscreen();
          }, 2000);
        } catch (error: any) {
          results.fullscreenSuccess = false;
          results.error = error.message;
        }
      }

      // Очищаем стили и анимации
      if (animatedBoxRef.current) {
        animatedBoxRef.current.style.transform = '';
        animatedBoxRef.current.style.transition = '';
        gsap.killTweensOf(animatedBoxRef.current);
      }

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(prev => ({ ...prev, cssConflicts: results }));
  };

  // Тест базового fullscreen без GSAP
  const testBasicFullscreen = async () => {
    setCurrentTest('Basic Fullscreen Test');
    const results: any = { test: 'Basic Fullscreen' };

    try {
      // Убеждаемся, что нет активных GSAP анимаций
      gsap.killTweensOf('*');
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (smootherInstanceRef.current) {
        smootherInstanceRef.current.kill();
        smootherInstanceRef.current = null;
      }

      results.noGSAPActive = true;

      // Пытаемся войти в fullscreen
      if (videoRef.current) {
        try {
          await videoRef.current.requestFullscreen();
          results.fullscreenSuccess = true;
          results.error = null;

          setTimeout(() => {
            document.exitFullscreen();
          }, 2000);
        } catch (error: any) {
          results.fullscreenSuccess = false;
          results.error = error.message;
        }
      }

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(prev => ({ ...prev, basicFullscreen: results }));
  };

  // Комплексный тест: все вместе
  const testComplexScenario = async () => {
    setCurrentTest('Complex Scenario Test');
    const results: any = { test: 'Complex Scenario' };

    try {
      // Активируем все: ScrollSmoother, ScrollTrigger, GSAP анимации
      smootherInstanceRef.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper-test',
        content: '#smooth-content-test',
        smooth: 2,
        effects: true,
      });

      if (animatedBoxRef.current) {
        // GSAP анимация
        gsap.to(animatedBoxRef.current, {
          rotation: 360,
          duration: 2,
          repeat: -1,
        });

        // ScrollTrigger
        ScrollTrigger.create({
          trigger: animatedBoxRef.current,
          start: 'top center',
          animation: gsap.to(animatedBoxRef.current, {
            x: 100,
          }),
        });
      }

      results.allFeaturesActive = true;

      // Пытаемся войти в fullscreen
      if (videoRef.current) {
        try {
          await videoRef.current.requestFullscreen();
          results.fullscreenSuccess = true;
          results.error = null;

          setTimeout(() => {
            document.exitFullscreen();
          }, 2000);
        } catch (error: any) {
          results.fullscreenSuccess = false;
          results.error = error.message;
        }
      }

      // Очищаем все
      gsap.killTweensOf('*');
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (smootherInstanceRef.current) {
        smootherInstanceRef.current.kill();
        smootherInstanceRef.current = null;
      }

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(prev => ({ ...prev, complexScenario: results }));
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      gsap.killTweensOf('*');
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (smootherInstanceRef.current) {
        smootherInstanceRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="test-container">
      <h1>Fullscreen GSAP Compatibility Tests</h1>
      
      <div className="test-info">
        <p>Current Test: <strong>{currentTest || 'None'}</strong></p>
      </div>

      <div className="test-controls">
        <button onClick={testBasicFullscreen}>Test Basic Fullscreen</button>
        <button onClick={testGSAPAnimation}>Test GSAP Animation</button>
        <button onClick={testScrollSmoother}>Test ScrollSmoother</button>
        <button onClick={testScrollTrigger}>Test ScrollTrigger</button>
        <button onClick={testAsyncOperations}>Test Async Operations</button>
        <button onClick={testCSSConflicts}>Test CSS Conflicts</button>
        <button onClick={testComplexScenario}>Test Complex Scenario</button>
      </div>

      <div id="smooth-wrapper-test" className="smooth-wrapper-test">
        <div id="smooth-content-test" className="smooth-content-test">
          <div className="test-content">
            <div className="video-container">
              <video
                ref={videoRef}
                src="/api/placeholder/640/360"
                controls
                className="test-video"
              >
                <source src="/api/placeholder/640/360" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div ref={animatedBoxRef} className="animated-box">
              GSAP Animated Element
            </div>

            <div ref={scrollContainerRef} className="scroll-content">
              <div style={{ height: '200vh' }}>
                <p>Scroll content for testing ScrollTrigger</p>
                <p style={{ marginTop: '100vh' }}>More content below</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="test-results">
        <h2>Test Results:</h2>
        <pre>{JSON.stringify(testResults, null, 2)}</pre>
      </div>
    </div>
  );
}