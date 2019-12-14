import { getCanvasDimensions } from './utils/dimensions';

class Store {
  constructor() {
    const { height, width } = getCanvasDimensions();
    this.height = height;
    this.width = width;
    this.vy = 0;
    this.ay = 0;
    this.A = Math.PI * (this.r * this.r) / 10000;
    this.d1 = new Date().valueOf(); // Current timestamp
    this.d2 = new Date().valueOf(); // Timestamp of last frame
    this.dt = 0.00; // delta time between frames
    this.e = -0.7; // Coefficient of restitution ('bounciness' of the floor)
    this.rho = 1.2; // Density of air. Try 1000 for water.
    this.coefficientAir = 0.47; // Coeffecient of drag for a ball
    this.gravityForce = 9.81; // meters per second
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
