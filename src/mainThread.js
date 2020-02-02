import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import 'normalize.css';

import './style.scss';
import game from './gameManager';
import { getCanvasDimensions, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';
import { moveRigidBody, movePlayer } from './controllers/movement';
import { Cube, Sphere } from './assets/shapes';
import {
  gatherBoundingBox, broadCollisionSweep, narrowCollisionSweep, isBroadCollision, isNarrowCollision, handleCollision,
} from './physics/collisionDetection';
import { debug } from './utils/debug';
import { calculatePosDifference } from './utils/movement';
import TrianglePrism from './assets/trianglePrism';
import Player from './assets/player';
import { applyForces } from './physics/Force';


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
const getKeyCode = event => event.which;
export const keydown = event => { game.inputs[getKeyCode(event)] = true; };
export const keyup = event => { game.inputs[getKeyCode(event)] = false; };
let { height, width } = game;


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


/* 🐷🐷🐷🐷🐷
* PIG MODEL *
🐷🐷🐷🐷🐷🐷 */
const loader = new GLTFLoader(loadingManager);
const pigLoadCallback = gltf => { // TODO: ECS
  const pigObj = new Player(gltf.scene, 40);
  pigObj.mesh.name = 'pig';
  pigObj.mesh.type = 'pig';
  // Start of ECS Implemenation
  const pig = game.createEntity();
  game.pig = pig;
  game.meshes[pig] = pigObj.mesh;
  game.collidables[pig] = gatherBoundingBox(pigObj.mesh);
  game.physics[pig] = pigObj.physics;
  console.log(game);

  scene.add(game.meshes[game.pig]);
  game.meshes[game.pig].add(camera);
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
};

const cubes = Array(20)
  .fill(0)
  .map(() => {
    const cubeObj = new Cube({ mass: 5 });
    scene.add(cubeObj.matrix);

    // Start of ECS Implemenation
    const cube = game.createEntity();
    game.meshes[cube] = cubeObj;
    game.collidables[cube] = gatherBoundingBox(cubeObj.matrix);
    game.physics[cube] = cubeObj.physics;

    return cubeObj.matrix;
  });
applyRigidBody(cubes, 1);

const spheres = Array(20).fill(0).map(() => {
  const sphereObj = new Sphere({ mass: 15 });

  // Start of ECS Implemenation
  const sphere = game.createEntity();
  game.meshes[sphere] = sphereObj;
  // TODO: remove gather bounding box. It's utility for identifying types is matched through the ecs
  // todo: and the bounding box is created in the class constructor instead.
  game.collidables[sphere] = gatherBoundingBox(sphereObj.matrix);
  scene.add(sphereObj.matrix);
  return sphereObj.matrix;
});
applyRigidBody(spheres, 4);


// Kinematic Slope for testing gravity forces
const slope = new TrianglePrism().matrix;
// slope.geometry.computeBoundingBox();
// const box = slope.geometry.boundingBox.clone();
// scene.add(slope);
// applyKinematicBody(slope);

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
  game.updateDeltaTime();

  const rigidCollisions = broadCollisionSweep(game.collidables)
    .filter(({ index }) => narrowCollisionSweep(game.collidables[index]));

  for (let i = 0; i < game.collidables.length - 1; i++) {
    for (let j = i + 1; j < game.collidables.length; j++) {
      if (isBroadCollision(game.collidables[i], game.collidables[j])
      && isNarrowCollision(game.collidables[i], game.collidables[j])) {
        handleCollision(game.collidables[i], game.collidables[j]);
      }
    }
  }

  const oldPos = JSON.parse(JSON.stringify(game.meshes[game.pig].position));
  controls.update(); // Orbital controls
  requestAnimationFrame(draw);
  movePlayer(game.meshes[game.pig], game.inputs);

  const newPos = JSON.parse(JSON.stringify(game.meshes[game.pig].position));
  camera.lookAt(game.meshes[game.pig].position);

  const posDif = calculatePosDifference(oldPos, newPos); // Poor attempt at calculating vectors

  applyForces();

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
