import { getCanvasDimensions } from './utils/dimensions';

class Store {
  constructor() {
    const { height, width } = getCanvasDimensions();
    this.height = height;
    this.width = width;


    // * Pig stuff
    this.pig = null;
    this.isGrounded = false;
    this.area = 1 * 2 * 3 / 1000; // Area of the pig in cm (APPROXIMATE)

    // * Displacements
    this.dx = 0;
    this.dy = 0;
    this.dz = 0;

    // * Velocities
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    // * Accelerations
    this.ax = 0;
    this.ay = 0;
    this.az = 0;

    // * Time
    this.d1 = new Date().valueOf(); // Current timestamp
    this.d2 = new Date().valueOf(); // Timestamp of last frame
    this.dt = 0.00; // delta time between frames

    // * Forces
    this.jumpForce = 500;
    this.gravityForce = -9.81; // meters per second


    // * Force Coefficients
    this.e = -0.4; // Coefficient of restitution ('bounciness' of the floor)
    this.rho = 1.2; // Density of air. Try 1000 for water.
    this.coefficientAir = 0.47; // Coefficient of drag for a ball
  }

  /**
   * @description save the current time stamp and update delta time
   */
  updateDeltaTime() {
    this.d2 = this.d1;
    this.d1 = new Date().valueOf();
    this.dt = (this.d1 - this.d2) / 1000;
  }
}

export default new Store();
