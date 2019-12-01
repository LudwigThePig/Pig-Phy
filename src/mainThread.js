import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import 'normalize.css';

import './style.scss';
import { getCanvasDimensions, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';
import { moveRigidBody, movePlayer } from './controllers/movement';
import { Cube, Sphere } from './loaders/shapes';
import { gatherBoundingBox, checkCollisions } from './physics/collisionDetection';
import { debug, CollisionBox } from './utils/debug';
import { calculatePosDifference, extractPosition } from './utils/movement';


/* *********
* Managers *
********** */
const OrbitControls = require('three-orbit-controls')(THREE);

const collisionThread = new Worker('js/collision-bundle.js');

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => { draw(); };

/* ******
* State *
******* */
let clock = performance.now();
const keyboard = {};
const getKeyCode = event => event.which;
export const keydown = event => { keyboard[getKeyCode(event)] = true; };
export const keyup = event => { keyboard[getKeyCode(event)] = false; };
let { height, width } = getCanvasDimensions();


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


/* *************
* Rigid Bodies *
************** */
const rigidBodies = [];

/**
 * @description Gathers all of the vertex data and pushes it onto the rigid bodies array
 * @param { Array | Object } mesh a mesh or array of meshes.
 * @returns void
 */
const applyRigidBody = mesh => {
  if (Array.isArray(mesh)) {
    for (let i = 0; i < mesh.length; i++) {
      rigidBodies.push(gatherBoundingBox(mesh[i]));
    }
  } else rigidBodies.push(gatherBoundingBox(mesh));
};


/* ********
* Ground *
********** */
const groundGeometry = new THREE.PlaneGeometry(sceneDimensions.X, sceneDimensions.Z, 1, 1);
const groundMaterial = new THREE.MeshPhongMaterial({ color: color.white, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -90 * (Math.PI / 180);
ground.position.y = 0;
ground.receiveShadow = true;
const gridHelper = new THREE.GridHelper(100, 4);

if (!debug) scene.add(ground);
else {
  scene.add(gridHelper);
  scene.add(new THREE.AxesHelper(6));
}


/* 🐷🐷🐷🐷🐷
* PIG MODEL *
🐷🐷🐷🐷🐷🐷 */
const loader = new GLTFLoader(loadingManager);
let pig;
const pigLoadCallback = gltf => {
  pig = gltf.scene;
  if (debug) pig.children.push(new CollisionBox(pig).box);
  pig.position.set(0, 1.12, 0);
  pig.castShadow = true;
  pig.receiveShadow = true;
  pig.children.forEach(child => { child.castShadow = true; });
  scene.add(pig);
  pig.add(camera);
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
};

const cubes = Array(20)
  .fill(0)
  .map(() => {
    const cube = new Cube();
    scene.add(cube.matrix);
    scene.add(cube.getCollisionBox());
    return cube.matrix;
  });
applyRigidBody(cubes);

const spheres = Array(20).fill(0).map(() => {
  const sphere = new Sphere();
  scene.add(sphere.matrix);
  return sphere.matrix;
});
applyRigidBody(spheres);


/* ********
* LOADERS *
********** */
loader.load( // pig
  'assets/objs/pig.glb',
  pigLoadCallback,
  xhr => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
  err => console.error(err),
);


/* **********
* MAIN FUNC *
*********** */
const draw = () => {
  const collisions = checkCollisions(rigidBodies, pig);
  const oldPos = JSON.parse(JSON.stringify(pig.position));
  controls.update();
  requestAnimationFrame(draw);
  movePlayer(pig, keyboard);
  const newPos = JSON.parse(JSON.stringify(pig.position));
  camera.lookAt(pig.position);
  const posDif = calculatePosDifference(oldPos, newPos);

  if (collisions.length) {
    for (let i = 0; i < collisions.length; i++) {
      const { id, index } = collisions[i];
      const object = scene.getObjectById(id);
      rigidBodies[index] = moveRigidBody(object, posDif, keyboard);
    }
  }

  renderer.render(scene, camera);
  clock = performance.now();
};


/* *********************
* MISC EVENT LISTENERS *
********************** */
const onWindowResize = () => {
  const newDimensions = getCanvasDimensions();
  height = newDimensions.height;
  width = newDimensions.width;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', onWindowResize);


// Export for init
export default renderer;
