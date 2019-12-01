import { forwardVelocity, rotationVelocity } from '../utils/velocities';
import { gatherBoundingBox } from '../physics/collisionDetection';


const keys = {
  forward: 87, // W
  backwards: 83, // S
  left: 65, // A
  right: 68, // A
};

/**
 * @param { Three.Mesh } player
 * @param { object } keyboard Object where keys are keycodes and values are booleans.
 *  If true, the key is pressedbundleRenderer.renderToStream
 * @returns { void } function mutates the player param
 */
export const movePlayer = (player, keyboard) => {
  // apply gravity
  player.position.y -= 0.1;

  // update movement
  if (keyboard[keys.forward]) {
    player.position.x += Math.sin(player.rotation.y) * forwardVelocity;
    player.position.z += Math.cos(player.rotation.y) * forwardVelocity;
  }
  if (keyboard[keys.backwards]) {
    player.position.x -= Math.sin(player.rotation.y) * forwardVelocity;
    player.position.z -= Math.cos(player.rotation.y) * forwardVelocity;
  }
  if (keyboard[keys.right]) player.rotation.y -= rotationVelocity;
  if (keyboard[keys.left]) player.rotation.y += rotationVelocity;
};


/**
 * @description moves an object on collision
 * @param { Three.Mesh } mesh
 * @param {*} direction
 * @returns { object } the new bounding box for the relocated mesh
 */
export const moveRigidBody = (mesh, pos, keyboard) => {
  const padding = 1.4;
  const paddedForwardVelocity = padding * forwardVelocity;
  const paddedRotationVelocity = padding * rotationVelocity;
  if (keyboard[keys.left] || keyboard[keys.rotation]) {
    mesh.position.x += Math.sin(mesh.rotation.y) * paddedForwardVelocity;
    mesh.position.z += Math.cos(mesh.rotation.y) * paddedForwardVelocity;
  }
  // mesh.position.x += (pos.x * padding);
  // mesh.position.y += (pos.y * padding);
  // mesh.position.z += (pos.z * padding);
  return gatherBoundingBox(mesh);
};
