import {
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  WebGLRenderer,
} from 'three';
import { AuroraConfig } from '@/modules/AboutSection/types/about.types';

export class AuroraSceneManager {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private points: Points;
  private config: AuroraConfig;

  constructor(container: HTMLElement, config: AuroraConfig) {
    this.config = config;
    this.scene = this.createScene();
    this.camera = this.createCamera(container);
    this.points = this.createParticles();
    this.renderer = this.createRenderer(container);
  }

  private createScene(): Scene {
    return new Scene();
  }

  private createCamera(container: HTMLElement): PerspectiveCamera {
    const camera = new PerspectiveCamera(
      75,
      container.offsetWidth / container.offsetHeight,
      1,
      10000,
    );
    camera.position.z = 1000;
    return camera;
  }

  private createParticles(): Points {
    const geometry = this.createGeometry();
    const material = this.createMaterial();
    const points = new Points(geometry, material);
    this.scene.add(points);
    return points;
  }

  private createGeometry(): BufferGeometry {
    const geometry = new BufferGeometry();
    const positions = [];
    const sizes = [];

    for (let ix = 0; ix < this.config.amountX; ix++) {
      for (let iy = 0; iy < this.config.amountY; iy++) {
        positions.push(
          ix * this.config.separation - (this.config.amountX * this.config.separation) / 2,
          0,
          iy * this.config.separation - (this.config.amountY * this.config.separation) / 2,
        );
        sizes.push(1.0);
      }
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    return geometry;
  }

  private createMaterial(): PointsMaterial {
    return new PointsMaterial({
      color: this.config.particleColor,
      size: this.config.particleSize,
      sizeAttenuation: true,
    });
  }

  private createRenderer(container: HTMLElement): WebGLRenderer {
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    const canvas = renderer.domElement;
    this.styleCanvas(canvas);
    container.appendChild(canvas);

    return renderer;
  }

  private styleCanvas(canvas: HTMLCanvasElement): void {
    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'block',
    });
  }

  updateCamera(mouseX: number, mouseY: number): void {
    this.camera.position.x += (mouseX - this.camera.position.x) * this.config.cameraSpeed;
    this.camera.position.y += (-mouseY - this.camera.position.y) * this.config.cameraSpeed;
    this.camera.lookAt(this.scene.position);
  }

  updateParticles(count: number): void {
    const positions = this.points.geometry.attributes.position.array as Float32Array;

    for (let ix = 0; ix < this.config.amountX; ix++) {
      for (let iy = 0; iy < this.config.amountY; iy++) {
        const index = 3 * (ix * this.config.amountY + iy);
        positions[index + 1] =
          Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy(): void {
    this.renderer.dispose();
    this.scene.clear();
  }
}
