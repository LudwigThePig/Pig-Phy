import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { height, width, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';
import updatePlayerPosition from './controllers/keyboarInput';
import { Cube, Sphere } from './loaders/testAssets';

const OrbitControls = require('three-orbit-controls')(THREE);


/* ************
* Input State *
************* */
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
const applyRigidBody = mesh => {
  if (Array.isArray(mesh)) rigidBodies.push(...mesh);
  else rigidBodies.push(mesh);
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

const cubes = Array(20)
  .fill(0)
  .map(() => {
    const { cube } = new Cube();
    scene.add(cube);
    return cube;
  });
applyRigidBody(cubes);

const spheres = Array(20).fill(0).map(() => {
  const { sphere } = new Sphere();
  scene.add(sphere);
  return sphere;
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


// COLLISION DETECTION
const checkCollision = () => {
  rigidBodies.forEach(bodies => {
    bodies.material.transparent = false;
    bodies.material.opacity = 1.0;
  });

  const cube = scene.getObjectByName('cube');
  const originPoint = cube.position.clone();
  for (let vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++) {
    const localVertex = cube.geometry.vertices[vertexIndex].clone();
    const globalVertex = localVertex.applyMatrix4(cube.matrix);
    const directionVector = globalVertex.sub(cube.position);
    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    const collisionResults = ray.intersectObjects(rigidBodies);
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      console.log(collisionResults[0].object.name);
      collisionResults[0].object.material.transparent = true;
      collisionResults[0].object.material.opacity = 0.4;
    }
  }
};


// MAIN FUNC
const draw = () => {
  checkCollision();
  controls.update();
  requestAnimationFrame(draw);

  updatePlayerPosition(pig, keyboard);
  camera.lookAt(pig.position);


  renderer.render(scene, camera);
};


// Export for init
export default renderer;
