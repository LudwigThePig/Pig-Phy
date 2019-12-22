import store from '../store';

export default class Force {
  /**
   * A straightforward way to calculate the new pos
   * of an object, given a force
   */
  static leapFrogPos(force, mass, curVelocity, timeStep, curPos) {
    const acceleration = force / mass;
    const velocity = curVelocity + (acceleration * timeStep);
    const position = curPos + (velocity * timeStep);
    return { velocity, position };
  }

  /**
   * A more refined approach than the leapfrog approach
   * https://en.wikipedia.org/wiki/Verlet_integration#Velocity_Verlet
   */
  static verletPos(
    acceleration,
    curVelocity,
    force,
    mass,
    timeStep,
    curPos,
  ) {
    const lastAcceleration = acceleration;
    const position = (curPos + curVelocity * timeStep) + (0.5 * lastAcceleration * timeStep ** 2);
    const newAcceleration = force / mass;
    const avgAcceleration = (lastAcceleration + newAcceleration) / 2;
    const velocity = curVelocity + (avgAcceleration * timeStep);
    return { velocity, position };
  }
}

const calcAirResistance = v => -0.5 * store.rho * store.coefficientAir * store.pig.area * (v ** 2);

const applyXForce = () => {
  let forceX = store.pig.mass * store.ax;
  forceX += calcAirResistance(store.vx);
  forceX *= store.coefficientGround;
  store.dx = (store.vx * store.dt) + (0.5 * store.ax * (store.dt ** 2));
  store.pig.position.x += store.dx;

  // store.ax = forceX / store.pig.mass;

  if (store.vz < store.terminalVelocity && store.vz > -store.terminalVelocity) {
    store.vx += store.ax * store.dt;
  }
};

const applyYForce = () => {
  if (!store.isGrounded) {
    let forceY = 0;

    // apply gravity force
    forceY += (store.pig.mass * store.gravityForce);
    // apply force of air resistance
    forceY += calcAirResistance(store.vy);
    // Displacement of the pig
    store.dy = (store.vy * store.dt) + (0.5 * store.ay * (store.dt ** 2));
    store.pig.position.y += store.dy;
    // calculate current acceleration so we can derive velocity
    const newAY = forceY / -store.gravityForce;
    const avgAY = (newAY + store.ay) / 2;
    store.vy += avgAY * store.dt;

    store.ay = forceY / store.pig.mass;

    // Simulate colliding with the ground
    if (store.pig.position.y - (store.pig.height / 2) <= 0) {
      store.vy *= store.e;
      if (store.vy > -0.5 && store.vy < 0.5) {
        store.isGrounded = true;
      }
      store.pig.position.y = store.pig.height / 2;
    }
  }
};


export const applyZForce = () => {
  let forceZ = store.pig.mass * store.az;
  forceZ += calcAirResistance(store.vz);
  forceZ *= store.coefficientGround;
  store.dz = (store.vz * store.dt) + (0.5 * store.az * (store.dt ** 2));
  store.pig.position.z += store.dz;

  if (store.vz < store.terminalVelocity && store.vz > -store.terminalVelocity) {
    store.vz += store.az * store.dt;
  }
};

export const applyForces = () => {
  applyXForce();
  applyYForce();
  applyZForce();
};
