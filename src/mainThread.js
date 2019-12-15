import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import 'normalize.css';

import './style.scss';
import { getCanvasDimensions, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';
import { moveRigidBody, movePlayer } from './controllers/movement';
import { Cube, Sphere } from './assets/shapes';
import { gatherBoundingBox, broadCollisionSweep, narrowCollisionSweep } from './physics/collisionDetection';
import { debug } from './utils/debug';
import { calculatePosDifference } from './utils/movement';
import TrianglePrism from './assets/trianglePrism';
import Player from './assets/player';
import store from './store';


/* *********
* Managers *
********** */
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => { draw(); };

const OrbitControls = require('three-orbit-controls')(THREE);

const collisionThread = new Worker('js/collision-bundle.js');


/* ******
* State *
******* */
const keyboard = {};
const getKeyCode = event => event.which;
export const keydown = event => { keyboard[getKeyCode(event)] = true; };
export const keyup = event => { keyboard[getKeyCode(event)] = false; };
let { height, width } = store;


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
controls.minDistance = 0;
controls.maxDistance = 40;
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


/* *************************
* Rigid & Kinematic Bodies *
************************** */
const rigidBodies = [];
const kinematicBodies = [];

/**
 * @description Gathers all of the vertex data and pushes it onto the rigid bodies array
 * @param { Array } mesh a mesh or array of meshes.
 * @returns void
 */
const applyRigidBody = (mesh, mass = 1) => {
  if (Array.isArray(mesh)) {
    for (let i = 0; i < mesh.length; i++) {
      mesh[i].mass = mass;
      rigidBodies.push(gatherBoundingBox(mesh[i]));
    }
    mesh.mass = mass;
  } else rigidBodies.push(gatherBoundingBox(mesh));
};

const applyKinematicBody = mesh => {
  if (Array.isArray(mesh)) {
    for (let i = 0; i < mesh.length; i++) {
      kinematicBodies.push(gatherBoundingBox(mesh[i]));
    }
  } else kinematicBodies.push(gatherBoundingBox(mesh));
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
scene.add(ground);
const gridHelper = new THREE.GridHelper(100, 4);

if (!debug) scene.add(ground);
else {
  scene.add(gridHelper);
  scene.add(new THREE.AxesHelper(6));
}
applyKinematicBody(ground);


/* 🐷🐷🐷🐷🐷
* PIG MODEL *
🐷🐷🐷🐷🐷🐷 */
const loader = new GLTFLoader(loadingManager);
let pig;
const pigLoadCallback = gltf => {
  pig = new Player(gltf.scene).player;
  store.area = pig.area;
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
    return cube.matrix;
  });
applyRigidBody(cubes, 1);

const spheres = Array(20).fill(0).map(() => {
  const sphere = new Sphere();
  scene.add(sphere.matrix);
  return sphere.matrix;
});
applyRigidBody(spheres, 4);


// Kinematic Slope for testing gravity forces
const slope = new TrianglePrism().matrix;
// scene.add(slope);
// applyKinematicBody(slope);
// slope.geometry.computeBoundingBox();
// const box = slope.geometry.boundingBox.clone();

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
  store.updateDeltaTime();
  const rigidCollisions = broadCollisionSweep(rigidBodies, pig)
    .filter(({ index }) => narrowCollisionSweep(rigidBodies[index], pig));

  const kinematicCollisions = broadCollisionSweep(kinematicBodies, pig)
    .filter(({ index }) => narrowCollisionSweep(rigidBodies[index], pig));

  const oldPos = JSON.parse(JSON.stringify(pig.position));
  controls.update();
  requestAnimationFrame(draw);
  movePlayer(pig, keyboard);
  const newPos = JSON.parse(JSON.stringify(pig.position));
  camera.lookAt(pig.position);
  const posDif = calculatePosDifference(oldPos, newPos);
  if (rigidCollisions.length) {
    for (let i = 0; i < rigidCollisions.length; i++) {
      const { id, index } = rigidCollisions[i];
      const object = scene.getObjectById(id);
      rigidBodies[index] = moveRigidBody(object, posDif, keyboard);
    }
  }

  if (kinematicCollisions.length) { /* Broad collision sweep */ }
  // If not grounded, apply gravity force
  if (!store.isGrounded) {
    let forceY = 0;
    forceY += pig.mass * store.gravityForce;
    forceY += -0.5 * store.rho * store.coefficientAir * store.area * (store.vy ** 2);

    const dy = -(store.vy * store.dt) + (0.5 * store.ay * (store.dt ** 2));
    pig.position.y += dy;
    const newAY = forceY / pig.mass;
    const avgAY = (newAY + store.ay) / 2;
    store.vy += avgAY * store.dt;

    if (pig.position.y - (pig.height / 2) <= 0) {
      store.vy *= store.e;
      if (store.vy > -0.5 && store.vy < 0.5) {
        store.isGrounded = true;
      }
      pig.position.y = pig.height / 2;
    }
  }

  renderer.render(scene, camera);
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
