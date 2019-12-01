import * as THREE from 'three';
import { debug, CollisionBox } from '../utils/debug';


export default class Player {
  constructor(obj) {
    this.player = obj;
    if (debug) {
      this.player.children.push(new CollisionBox(this.player).box);
      this.player.position.set(0, 5.12, 0);
    } else {
      this.player.position.set(0, 1.12, 0);
    }
    this.player.castShadow = true;
    this.player.receiveShadow = true;
    this.player.children.forEach(child => { child.castShadow = true; });
    this.player.mass = 3;
    this.player.isGrounded = true;

    this.generateGeometry();
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
    this.geometry = geometry;
  }
}
