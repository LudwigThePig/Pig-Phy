/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import { randomPosition } from '../utils/randoms';
import colors from '../utils/colors';
import RigidBody from './RigidBody';


const defaultPos = () => ({
  x: randomPosition('x'),
  z: randomPosition('z'),
});


/**
 * Parent Class with Methods
 */
class Shape extends RigidBody {
  constructor(mass) {
    super(mass);
    this.matrix = new THREE.Shape();
  }
}

export class Cube extends Shape {
  constructor({
    height = 1, width = 1, depth = 1, pos = defaultPos(), mass,
  }) {
    super(mass);
    this.geometry = new THREE.BoxGeometry(height, width, depth);
    this.geometry.computeBoundingBox();
    this.material = new THREE.MeshPhongMaterial({ color: colors.pink });
    this.matrix = new THREE.Mesh(this.geometry, this.material);
    this.matrix.position.set(pos.x, height / 2, pos.z);
    this.matrix.castShadow = true;
    this.matrix.name = 'Cube';
    this.matrix.receiveShadow = true;
  }
}

export class Sphere extends Shape {
  constructor({ radius = 1, pos = defaultPos(), mass }) {
    super(mass);
    this.geometry = new THREE.SphereGeometry(radius, 12, 12);
    this.geometry.computeBoundingBox();
    this.material = new THREE.MeshPhongMaterial({ color: colors.purple });
    this.matrix = new THREE.Mesh(this.geometry, this.material);
    this.matrix.position.set(pos.x, radius, pos.z);
    this.matrix.castShadow = true;
    this.matrix.name = 'sphere';
    this.matrix.receiveShadow = true;
  }
}
