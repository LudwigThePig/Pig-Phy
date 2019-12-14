export default class Force {
  static forceAndMassToPos(force, mass, curVelocity, timeStep, position) {
    const acceleration = force / mass;
    const velocity = curVelocity + (acceleration * timeStep);
    return position + (velocity * timeStep);
  }
}
