export default class RigidBody {
  /**
   * @param {number} mass mass of rigid body in kg
   */
  constructor(mesh, mass = 10) {
    this.physics = {

      d: { // Displacement
        x: 0,
        y: 0,
        z: 0,
      },
      f: { // Force
        x: 0,
        y: 0,
        z: 0,
      },
      v: { // Velocity
        x: 0,
        y: 0,
        z: 0,
      },
      // Acceleration
      a: {
        x: 0,
        y: 0,
        z: 0,
      },
      mass,
    };
  }
}
