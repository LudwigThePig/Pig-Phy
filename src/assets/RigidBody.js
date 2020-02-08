import { Vector3 } from 'three';

export default class RigidBody {
  /**
   * @param {number} mass mass of rigid body in kg
   */
  constructor(mesh, mass = 10) {
    this.physics = {

      d: new Vector3(), // Displacement
      f: new Vector3(), // Force
      v: new Vector3(), // Velocity
      a: new Vector3(), // Acceleration
      mass,
    };
  }
}
