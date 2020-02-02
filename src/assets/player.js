import * as THREE from 'three';
import { debug, CollisionBox } from '../utils/debug';
import { getMeshDimensions } from '../physics/collisionDetection';
import RigidBody from './RigidBody';


export default class Player extends RigidBody {
  constructor(obj, mass) {
    super(obj, mass);
    this.mesh = obj;
    if (debug) {
      this.mesh.children.push(new CollisionBox(this.mesh).box);
      this.mesh.position.set(0, 10.12, 0);
    } else {
      this.mesh.position.set(0, 1.12, 0);
    }
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.children.forEach(child => { child.castShadow = true; });
    this.mesh.mass = mass; // in kilograms
    this.generateGeometry();
    this.generateDimensions();
  }

  generateGeometry() {
    const { children } = this.mesh;
    const geometry = new THREE.Geometry();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === 'Mesh') {
        // Gather the verticies from the bufferGeometry
        const resolvedGeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
        geometry.merge(resolvedGeometry);
      }
    }
    geometry.computeBoundingBox();
    this.mesh.geometry = geometry;
  }

  generateDimensions() {
    const { x, y, z } = getMeshDimensions(this.mesh);

    this.mesh.width = x;
    this.mesh.height = y;
    this.mesh.depth = z;
    this.mesh.area = x * y * z / 1000; // approximation of the pig's area in cm
  }
}
