import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer, BoxGeometry, MeshBasicMaterial,
  Mesh,
} from 'three';
import { height, width } from './utils/dimensions.js';

const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(width, height);

// Create a Box
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: '#ED6767' });
const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Export for init
export default renderer;
