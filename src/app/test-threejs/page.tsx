'use client';

import { useEffect, useState } from 'react';

export default function TestThreeJS() {
  const [status, setStatus] = useState<{
    threeLoaded: boolean;
    webglSupported: boolean;
    errors: string[];
  }>({
    threeLoaded: false,
    webglSupported: false,
    errors: []
  });

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const webglSupported = !!gl;

    // Check if Three.js is loaded
    const checkThree = () => {
      if (typeof window !== 'undefined' && (window as any).THREE) {
        setStatus(prev => ({ ...prev, threeLoaded: true }));
        console.log('Three.js version:', (window as any).THREE.REVISION);
      }
    };

    setStatus(prev => ({ ...prev, webglSupported }));
    
    // Check immediately
    checkThree();
    
    // Also check after a delay
    const timer = setTimeout(checkThree, 2000);

    // Try to load Three.js dynamically
    import('three').then((THREE) => {
      console.log('Three.js loaded dynamically:', THREE);
      (window as any).THREE = THREE;
      setStatus(prev => ({ ...prev, threeLoaded: true }));
    }).catch(err => {
      console.error('Failed to load Three.js:', err);
      setStatus(prev => ({ 
        ...prev, 
        errors: [...prev.errors, `Three.js load error: ${err.message}`]
      }));
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>Three.js Diagnostic Page</h1>
      
      <h2>Status:</h2>
      <ul>
        <li>
          WebGL Support: {' '}
          <span style={{ color: status.webglSupported ? 'green' : 'red' }}>
            {status.webglSupported ? '✓ Supported' : '✗ Not Supported'}
          </span>
        </li>
        <li>
          Three.js Loaded: {' '}
          <span style={{ color: status.threeLoaded ? 'green' : 'red' }}>
            {status.threeLoaded ? '✓ Loaded' : '✗ Not Loaded'}
          </span>
        </li>
      </ul>

      {status.errors.length > 0 && (
        <>
          <h2>Errors:</h2>
          <ul style={{ color: 'red' }}>
            {status.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </>
      )}

      <h2>Browser Info:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify({
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'N/A',
          language: typeof navigator !== 'undefined' ? navigator.language : 'N/A',
        }, null, 2)}
      </pre>

      <h2>Console Output:</h2>
      <p>Check browser console for detailed logs</p>

      <h2>Test Links:</h2>
      <ul>
        <li><a href="/test-3d-model.html">Static HTML Test Page</a></li>
        <li><a href="/#about">Main App - About Section</a></li>
      </ul>
    </div>
  );
}