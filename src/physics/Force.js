import game from '../gameManager';


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

const calcAirResistance = v => -0.5 * game.rho * game.coefficientAir * game.meshes[game.pig].area * (v ** 2);

const calcNewVelocity = (a, v, terminalV) => {
  const newVelocity = v + (a * game.dt);
  const sign = newVelocity < 0 ? -1 : 1;
  return sign * Math.min(terminalV, Math.abs(newVelocity));
};

const calcGroundFriction = force => {
  if (!game.isGrounded) return force;

  const friction = game.isSliding
    ? game.coefficientGround / 7
    : game.coefficientGround;

  return force - (force * friction);
};


/**
 *
 * @param {number} entityPtr The pointer of an entity
 */
export const applyForces = entityPtr => {
  // * _______X and Z Forces_______ *
  // Physics Component
  const phy = game.physics[entityPtr];
  const mesh = game.collidables[entityPtr];

  if (!phy || !mesh) return;

  // F = M * A
  phy.f.x = phy.mass * phy.a.x;
  phy.f.z = phy.mass * phy.a.z;

  // Frictions
  phy.f.x += calcAirResistance(phy.v.x);
  phy.f.z += calcAirResistance(phy.v.z);
  phy.f.x = calcGroundFriction(phy.f.x);
  phy.f.z = calcGroundFriction(phy.f.z);

  // Calculate Displacement (Verlet Integration)
  phy.d.x = (phy.v.x * game.dt) + (0.5 * phy.a.x * (game.dt ** 2));
  phy.d.z = (phy.v.z * game.dt) + (0.5 * phy.a.z * (game.dt ** 2));

  // Update Position with Displacement
  mesh.position.x += phy.d.x;
  mesh.position.z += phy.d.z;

  // Calculate New Acceleration
  phy.a.x = phy.f.x / phy.mass;
  phy.a.x = phy.f.x / phy.mass;
  phy.a.z = phy.f.z / phy.mass;

  // Calculate New Velocity
  phy.v.x = calcNewVelocity(phy.v.x, phy.a.x, game.terminalVelocity.xz);
  phy.v.z = calcNewVelocity(phy.v.z, phy.a.z, game.terminalVelocity.xz);


  // * _______Y Force_______ *
  // The position of the entity when on the ground
  // In the future this will be a helper function that
  // gets the height of the terrain's height at the entity's
  // x and z position. The terrain height will likely be
  // kept in a matrix
  const groundPos = game.meshes[game.pig].height / 4;

  phy.f.y = 0;

  // apply gravity force
  phy.f.y += (phy.mass * game.gravityForce);
  // apply force of air resistance
  phy.f.y += calcAirResistance(phy.v.y);
  // Displacement of the pig
  phy.d.y = (phy.v.y * game.dt) + (0.5 * phy.a.y * (game.dt ** 2));
  mesh.position.y += phy.d.y;
  // calculate current acceleration so we can derive velocity
  const newAY = phy.f.y / -game.gravityForce;
  const avgAY = (newAY + phy.a.y) / 2;
  phy.v.y += avgAY * game.dt;

  phy.a.y = phy.f.y / phy.mass;

  // Simulate colliding with the ground
  if (mesh.position.y - groundPos <= 0) {
    phy.v.y *= game.e;
    if (phy.v.y > -0.5 && phy.v.y < 0.5) {
      phy.a.y = 0;
      phy.f.y = 0;
      phy.d.y = 0;
      game.isGrounded = true;
    }
    mesh.position.y = groundPos;
  }
};
