export default class RigidBody {
  /**
   * @param {number} mass mass of rigid body in kg
   */
  constructor(mesh, mass = 10) {
    this.d = { // Displacement
      x: 0,
      y: 0,
      z: 0,
    };
    this.f = { // Force
      x: 0,
      y: 0,
      z: 0,
    };
    this.v = { // Velocity
      x: 0,
      y: 0,
      z: 0,
    };
    this.a = { // Acceleration
      x: 0,
      y: 0,
      z: 0,
    };
    this.mass = mass;
  }
}
