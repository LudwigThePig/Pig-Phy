export default class GameManager {
  constructor() {
    // These are the components
    this.meshes = [];
    this.rbs = [];
    this.inputs = {};

    // Entity Stuff
    this.pointer = 0;
    this.entities = [];

    //*  Misc Settings
    // Time
    this.d1 = new Date().valueOf(); // Current timestamp
    this.d2 = new Date().valueOf(); // Timestamp of last frame
    this.dt = 0.00; // delta time between frames

    // Forces
    this.jumpForce = 500;
    this.gravityForce = -9.81; // meters per second


    // Force Coefficients
    this.e = -0.2; // Coefficient of restitution ('bounciness' of the floor)
    this.rho = 1.2; // Density of air. Try 1000 for water.
    this.coefficientAir = 0.47; // Air Resistance
    this.coefficientGround = 0.1; // Ground Friction
  }

  createEntity() {
    this.pointer++;
    this.entities[this.pointer] = undefined;
    return this.pointer;
  }

  updateDeltaTime() {
    this.d2 = this.d1;
    this.d1 = new Date().valueOf();
    this.dt = (this.d1 - this.d2) / 1000;
  }
}
