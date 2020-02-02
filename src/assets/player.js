import * as THREE from 'three';
import RigidBody from './RigidBody';


export default class Player extends RigidBody {
  constructor(obj, mass) {
    super(obj, mass);
    this.mesh = obj;
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
    this.mesh.compositeGeometry = geometry;
  }

  generateDimensions() {
    const meshDimensions = new THREE.Box3().setFromObject(this.mesh);
    const x = meshDimensions.max.x - meshDimensions.min.x;
    const y = meshDimensions.max.y - meshDimensions.min.y;
    const z = meshDimensions.max.z - meshDimensions.min.z;

    this.mesh.width = x;
    this.mesh.height = y;
    this.mesh.depth = z;
    this.mesh.area = x * y * z / 1000; // approximation of the pig's area in cm
  }
}
