/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import { randomPosition } from '../utils/randoms';
import colors from '../utils/colors';
import { getMeshDimensions } from '../physics/collisionDetection';


const defaultPos = () => ({
  x: randomPosition('x'),
  z: randomPosition('z'),
});

export class Cube {
  constructor(height = 1, width = 1, depth = 1, pos = defaultPos()) {
    this.geometry = new THREE.BoxGeometry(height, width, depth);
    this.material = new THREE.MeshPhongMaterial({ color: colors.pink });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.position.set(pos.x, height / 2, pos.z);
    this.cube.castShadow = true;
    this.cube.name = 'Cube';
    this.cube.receiveShadow = true;
  }
}

export class Sphere {
  constructor(radius = 1, pos = defaultPos()) {
    this.geometry = new THREE.SphereGeometry(radius, 12, 12);
    this.material = new THREE.MeshPhongMaterial({ color: colors.purple });
    this.sphere = new THREE.Mesh(this.geometry, this.material);
    this.sphere.position.set(pos.x, radius, pos.z);
    this.sphere.castShadow = true;
    this.sphere.name = 'sphere';
    this.sphere.receiveShadow = true;
  }
}

// For Debugging Purposes
export class CollisionBox {
  constructor(mesh) {
    const { x, y, z } = getMeshDimensions(mesh);
    this.geometry = new THREE.BoxGeometry(x, y, z);
    this.wireframe = new THREE.EdgesGeometry(this.geometry);
    this.matreial = new THREE.LineBasicMaterial({ color: colors.green, linewidth: 2 });

    this.box = new THREE.LineSegments(this.wireframe, this.matreial);
    this.box.material.depthTest = false;
    this.box.material.opacity = 0.95;
    this.box.material.transparent = true;
    this.box.parent = mesh;
    this.box.name = 'Collision Box';
  }
}
