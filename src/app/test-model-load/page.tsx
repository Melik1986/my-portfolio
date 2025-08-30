'use client';

import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function TestModelLoadPage() {
  const [status, setStatus] = React.useState('Initializing...');
  const [logs, setLogs] = React.useState<string[]>([]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const addLog = (message: string) => {
      console.log(message);
      setLogs(prev => [...prev, message]);
    };

    // Test 1: Direct fetch
    addLog('Test 1: Checking if model file exists...');
    fetch('/model/avatar.glb')
      .then(response => {
        addLog(`Fetch status: ${response.status} ${response.statusText}`);
        addLog(`Content-Type: ${response.headers.get('content-type')}`);
        addLog(`Content-Length: ${response.headers.get('content-length')} bytes`);
        return response.arrayBuffer();
      })
      .then(data => {
        addLog(`Model data received: ${data.byteLength} bytes`);
      })
      .catch(error => {
        addLog(`Fetch error: ${error.message}`);
      });

    // Test 2: Three.js setup
    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x222222);
      addLog('Three.js scene created');

      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 5;
      addLog('Camera created');

      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true 
      });
      renderer.setSize(400, 400);
      addLog('Renderer created');

      // Add light
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1);
      scene.add(light);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      addLog('Lights added');

      // Add test cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      addLog('Test cube added');

      // Render once
      renderer.render(scene, camera);
      addLog('Initial render complete');

      // Test 3: GLTFLoader
      const loader = new GLTFLoader();
      addLog('GLTFLoader created');
      
      const modelPath = '/model/avatar.glb';
      addLog(`Loading model from: ${modelPath}`);
      
      loader.load(
        modelPath,
        (gltf) => {
          addLog('SUCCESS: Model loaded!');
          addLog(`Scene type: ${gltf.scene.type}`);
          addLog(`Children count: ${gltf.scene.children.length}`);
          addLog(`Animations: ${gltf.animations.length}`);
          
          // Add model to scene
          scene.add(gltf.scene);
          
          // Center and scale
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          gltf.scene.position.sub(center);
          gltf.scene.scale.setScalar(0.5);
          
          // Render with model
          renderer.render(scene, camera);
          addLog('Model rendered');
          setStatus('Success! Model loaded and rendered.');
          
          // Animate
          const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            gltf.scene.rotation.y += 0.005;
            renderer.render(scene, camera);
          };
          animate();
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            addLog(`Loading: ${percentComplete.toFixed(2)}%`);
          }
        },
        (error) => {
          addLog(`ERROR: ${error.message || error}`);
          setStatus('Error loading model!');
        }
      );

    } catch (error) {
      addLog(`Setup error: ${error.message}`);
      setStatus('Error in setup!');
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Model Loading Test</h1>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status}</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <canvas 
          ref={canvasRef} 
          style={{ 
            border: '2px solid #333',
            display: 'block',
            marginBottom: '1rem'
          }} 
        />
      </div>
      
      <div style={{ 
        background: '#000', 
        color: '#0f0', 
        padding: '1rem',
        borderRadius: '4px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        <h3>Logs:</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            [{i}] {log}
          </div>
        ))}
      </div>
    </div>
  );
}