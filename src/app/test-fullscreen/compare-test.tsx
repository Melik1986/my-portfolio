'use client';

import React, { useState, useRef } from 'react';
import { VideoOverlay } from '@/modules/AiVideoContentSection/component/VideoOverlay/VideoOverlay';
import { VideoOverlayFixed } from '@/modules/AiVideoContentSection/component/VideoOverlay/VideoOverlayFixed';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface TestResult {
  component: string;
  gsapActive: boolean;
  fullscreenSuccess: boolean;
  errors: string[];
  timing: number;
}

export default function CompareTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isFixedOpen, setIsFixedOpen] = useState(false);
  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const fixedVideoRef = useRef<HTMLVideoElement>(null);
  const smootherRef = useRef<any>(null);

  const testVideoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  // Инициализация GSAP окружения
  const initializeGSAPEnvironment = () => {
    // Создаем ScrollSmoother
    if (!smootherRef.current) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: '#test-smooth-wrapper',
        content: '#test-smooth-content',
        smooth: 2,
        effects: true,
      });
    }

    // Создаем несколько GSAP анимаций
    gsap.to('.test-animated-element', {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'none',
    });

    // Создаем ScrollTrigger
    ScrollTrigger.create({
      trigger: '.test-trigger-element',
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        console.log('ScrollTrigger progress:', self.progress);
      },
    });

    return true;
  };

  // Очистка GSAP окружения
  const cleanupGSAPEnvironment = () => {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(st => st.kill());
    if (smootherRef.current) {
      smootherRef.current.kill();
      smootherRef.current = null;
    }
  };

  // Тест оригинального компонента
  const testOriginalComponent = async () => {
    setCurrentTest('Testing Original VideoOverlay');
    const startTime = performance.now();
    const result: TestResult = {
      component: 'Original VideoOverlay',
      gsapActive: false,
      fullscreenSuccess: false,
      errors: [],
      timing: 0,
    };

    try {
      // Инициализируем GSAP
      result.gsapActive = initializeGSAPEnvironment();

      // Открываем оверлей
      setIsOriginalOpen(true);

      // Ждем инициализации
      await new Promise(resolve => setTimeout(resolve, 500));

      // Пытаемся войти в fullscreen
      if (originalVideoRef.current) {
        try {
          await originalVideoRef.current.requestFullscreen();
          result.fullscreenSuccess = true;
          
          // Выходим из fullscreen
          await new Promise(resolve => setTimeout(resolve, 2000));
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          }
        } catch (error: any) {
          result.errors.push(`Fullscreen failed: ${error.message}`);
        }
      }

      // Закрываем оверлей
      setIsOriginalOpen(false);
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      result.errors.push(`Test error: ${error.message}`);
    } finally {
      cleanupGSAPEnvironment();
      result.timing = performance.now() - startTime;
      setTestResults(prev => [...prev, result]);
    }
  };

  // Тест исправленного компонента
  const testFixedComponent = async () => {
    setCurrentTest('Testing Fixed VideoOverlay');
    const startTime = performance.now();
    const result: TestResult = {
      component: 'Fixed VideoOverlay',
      gsapActive: false,
      fullscreenSuccess: false,
      errors: [],
      timing: 0,
    };

    try {
      // Инициализируем GSAP
      result.gsapActive = initializeGSAPEnvironment();

      // Открываем оверлей
      setIsFixedOpen(true);

      // Ждем инициализации
      await new Promise(resolve => setTimeout(resolve, 500));

      // Пытаемся войти в fullscreen
      if (fixedVideoRef.current) {
        try {
          await fixedVideoRef.current.requestFullscreen();
          result.fullscreenSuccess = true;
          
          // Выходим из fullscreen
          await new Promise(resolve => setTimeout(resolve, 2000));
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          }
        } catch (error: any) {
          result.errors.push(`Fullscreen failed: ${error.message}`);
        }
      }

      // Закрываем оверлей
      setIsFixedOpen(false);
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      result.errors.push(`Test error: ${error.message}`);
    } finally {
      cleanupGSAPEnvironment();
      result.timing = performance.now() - startTime;
      setTestResults(prev => [...prev, result]);
    }
  };

  // Запуск обоих тестов последовательно
  const runComparisonTest = async () => {
    setTestResults([]);
    setCurrentTest('Starting comparison test...');
    
    // Тестируем оригинальный компонент
    await testOriginalComponent();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Тестируем исправленный компонент
    await testFixedComponent();
    
    setCurrentTest('Tests completed');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>VideoOverlay Comparison Test</h1>
      <p>Сравнение оригинального и исправленного компонентов с активным GSAP окружением</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runComparisonTest}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Run Comparison Test
        </button>
        
        <button
          onClick={() => setIsOriginalOpen(true)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Open Original Overlay
        </button>
        
        <button
          onClick={() => setIsFixedOpen(true)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Open Fixed Overlay
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>Current Test:</strong> {currentTest}
      </div>

      {/* GSAP Test Environment */}
      <div id="test-smooth-wrapper" style={{ height: '400px', overflow: 'auto', border: '1px solid #ddd', marginBottom: '20px' }}>
        <div id="test-smooth-content">
          <div className="test-animated-element" style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            margin: '20px auto',
            borderRadius: '10px',
          }}>
            Animated
          </div>
          
          <div className="test-trigger-element" style={{
            height: '200px',
            background: '#e0e0e0',
            padding: '20px',
            margin: '20px',
          }}>
            ScrollTrigger Element
          </div>
          
          <div style={{ height: '600px', padding: '20px' }}>
            <p>Scroll content for testing ScrollSmoother and ScrollTrigger</p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Test Results:</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Component</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>GSAP Active</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fullscreen</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Timing (ms)</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Errors</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {result.component}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {result.gsapActive ? '✅ Yes' : '❌ No'}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd',
                    color: result.fullscreenSuccess ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}>
                    {result.fullscreenSuccess ? '✅ Success' : '❌ Failed'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {result.timing.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {result.errors.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {result.errors.map((error, i) => (
                          <li key={i} style={{ color: 'red' }}>{error}</li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ color: 'green' }}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {testResults.length === 2 && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '8px' }}>
              <h3>Comparison Summary:</h3>
              <ul>
                <li>
                  <strong>Original Component:</strong> {' '}
                  {testResults[0].fullscreenSuccess ? '✅ Works' : '❌ Fails'} with GSAP
                </li>
                <li>
                  <strong>Fixed Component:</strong> {' '}
                  {testResults[1].fullscreenSuccess ? '✅ Works' : '❌ Fails'} with GSAP
                </li>
                <li>
                  <strong>Performance:</strong> {' '}
                  Fixed is {((testResults[0].timing - testResults[1].timing) / testResults[0].timing * 100).toFixed(1)}% 
                  {testResults[1].timing < testResults[0].timing ? ' faster' : ' slower'}
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Hidden overlays */}
      <VideoOverlay
        isOpen={isOriginalOpen}
        src={testVideoSrc}
        onClose={() => setIsOriginalOpen(false)}
        videoRef={originalVideoRef}
      />

      <VideoOverlayFixed
        isOpen={isFixedOpen}
        src={testVideoSrc}
        onClose={() => setIsFixedOpen(false)}
        videoRef={fixedVideoRef}
      />
    </div>
  );
}