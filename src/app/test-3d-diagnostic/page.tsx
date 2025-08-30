'use client';

import React from 'react';
import * as THREE from 'three';
import styles from './diagnostic.module.scss';

export default function Test3DDiagnosticPage() {
  const [diagnostics, setDiagnostics] = React.useState({
    webgl: false,
    webgl2: false,
    threejs: false,
    modelUrl: '/model/avatar.glb',
    modelExists: false,
    errors: [] as string[],
    logs: [] as string[],
  });

  React.useEffect(() => {
    const runDiagnostics = async () => {
      const newDiagnostics = { ...diagnostics };
      
      // Check WebGL support
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const gl2 = canvas.getContext('webgl2');
        newDiagnostics.webgl = !!gl;
        newDiagnostics.webgl2 = !!gl2;
        newDiagnostics.logs.push(`WebGL: ${!!gl}, WebGL2: ${!!gl2}`);
      } catch (e) {
        newDiagnostics.errors.push(`WebGL check failed: ${e}`);
      }

      // Check Three.js
      try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        newDiagnostics.threejs = true;
        newDiagnostics.logs.push('Three.js initialized successfully');
      } catch (e) {
        newDiagnostics.threejs = false;
        newDiagnostics.errors.push(`Three.js init failed: ${e}`);
      }

      // Check model URL
      try {
        const response = await fetch(newDiagnostics.modelUrl, { method: 'HEAD' });
        newDiagnostics.modelExists = response.ok;
        newDiagnostics.logs.push(`Model fetch status: ${response.status}`);
      } catch (e) {
        newDiagnostics.errors.push(`Model fetch failed: ${e}`);
      }

      setDiagnostics(newDiagnostics);
    };

    runDiagnostics();

    // Test direct Three.js render
    const testRender = () => {
      try {
        const container = document.getElementById('test-canvas-container');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x222222);

        // Camera
        const camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
        );
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Add simple cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);

        // Render
        const animate = () => {
          requestAnimationFrame(animate);
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
        };
        animate();

        setDiagnostics(prev => ({
          ...prev,
          logs: [...prev.logs, 'Test cube rendered successfully']
        }));
      } catch (e) {
        setDiagnostics(prev => ({
          ...prev,
          errors: [...prev.errors, `Test render failed: ${e}`]
        }));
      }
    };

    setTimeout(testRender, 100);
  }, []);

  return (
    <div className={styles.page}>
      <h1>3D Rendering Diagnostics</h1>
      
      <div className={styles.section}>
        <h2>System Checks</h2>
        <ul>
          <li>WebGL Support: {diagnostics.webgl ? '✅' : '❌'}</li>
          <li>WebGL2 Support: {diagnostics.webgl2 ? '✅' : '❌'}</li>
          <li>Three.js: {diagnostics.threejs ? '✅' : '❌'}</li>
          <li>Model File ({diagnostics.modelUrl}): {diagnostics.modelExists ? '✅ Found' : '❌ Not Found'}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Test Canvas (Green Cube)</h2>
        <div id="test-canvas-container" className={styles.canvasContainer}></div>
      </div>

      <div className={styles.section}>
        <h2>Logs</h2>
        <pre className={styles.logs}>
          {diagnostics.logs.join('\n')}
        </pre>
      </div>

      {diagnostics.errors.length > 0 && (
        <div className={styles.section}>
          <h2>Errors</h2>
          <pre className={styles.errors}>
            {diagnostics.errors.join('\n')}
          </pre>
        </div>
      )}

      <div className={styles.section}>
        <h2>Browser Info</h2>
        <pre>
          {JSON.stringify({
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}