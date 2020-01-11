export default class RigidBody {
  /**
   * @param {number} mass mass of rigid body in kg
   */
  constructor(mesh, mass = 10) {
    this.f = {
      x: 0,
      y: 0,
      z: 0,
    };
    this.v = {
      x: 0,
      y: 0,
      z: 0,
    };
    this.a = {
      x: 0,
      y: 0,
      z: 0,
    };
    this.mass = mass;
  }
}
