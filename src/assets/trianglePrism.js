import * as THREE from 'three';

const coordA = [0, 0];
const coordB = [4, 0];
const coordC = [0, 4];

export default class TrianglePrism {
  constructor(a = coordA, b = coordB, c = coordC, depth = 5) {
    const triangle = new THREE.Shape()
      .moveTo(...a)
      .lineTo(...b)
      .lineTo(...c)
      .lineTo(...a);

    const extrudeSettings = {
      depth,
      bevelEnabled: false,
    };

    this.geometry = new THREE.ExtrudeGeometry(triangle, extrudeSettings);
    this.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
    this.matrix = new THREE.Mesh(this.geometry, this.material);
  }
}
