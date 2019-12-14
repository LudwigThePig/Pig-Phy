import * as THREE from 'three';
import { debug, CollisionBox } from '../utils/debug';
import { getMeshDimensions } from '../physics/collisionDetection';


export default class Player {
  constructor(obj) {
    this.player = obj;
    if (debug) {
      this.player.children.push(new CollisionBox(this.player).box);
      this.player.position.set(0, 10.12, 0);
    } else {
      this.player.position.set(0, 1.12, 0);
    }
    this.player.castShadow = true;
    this.player.receiveShadow = true;
    this.player.children.forEach(child => { child.castShadow = true; });
    this.player.mass = 0.1;
    this.player.isGrounded = true;

    this.generateGeometry();
    this.generateDimensions();
  }

  generateGeometry() {
    const { children } = this.player;
    const geometry = new THREE.Geometry();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === 'Mesh') {
        // Gather the verticies from the bufferGeometry
        const resolvedGeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
        geometry.merge(resolvedGeometry);
      }
    }
    this.player.compositeGeometry = geometry;
  }

  generateDimensions() {
    const { x, y, z } = getMeshDimensions(this.player);

    this.player.width = x;
    this.player.height = y;
    this.player.depth = z;
  }
}
