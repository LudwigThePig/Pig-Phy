export default class Store {
  constructor() {
    this.height = 400;
    this.width = 400;
    this.x = 200;
    this.y = 0;
    this.vy = 0;
    this.ay = 0;
    this.m = 0.1; // Ball mass in kg
    this.r = 10; // Ball radius in cm, or pixels.
    this.dt = 0.00;
    this.d1 = new Date().valueOf();
    this.d2 = new Date().valueOf();
    this.e = -0.5; // Coefficient of restitution ('bounciness' of the floor)
    this.rho = 1.2; // Density of air. Try 1000 for water.
    this.coefficientAir = 0.47; // Coeffecient of drag for a ball
  }

  // setDeltaTime
  setDeltaTime() {
    this.d2 = this.d1;
    this.d1 = new Date().valueOf();
    this.dt = this.d2 - this.d1;
  }
}
