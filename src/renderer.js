import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { height, width } from './utils/dimensions.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

// Create a Box
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#ED6767' });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;


const loader = new GLTFLoader();

let pig;
// load a resource
loader.load(
  'assets/objs/pig.glb',
  gltf => {
    scene.add(gltf.scene);
  },
  xhr => {
    console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
  },
  err => console.error(err),
);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Export for init
export default renderer;
