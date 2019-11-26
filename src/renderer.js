import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { height, width } from './utils/dimensions.js';


const scene = new THREE.Scene();
scene.background = '#ffffff';
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

// Create a Box
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#ED6767' });
const cube = new THREE.Mesh(geometry, material);
scene.background = new THREE.Color('#ffffff');

camera.position.z = 5;


const loader = new GLTFLoader();

let pig;
// load a resource
loader.load('assets/objs/pig.glb',
  gltf => {
    const obj = gltf.scene;
    obj.children[4].position.set(0, 0, 0);
    console.log(obj.children[4]);
    pig = obj.children[4];
    scene.add(obj);
  },
  xhr => {
    console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
  },
  err => console.error(err));

console.log(pig);
function animate() {
  if (pig) {
    pig.rotation.x += 0.01;
    pig.rotation.y += 0.01;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Export for init
export default renderer;
