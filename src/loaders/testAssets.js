/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import { randomPosition } from '../utils/randoms';
import colors from '../utils/colors';


const defaultPos = () => ({
  x: randomPosition('x'),
  z: randomPosition('z'),
});
export class Cube {
  constructor(height = 1, width = 1, depth = 1, pos = defaultPos()) {
    this.geometry = new THREE.BoxGeometry(height, width, depth);
    this.material = new THREE.MeshBasicMaterial({ color: colors.pink });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.position.set(pos.x, height / 2, pos.z);
  }
}

export class Sphere {
  constructor(radius = 1, pos = defaultPos()) {
    this.geometry = new THREE.SphereGeometry(radius, 32, 32);
    this.material = new THREE.MeshBasicMaterial({ color: colors.purple });
    this.sphere = new THREE.Mesh(this.geometry, this.material);
    this.sphere.position.set(pos.x, radius, pos.z);
  }
}
