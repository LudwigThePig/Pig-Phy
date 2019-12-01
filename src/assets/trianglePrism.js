import * as THREE from 'three';

export default class TrianglePrism {
  constructor(height = 3, width = 5, depth = 5) {
    const triangle = new THREE.Shape()
      .moveTo(0, 0)
      .lineTo(0, height)
      .lineTo(width, 0)
      .lineTo(0, 0);

    const extrudeSettings = {
      depth,
      bevelEnabled: false,
    };

    this.geometry = new THREE.ExtrudeGeometry(triangle, extrudeSettings);
    this.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
    this.matrix = new THREE.Mesh(this.geometry, this.material);
    this.matrix.position.set(width / -2, 0, depth / -2);
    this.matrix.name = 'slope';
  }
}
