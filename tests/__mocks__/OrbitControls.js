// Mock для OrbitControls из Three.js
export class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.enabled = true;
    this.enableDamping = false;
    this.enablePan = true;
    this.enableZoom = true;
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    this.target = { x: 0, y: 0, z: 0 };
  }

  update() {
    // Mock update
  }

  dispose() {
    // Mock dispose
  }
}