'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Test3DComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateStatus = (msg: string) => {
      if (statusRef.current) {
        statusRef.current.textContent = msg;
      }
      console.log(msg);
    };

    updateStatus('Initializing Three.js...');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Load model
    updateStatus('Loading model...');
    const loader = new GLTFLoader();
    
    loader.load(
      '/model/avatar.glb',
      (gltf) => {
        updateStatus('Model loaded successfully!');
        console.log('Model:', gltf);
        
        scene.add(gltf.scene);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        gltf.scene.position.y = 0;
        
        // Scale if needed
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        gltf.scene.scale.multiplyScalar(scale);
      },
      (progress) => {
        const percent = progress.total ? (progress.loaded / progress.total * 100).toFixed(2) : '0';
        updateStatus(`Loading: ${percent}%`);
      },
      (error) => {
        updateStatus(`Error: ${error.message}`);
        console.error('Error loading model:', error);
      }
    );

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div 
        ref={statusRef}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          zIndex: 1000,
          fontFamily: 'monospace'
        }}
      >
        Initializing...
      </div>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
    </div>
  );
}