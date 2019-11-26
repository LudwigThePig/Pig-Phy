import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { height, width, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';
import { getNewPosition } from './controllers/keyboarInput';
import { forwardVelocity, rotationVelocity } from './utils/velocities';

const OrbitControls = require('three-orbit-controls')(THREE);

/* ******
* Input Controllers *
******* */

const keyboard = {};

const key = {
  forward: 87, // W
  backwards: 83, // S
  left: 65, // A
  right: 68, // D
};
const getKeyCode = event => event.which;
export const keydown = event => { keyboard[getKeyCode(event)] = true; };
export const keyup = event => { keyboard[getKeyCode(event)] = false; };


/* ********
* RENDERER *
********** */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

/* ******
* SCENE *
******* */
const scene = new THREE.Scene();
scene.background = new THREE.Color(color.black);


/* *******
* CAMERA *
******** */
// const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
camera.position.set(0, 1, -3);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera);

camera.position.z = 5;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3(0, 1, 0));


/* *******
* LIGHTS *
******** */
const ambientLight = new THREE.AmbientLight(lightColors.softWhite, 3); // soft white light
scene.add(ambientLight);

const topLight = new THREE.PointLight(lightColors.white, 2, 500);
topLight.position.set(1.5, 3, 1.5);
scene.add(topLight);


/* ********
* GROUND *
********** */
const groundGeometry = new THREE.PlaneGeometry(sceneDimensions.X, sceneDimensions.Z, 1, 1);
const groundMaterial = new THREE.MeshBasicMaterial({ color: color.white, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -90 * (Math.PI / 180);
ground.position.y = 0;
// scene.add(ground);


const gridHelper = new THREE.GridHelper(100, 4);
scene.add(gridHelper);
scene.add(new THREE.AxesHelper(6));


/* 🐷🐷🐷🐷🐷
* PIG MODEL *
🐷🐷🐷🐷🐷🐷 */
const loader = new GLTFLoader();
let pig;
const pigLoadCallback = gltf => {
  pig = gltf.scene;
  pig.position.set(0, 1, 0);
  scene.add(pig);
  pig.add(camera);
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
  draw();
};


/* ********
* LOADERS *
********** */
loader.load( // pig
  'assets/objs/pig.glb',
  pigLoadCallback,
  xhr => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
  err => console.error(err),
);


const updateMovement = () => {
  // MOVEMENT
  if (keyboard[key.forward]) {
    pig.position.x += Math.sin(pig.rotation.y) * forwardVelocity;
    pig.position.z += Math.cos(pig.rotation.y) * forwardVelocity;
  }
  if (keyboard[key.backwards]) {
    pig.position.x -= Math.sin(pig.rotation.y) * forwardVelocity;
    pig.position.z -= Math.cos(pig.rotation.y) * forwardVelocity;
  }
  if (keyboard[key.right]) pig.rotation.y -= rotationVelocity;
  if (keyboard[key.left]) pig.rotation.y += rotationVelocity;
};

// MAIN FUNC
const draw = () => {
  controls.update();
  // getNewPosition(pig);
  requestAnimationFrame(draw);
  camera.lookAt(pig.position);


  updateMovement();


  renderer.render(scene, camera);
};


// Export for init
export default renderer;
