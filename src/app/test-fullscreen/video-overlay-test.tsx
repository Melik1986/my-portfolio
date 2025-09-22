'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Регистрируем плагины
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface TestResult {
  testName: string;
  passed: boolean;
  details: any;
  error?: string;
}

export function VideoOverlayTestComponent() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<any>(null);

  // Симуляция VideoOverlay компонента
  const VideoOverlayMock = ({ 
    isOpen, 
    onClose, 
    testMode = '' 
  }: { 
    isOpen: boolean; 
    onClose: () => void;
    testMode?: string;
  }) => {
    useEffect(() => {
      if (!isOpen || !videoRef.current) return;

      // Применяем различные условия в зависимости от теста
      const applyTestConditions = async () => {
        switch (testMode) {
          case 'gsap-animation':
            // Запускаем GSAP анимацию на оверлее
            if (overlayRef.current) {
              gsap.to(overlayRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                from: { opacity: 0, scale: 0.8 },
              });
            }
            break;

          case 'scroll-smoother':
            // Активируем ScrollSmoother
            if (!smootherRef.current) {
              try {
                smootherRef.current = ScrollSmoother.create({
                  wrapper: '#test-wrapper',
                  content: '#test-content',
                  smooth: 2,
                  effects: true,
                });
              } catch (e) {
                console.error('ScrollSmoother error:', e);
              }
            }
            break;

          case 'scroll-trigger':
            // Создаем ScrollTrigger
            if (contentRef.current) {
              ScrollTrigger.create({
                trigger: contentRef.current,
                start: 'top center',
                end: 'bottom center',
                onUpdate: (self) => {
                  console.log('ScrollTrigger progress:', self.progress);
                },
              });
            }
            break;

          case 'css-transform':
            // Применяем CSS трансформации
            if (overlayRef.current) {
              overlayRef.current.style.transform = 'translateZ(0)';
              overlayRef.current.style.willChange = 'transform';
            }
            break;

          case 'position-fixed':
            // Меняем position на fixed
            if (overlayRef.current) {
              overlayRef.current.style.position = 'fixed';
            }
            break;

          case 'z-index':
            // Устанавливаем высокий z-index
            if (overlayRef.current) {
              overlayRef.current.style.zIndex = '999999';
            }
            break;
        }

        // Пытаемся войти в fullscreen
        try {
          if (videoRef.current && videoRef.current.requestFullscreen) {
            await videoRef.current.requestFullscreen();
          }
        } catch (error) {
          console.error('Fullscreen error:', error);
        }
      };

      applyTestConditions();

      // Cleanup
      return () => {
        if (testMode === 'scroll-smoother' && smootherRef.current) {
          smootherRef.current.kill();
          smootherRef.current = null;
        }
        if (testMode === 'scroll-trigger') {
          ScrollTrigger.getAll().forEach(st => st.kill());
        }
        if (testMode === 'gsap-animation') {
          gsap.killTweensOf(overlayRef.current);
        }
      };
    }, [isOpen, testMode]);

    if (!isOpen) return null;

    return (
      <div 
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000,
        }}
        onClick={onClose}
      >
        <div 
          style={{
            position: 'relative',
            maxWidth: '90vw',
            width: '800px',
            aspectRatio: '16/9',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 2,
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
          <video
            ref={videoRef}
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          >
            <source src="/api/placeholder/800/450" type="video/mp4" />
          </video>
        </div>
      </div>
    );
  };

  // Функция для запуска отдельного теста
  const runSingleTest = async (
    testName: string, 
    testMode: string,
    setupFn?: () => void,
    cleanupFn?: () => void
  ): Promise<TestResult> => {
    const result: TestResult = {
      testName,
      passed: false,
      details: {},
    };

    try {
      // Setup
      if (setupFn) setupFn();

      // Открываем оверлей с тестовым режимом
      setIsOverlayOpen(true);
      
      // Ждем немного для инициализации
      await new Promise(resolve => setTimeout(resolve, 500));

      // Проверяем, открылся ли fullscreen
      const checkFullscreen = () => {
        return document.fullscreenElement !== null ||
               (document as any).webkitFullscreenElement !== null ||
               (document as any).mozFullScreenElement !== null ||
               (document as any).msFullscreenElement !== null;
      };

      // Ждем fullscreen или timeout
      let fullscreenDetected = false;
      for (let i = 0; i < 10; i++) {
        if (checkFullscreen()) {
          fullscreenDetected = true;
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      result.passed = fullscreenDetected;
      result.details = {
        fullscreenDetected,
        testMode,
        videoElement: videoRef.current ? 'present' : 'missing',
      };

      // Выходим из fullscreen если вошли
      if (fullscreenDetected && document.exitFullscreen) {
        await document.exitFullscreen();
      }

      // Закрываем оверлей
      setIsOverlayOpen(false);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Cleanup
      if (cleanupFn) cleanupFn();

    } catch (error: any) {
      result.error = error.message;
      result.passed = false;
    }

    return result;
  };

  // Запуск всех тестов
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Baseline: No GSAP',
        mode: 'baseline',
      },
      {
        name: 'GSAP Animation Active',
        mode: 'gsap-animation',
      },
      {
        name: 'ScrollSmoother Active',
        mode: 'scroll-smoother',
      },
      {
        name: 'ScrollTrigger Active',
        mode: 'scroll-trigger',
      },
      {
        name: 'CSS Transform Applied',
        mode: 'css-transform',
      },
      {
        name: 'Position Fixed',
        mode: 'position-fixed',
      },
      {
        name: 'High Z-Index',
        mode: 'z-index',
      },
    ];

    const results: TestResult[] = [];

    for (const test of tests) {
      const result = await runSingleTest(test.name, test.mode);
      results.push(result);
      setTestResults([...results]);
      
      // Пауза между тестами
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRunningTests(false);
  };

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf('*');
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h2>VideoOverlay Fullscreen Compatibility Tests</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runAllTests}
          disabled={isRunningTests}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: isRunningTests ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunningTests ? 'not-allowed' : 'pointer',
          }}
        >
          {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      <div id="test-wrapper" style={{ position: 'relative' }}>
        <div id="test-content" ref={contentRef}>
          {/* Test overlay будет рендериться здесь */}
          <VideoOverlayMock 
            isOpen={isOverlayOpen} 
            onClose={() => setIsOverlayOpen(false)}
            testMode=""
          />
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Test Results:</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Test Name</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {result.testName}
                </td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  color: result.passed ? 'green' : 'red',
                  fontWeight: 'bold',
                }}>
                  {result.passed ? '✓ PASSED' : '✗ FAILED'}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <pre style={{ margin: 0, fontSize: '12px' }}>
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                  {result.error && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                      Error: {result.error}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}