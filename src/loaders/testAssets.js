import * as THREE from 'three';
import { randomPosition } from '../utils/randoms';

export const createCube = (x = randomPosition().x, y = 0.5, z = randomPosition().z) => {
  console.log(x, y, z);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  return cube;
};

export const createSphere = (x = 5, y = 0.5, z = 5) => {

};
