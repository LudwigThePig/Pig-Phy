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


export const applyForces = () => {
  // * _______X and Z Forces_______ *
  const pigPhy = game.physics[game.pig];
  // F = M * A
  pigPhy.f.x = game.meshes[game.pig].mass * pigPhy.a.x;
  pigPhy.f.z = game.meshes[game.pig].mass * pigPhy.a.z;


  // Frictions
  pigPhy.f.x += calcAirResistance(pigPhy.v.x);
  pigPhy.f.z += calcAirResistance(pigPhy.v.z);
  pigPhy.f.x = calcGroundFriction(pigPhy.f.x);
  pigPhy.f.z = calcGroundFriction(pigPhy.f.z);

  // Calculate Displacement (Verlet Integration)
  pigPhy.d.x = (pigPhy.v.x * game.dt) + (0.5 * pigPhy.a.x * (game.dt ** 2));
  pigPhy.d.z = (pigPhy.v.z * game.dt) + (0.5 * pigPhy.a.z * (game.dt ** 2));

  // Update Position with Displacement
  game.meshes[game.pig].position.x += pigPhy.d.x;
  game.meshes[game.pig].position.z += pigPhy.d.z;

  // Calculate New Acceleration
  pigPhy.a.x = pigPhy.f.x / game.meshes[game.pig].mass;
  pigPhy.a.x = pigPhy.f.x / game.meshes[game.pig].mass;
  pigPhy.a.z = pigPhy.f.z / game.meshes[game.pig].mass;

  // Calculate New Velocity
  pigPhy.v.x = calcNewVelocity(pigPhy.v.x, pigPhy.a.x, game.terminalVelocity.xz);
  pigPhy.v.z = calcNewVelocity(pigPhy.v.z, pigPhy.a.z, game.terminalVelocity.xz);


  // * _______Y Force_______ *
  if (!game.isGrounded) {
    // The position of the pig when on the ground
    const groundPos = game.meshes[game.pig].height / 4;

    pigPhy.f.y = 0;

    // apply gravity force
    pigPhy.f.y += (game.meshes[game.pig].mass * game.gravityForce);
    // apply force of air resistance
    pigPhy.f.y += calcAirResistance(pigPhy.v.y);
    // Displacement of the pig
    pigPhy.d.y = (pigPhy.v.y * game.dt) + (0.5 * pigPhy.a.y * (game.dt ** 2));
    game.meshes[game.pig].position.y += pigPhy.d.y;
    // calculate current acceleration so we can derive velocity
    const newAY = pigPhy.f.y / -game.gravityForce;
    const avgAY = (newAY + pigPhy.a.y) / 2;
    pigPhy.v.y += avgAY * game.dt;

    pigPhy.a.y = pigPhy.f.y / game.meshes[game.pig].mass;

    // Simulate colliding with the ground
    if (game.meshes[game.pig].position.y - groundPos <= 0) {
      pigPhy.v.y *= game.e;
      if (pigPhy.v.y > -0.5 && pigPhy.v.y < 0.5) {
        game.isGrounded = true;
      }
      game.meshes[game.pig].position.y = groundPos;
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
  entity.d.x = (entity.v.x * game.dt) + (0.5 * entity.a.x * (game.dt ** 2));
  entity.d.z = (entity.v.z * game.dt) + (0.5 * entity.a.z * (game.dt ** 2));

  // Update Position with Displacement
  entity.position.x += entity.d.x;
  entity.position.z += entity.d.z;

  // Calculate New Acceleration
  entity.a.x = entity.f.x / entity.mass;
  entity.a.z = entity.f.z / entity.mass;

  // Calculate New Velocity
  entity.v.x = calcNewVelocity(entity.v.x, entity.a.x, game.terminalVelocity.xz);
  entity.v.z = calcNewVelocity(entity.v.z, entity.a.z, game.terminalVelocity.xz);
  // TODO: Y Force Calc
};
