import * as THREE from 'three';
import { getMeshDimensions } from '../physics/collisionDetection';
import colors from './colors';

export const debug = true;

// For Debugging Purposes
export class CollisionBox {
  constructor(mesh) {
    const { x, y, z } = getMeshDimensions(mesh);
    this.geometry = new THREE.BoxGeometry(x, y, z);
    this.wireframe = new THREE.EdgesGeometry(this.geometry);
    this.matreial = new THREE.LineBasicMaterial({ color: colors.purple, linewidth: 10 });
    this.box = new THREE.LineSegments(this.wireframe, this.matreial);
    this.box.material.depthTest = false;
    this.box.material.opacity = 0.95;
    this.box.material.transparent = true;
    this.box.parent = mesh;
    this.box.name = 'Collision Box';
  }
}
