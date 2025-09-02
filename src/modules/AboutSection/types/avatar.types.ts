import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

// Строгая типизация для внутренней работы хука
export interface AvatarScene {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  controls: OrbitControls;
  clock: THREE.Clock;
}

export interface AvatarAssets {
  avatar: THREE.Group;
  groundMesh: THREE.Mesh;
  mixer: THREE.AnimationMixer;
  waveAction: THREE.AnimationAction | null;
  stumbleAction: THREE.AnimationAction | null;
}

export interface AvatarState {
  isAnimationPlaying: boolean;
  isStumbling: boolean;
  isDisposed: boolean;
  isVisible: boolean;
}