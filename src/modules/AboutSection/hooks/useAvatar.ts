'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { avatarConfig, avatarControls } from '../config/avatar3d.config';
import { AvatarAnimationState, AvatarRefs } from '../types/about.types';

export const useAvatar = () => {
  const refs = useRef<AvatarRefs>({ container: null });
  const animationState = useRef<AvatarAnimationState>({
    isAnimationPlaying: false,
    isStumbling: false,
  });

  useEffect(() => {
    if (!refs.current.container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(refs.current.container.clientWidth, refs.current.container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    refs.current.container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      refs.current.container.clientWidth / refs.current.container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0.2, 0.5, 1);

    const controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, avatarControls);
    controls.update();

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const spotLight = new THREE.SpotLight(0xffffff, 20, 8, 1);
    spotLight.penumbra = 0.5;
    spotLight.position.set(0, 4, 2);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(1, 1, 2);
    keyLight.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(keyLight);

    const loader = new GLTFLoader();
    loader.load(
      avatarConfig.modelPath,
      (gltf) => {
        const avatar = gltf.scene;
        avatar.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).castShadow = true;
            (child as THREE.Mesh).receiveShadow = true;
          }
        });
        scene.add(avatar);

        const groundGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
          color: avatarConfig.pedestalColor,
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.receiveShadow = true;
        groundMesh.position.y = -0.05;
        scene.add(groundMesh);

        const mixer = new THREE.AnimationMixer(avatar);
        refs.current.mixer = mixer;

        const waveClip =
          THREE.AnimationClip.findByName(gltf.animations, 'Waving') || gltf.animations[0];
        const stumbleClip =
          THREE.AnimationClip.findByName(gltf.animations, 'Stagger') || gltf.animations[1];

        const waveAction = waveClip ? mixer.clipAction(waveClip) : null;
        const stumbleAction = stumbleClip ? mixer.clipAction(stumbleClip) : null;

        // Проверяем, что у нас есть хотя бы одна анимация
        if (!waveAction && !stumbleAction) {
          console.warn('No animations found in the model');
          return;
        }

        console.log('Animations loaded:', {
          waveAction: !!waveAction,
          stumbleAction: !!stumbleAction,
          waveClip: waveClip?.name,
          stumbleClip: stumbleClip?.name,
        });

        const raycaster = new THREE.Raycaster();
        refs.current.container?.addEventListener('mousedown', (event) => {
          const coords = {
            x: (event.offsetX / refs.current!.container!.clientWidth) * 2 - 1,
            y: -(event.offsetY / refs.current!.container!.clientHeight) * 2 + 1,
          };

          raycaster.setFromCamera(new THREE.Vector2(coords.x, coords.y), camera);
          const intersects = raycaster.intersectObjects(scene.children, true);

          if (intersects.length > 0) {
            // Проверяем, что у нас есть анимации для воспроизведения
            if (!waveAction && !stumbleAction) {
              console.warn('No animations available');
              return;
            }

            if (animationState.current.isStumbling) return;

            if (!animationState.current.isAnimationPlaying) {
              if (waveAction) {
                waveAction.reset().play();
                animationState.current.isAnimationPlaying = true;
              }
            } else {
              if (stumbleAction && waveAction) {
                animationState.current.isStumbling = true;
                stumbleAction.reset().play();
                waveAction.crossFadeTo(stumbleAction, 0.3, true);

                setTimeout(() => {
                  if (waveAction && stumbleAction) {
                    waveAction.reset().play();
                    stumbleAction.crossFadeTo(waveAction, 1, true);
                    setTimeout(() => (animationState.current.isStumbling = false), 1000);
                  }
                }, 4000);
              }
            }
          }
        });
      },
      undefined,
      (error) => console.error('Error loading model:', error),
    );

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      refs.current.mixer?.update(clock.getDelta());
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = refs.current!.container!.clientWidth / refs.current!.container!.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(refs.current!.container!.clientWidth, refs.current!.container!.clientHeight);
    });

    refs.current.renderer = renderer;
    refs.current.camera = camera;
    refs.current.scene = scene;
    refs.current.clock = clock;
    refs.current.controls = controls;
  }, []);

  return refs;
};
