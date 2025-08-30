'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useAvatarDebug = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const loadingRef = useRef<boolean>(true);
  const errorRef = useRef<string | null>(null);

  const init = useCallback(() => {
    if (!containerRef.current) return;

    console.log('[Avatar Debug] Starting initialization...');
    
    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1, 3);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.update();

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Ground (pedestal)
      const groundGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x29abe2 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.position.y = -0.05;
      ground.receiveShadow = true;
      scene.add(ground);

      console.log('[Avatar Debug] Basic scene created');

      // Load model
      const loader = new GLTFLoader();
      const modelPath = '/model/avatar.glb';
      
      console.log(`[Avatar Debug] Loading model from: ${modelPath}`);
      
      loader.load(
        modelPath,
        (gltf: GLTF) => {
          console.log('[Avatar Debug] Model loaded successfully', gltf);
          
          const model = gltf.scene;
          model.scale.set(0.5, 0.5, 0.5);
          model.position.y = 0;
          
          // Enable shadows
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          scene.add(model);
          loadingRef.current = false;
          
          // Dispatch custom event
          containerRef.current?.dispatchEvent(new CustomEvent('modelLoaded'));
          console.log('[Avatar Debug] Model added to scene');
        },
        (xhr) => {
          const progress = (xhr.loaded / xhr.total) * 100;
          console.log(`[Avatar Debug] Loading progress: ${progress.toFixed(2)}%`);
        },
        (error) => {
          console.error('[Avatar Debug] Error loading model:', error);
          errorRef.current = error.message || 'Failed to load model';
          loadingRef.current = false;
        }
      );

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      };
    } catch (error) {
      console.error('[Avatar Debug] Initialization error:', error);
      errorRef.current = error.message || 'Initialization failed';
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const cleanup = init();
    return () => {
      cleanup?.();
    };
  }, [init]);

  return {
    containerRef,
    isLoading: loadingRef.current,
    error: errorRef.current,
  };
};