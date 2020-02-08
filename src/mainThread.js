import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import 'normalize.css';

import './style.scss';
import game from './gameManager';
import { getCanvasDimensions, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';
import { movePlayer } from './controllers/movement';
import { Cube, Sphere } from './assets/shapes';
import {
  isBroadCollision, isNarrowCollision, handleCollision,
} from './physics/collisionDetection';
import { debug } from './utils/debug';
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
let pigPointer;
const loader = new GLTFLoader(loadingManager);
const pigLoadCallback = gltf => { // TODO: ECS
  const pigObj = new Player(gltf.scene, 40);
  pigObj.mesh.name = 'pig';
  pigObj.mesh.type = 'pig';
  // Start of ECS Implemenation
  pigPointer = game.createEntity();
  game.pig = pigPointer;
  game.meshes[pigPointer] = pigObj.mesh;
  game.collidables[pigPointer] = pigObj.mesh;
  game.physics[pigPointer] = pigObj.physics;

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
    game.collidables[cube] = cubeObj.matrix;
    game.physics[cube] = cubeObj.physics;

    return cubeObj.matrix;
  });

const spheres = Array(20).fill(0).map(() => {
  const sphereObj = new Sphere({ mass: 15 });
  scene.add(sphereObj.matrix);

  // Start of ECS Implemenation
  const sphere = game.createEntity();
  game.meshes[sphere] = sphereObj;
  game.collidables[sphere] = sphereObj.matrix;
  game.physics[sphere] = sphereObj.physics;
  return sphereObj.matrix;
});


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

  // Collision Detection
  for (let i = 0; i < game.collidables.length - 1; i++) {
    for (let j = i + 1; j < game.collidables.length; j++) {
      if (isBroadCollision(game.collidables[i], game.collidables[j])
      && isNarrowCollision(game.collidables[i], game.collidables[j])) {
        handleCollision(game.physics[i], game.physics[j]);
      }
    }
  }

  controls.update(); // Orbital controls
  requestAnimationFrame(draw);
  movePlayer(game.meshes[game.pig], game.inputs);

  camera.lookAt(game.meshes[game.pig].position);
  for (let ptr = 0; ptr < game.physics.length; ptr++) {
    applyForces(ptr);
  }
  // applyForces(pigPointer);
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
