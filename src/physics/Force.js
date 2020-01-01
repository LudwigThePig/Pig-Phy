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

const calcNewVelocity = (a, v, terminalV) => {
  const newVelocity = v + (a * store.dt);
  const sign = newVelocity < 0 ? -1 : 1;
  return sign * Math.min(terminalV, Math.abs(newVelocity));
};

const calcGroundFriction = force => {
  if (!store.isGrounded) return force;

  const friction = store.isSliding
    ? store.coefficientGround / 7
    : store.coefficientGround;

  return force - (force * friction);
};

const applyXZForce = () => {
  // F = M * A
  store.forceX = store.pig.mass * store.ax;
  store.forceZ = store.pig.mass * store.az;


  // Frictions
  store.forceX += calcAirResistance(store.vx);
  store.forceZ += calcAirResistance(store.vz);
  store.forceX = calcGroundFriction(store.forceX);
  store.forceZ = calcGroundFriction(store.forceZ);

  // Calculate Displacement (Verlet Integration)
  store.dx = (store.vx * store.dt) + (0.5 * store.ax * (store.dt ** 2));
  store.dz = (store.vz * store.dt) + (0.5 * store.az * (store.dt ** 2));

  // Update Position with Displacement
  store.pig.position.x += store.dx;
  store.pig.position.z += store.dz;

  // Calculate New Acceleration
  store.ax = store.forceX / store.pig.mass;
  store.az = store.forceZ / store.pig.mass;

  // Calculate New Velocity
  store.vx = calcNewVelocity(store.vx, store.ax, store.terminalVelocity.xz);
  store.vz = calcNewVelocity(store.vz, store.az, store.terminalVelocity.xz);
};


const applyYForce = () => {
  if (!store.isGrounded) {
    store.forceY = 0;

    // apply gravity force
    store.forceY += (store.pig.mass * store.gravityForce);
    // apply force of air resistance
    store.forceY += calcAirResistance(store.vy);
    // Displacement of the pig
    store.dy = (store.vy * store.dt) + (0.5 * store.ay * (store.dt ** 2));
    store.pig.position.y += store.dy;
    // calculate current acceleration so we can derive velocity
    const newAY = store.forceY / -store.gravityForce;
    const avgAY = (newAY + store.ay) / 2;
    store.vy += avgAY * store.dt;

    store.ay = store.forceY / store.pig.mass;

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

export const applyForces = () => {
  applyYForce();
  applyXZForce();
};
