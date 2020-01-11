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


export const applyForces = () => {
  // * _______X and Z Forces_______ *
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


  // * _______Y Force_______ *
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


// This is the same as above but abstracted to handle an instance of RigidBody
export const applyRigidBodyForces = entity => {
  // * _______X and Z Forces_______ *
  // F = M * A
  entity.f.x = entity.mass * entity.a.x;
  entity.f.z = entity.mass * entity.a.z;


  // Frictions
  entity.f.x += calcAirResistance(entity.v.x);
  entity.f.z += calcAirResistance(entity.v.z);
  entity.f.x = calcGroundFriction(entity.f.x);
  entity.f.z = calcGroundFriction(entity.f.z);

  // Calculate Displacement (Verlet Integration)
  entity.d.x = (entity.v.x * store.dt) + (0.5 * entity.a.x * (store.dt ** 2));
  entity.d.z = (entity.v.z * store.dt) + (0.5 * entity.a.z * (store.dt ** 2));

  // Update Position with Displacement
  entity.position.x += entity.d.x;
  entity.position.z += entity.d.z;

  // Calculate New Acceleration
  entity.a.x = entity.f.x / entity.mass;
  entity.a.z = entity.f.z / entity.mass;

  // Calculate New Velocity
  entity.v.x = calcNewVelocity(entity.v.x, entity.a.x, store.terminalVelocity.xz);
  entity.v.z = calcNewVelocity(entity.v.z, entity.a.z, store.terminalVelocity.xz);
  // TODO: Y Force Calc
};
