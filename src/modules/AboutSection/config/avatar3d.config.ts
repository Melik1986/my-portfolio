'use client';

import * as THREE from 'three';
import { AvatarConfig, AvatarControls } from '../types/about.types';

export const avatarConfig: AvatarConfig = {
  modelPath: '/model/avatar.glb',
  pedestalColor: 0x00b7eb,
};

export const avatarControls: AvatarControls = {
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
  minDistance: 3,
  minPolarAngle: 1.4,
  maxPolarAngle: 1.4,
  target: new THREE.Vector3(0, 0.75, 0),
};
