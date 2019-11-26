import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { height, width, sceneDimensions } from './utils/dimensions';
import color, { lightColors } from './utils/colors';

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
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(scene.position);


/* *******
* LIGHTS *
******** */
const ambientLight = new THREE.AmbientLight(lightColors.softWhite, 3); // soft white light
scene.add(ambientLight);

const topLight = new THREE.PointLight(lightColors.white, 2, 100);
topLight.position.set(1, 1, 1);
scene.add(topLight);


/* ********
* GROUND *
********** */
const groundGeometry = new THREE.PlaneGeometry(sceneDimensions.X, sceneDimensions.Z, 1, 1);
const groundMaterial = new THREE.MeshBasicMaterial({ color: color.white, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -90 * (Math.PI / 180);
ground.position.y = -100;
scene.add(ground);


/* 🐷🐷🐷🐷🐷
* PIG MODEL *
🐷🐷🐷🐷🐷🐷 */
const loader = new GLTFLoader();
let pig;
const pigLoadCallback = gltf => {
  pig = gltf.scene;
  pig.position.set(0, 0, 0);
  scene.add(pig);
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
  const relativeCameraOffset = new THREE.Vector3(0, 2, 3);

  const cameraOffset = relativeCameraOffset.applyMatrix4(pig.matrixWorld);

  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  camera.rotation.y = 180;
  camera.lookAt(pig.position);

  pig.rotation.y += 0.01;
  requestAnimationFrame(draw);
  renderer.render(scene, camera);
};


// Export for init
export default renderer;
