import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { height, width, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';
import updatePlayerPosition from './controllers/keyboarInput';

const OrbitControls = require('three-orbit-controls')(THREE);

/* ******
* Input State *
******* */

const keyboard = {};
const getKeyCode = event => event.which;
export const keydown = event => { keyboard[getKeyCode(event)] = true; };
export const keyup = event => { keyboard[getKeyCode(event)] = false; };


/* ********
* Renderer *
********** */
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio); // super retina / high pixel density
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(width, height);

/* ******
* Scene *
******* */
const scene = new THREE.Scene();
scene.background = new THREE.Color(color.black);


/* *******
* Camera *
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
* Lights *
******** */
const ambientLight = new THREE.AmbientLight(lightColors.softWhite, 0.7); // soft white light
scene.add(ambientLight);

const topLight = new THREE.PointLight(lightColors.white, 1.8, 100);
topLight.position.set(0, 20, 22);
topLight.castShadow = true;
topLight.shadowDarkness = 2;

topLight.shadowCameraVisible = true; // for debugging
scene.add(topLight);


/* ********
* Ground *
********** */
const groundGeometry = new THREE.PlaneGeometry(sceneDimensions.X, sceneDimensions.Z, 1, 1);
const groundMaterial = new THREE.MeshPhongMaterial({ color: color.white, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -90 * (Math.PI / 180);
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);


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
  pig.position.set(0, 1.12, 0);
  pig.castShadow = true;
  pig.receiveShadow = true;
  pig.children.forEach(child => { child.castShadow = true; });
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

// MAIN FUNC
const draw = () => {
  controls.update();
  requestAnimationFrame(draw);

  updatePlayerPosition(pig, keyboard);
  camera.lookAt(pig.position);


  renderer.render(scene, camera);
};


// Export for init
export default renderer;
