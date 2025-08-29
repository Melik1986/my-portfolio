'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GlassCard } from '@/lib/ui';
import styles from './Avatar.module.scss';
import { useI18n } from '@/i18n';
import { avatarConfig, avatarControls } from '../../config/avatar3d.config';

export function AvatarFixed() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    mixer?: THREE.AnimationMixer;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('[AvatarFixed] Initializing...');
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0.2, 0.5, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, avatarControls);
    controls.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 20, 8, 1);
    spotLight.penumbra = 0.5;
    spotLight.position.set(0, 4, 2);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(1, 1, 2);
    keyLight.lookAt(0, 0, 0);
    scene.add(keyLight);

    // Ground
    const groundGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--avatar-podium-color')
          .trim() || '#e0e0e0'
      ),
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -0.05;
    scene.add(groundMesh);

    // Store refs
    sceneRef.current = { renderer, scene, camera, controls };

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      
      if (sceneRef.current.mixer) {
        sceneRef.current.mixer.update(clock.getDelta());
      }
      
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Load model
    console.log('[AvatarFixed] Loading model...');
    const loader = new GLTFLoader();
    loader.load(
      avatarConfig.modelPath,
      (gltf) => {
        console.log('[AvatarFixed] Model loaded!', gltf);
        
        const avatar = gltf.scene;
        
        // Setup shadows
        avatar.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Center model
        const box = new THREE.Box3().setFromObject(avatar);
        const center = box.getCenter(new THREE.Vector3());
        avatar.position.sub(center);
        avatar.position.y = 0;

        // Scale model
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1 / maxDim;
        avatar.scale.setScalar(scale);

        // Add to scene
        scene.add(avatar);

        // Setup animations
        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(avatar);
          const waveClip = gltf.animations.find(clip => clip.name === 'Waving') || gltf.animations[0];
          if (waveClip) {
            const action = mixer.clipAction(waveClip);
            action.play();
          }
          sceneRef.current.mixer = mixer;
        }

        // Finish loading
        setIsLoading(false);
        container.dispatchEvent(new CustomEvent('modelLoaded'));
      },
      undefined,
      (error) => {
        console.error('[AvatarFixed] Error loading model:', error);
        setIsLoading(false);
      }
    );

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Handle click
    const handleClick = (event: MouseEvent) => {
      if (!container || !camera || !scene) return;

      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0 && sceneRef.current.mixer) {
        console.log('[AvatarFixed] Click detected!');
        // Play animation or do something
      }
    };
    container.addEventListener('click', handleClick);

    // Handle hover
    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isOverAvatar = event.clientX >= rect.left && 
                          event.clientX <= rect.right && 
                          event.clientY >= rect.top && 
                          event.clientY <= rect.bottom;
      
      setTooltipVisible(isOverAvatar);
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', () => setTooltipVisible(false));

    // Cleanup
    return () => {
      console.log('[AvatarFixed] Cleaning up...');
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousemove', handleMouseMove);
      
      if (sceneRef.current.mixer) {
        sceneRef.current.mixer.stopAllAction();
      }
      
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        id="avaturn-container"
        className={styles['avatar-container']}
        data-animation="slide-right"
        data-delay="0.5"
        data-duration="0.8"
        data-ease="power2.out"
      >
        {isLoading && (
          <div id="avaturn-loading" className={styles['avatar-loading']}>
            {t('common.loading')}
          </div>
        )}
      </div>
      
      {tooltipVisible && (
        <div className={`${styles.tooltip} ${styles['tooltip--visible']}`}>
          <GlassCard>
            <div className={styles.tooltip__content}>
              <h3>{t('section.about.avatar.title')}</h3>
              <p>{t('section.about.avatar.subtitle')}</p>
              <ul>
                <li>{t('section.about.avatar.features.greeting')}</li>
                <li>{t('section.about.avatar.features.reactivity')}</li>
                <li>{t('section.about.avatar.features.scaling')}</li>
              </ul>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}