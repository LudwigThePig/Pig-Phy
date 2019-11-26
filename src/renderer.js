import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { height, width, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';


const scene = new THREE.Scene();
scene.background = new THREE.Color(color.black);

const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);


const loader = new GLTFLoader();

let pig;
// load a resource
loader.load(
  'assets/objs/pig.glb',
  gltf => {
    pig = gltf.scene;
    pig.position.set(0, 0, 0);
    scene.add(pig);
  },
  xhr => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
  err => console.error(err),
);

function animate() {
  if (pig) {
    pig.rotation.x += 0.01;
    pig.rotation.y += 0.01;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

const ambientLight = new THREE.AmbientLight(lightColors.softWhite, 3); // soft white light
scene.add(ambientLight);

const topLight = new THREE.PointLight(lightColors.white, 2, 100);
topLight.position.set(1, 1, 1);
scene.add(topLight);

animate();

// Export for init
export default renderer;
