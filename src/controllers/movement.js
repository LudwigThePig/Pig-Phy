import { forwardVelocity, rotationVelocity, jumpVelocity } from '../utils/velocities';
import { gatherBoundingBox } from '../physics/collisionDetection';
import store from '../store';


const keys = {
  forward: 87, // W
  backwards: 83, // S
  left: 65, // A
  right: 68, // A
  spacebar: 32,
  shift: 16,
  c: 67,
};

/**
 * @param { Three.Mesh } player
 * @param { object } keyboard Object where keys are keycodes and values are booleans.
 *  If true, the key is pressedbundleRenderer.renderToStream
 * @returns { void } function mutates the player param
 */
export const movePlayer = (player, keyboard) => {
  player.rotation.z = 0;

  // Forwards And Backwards
  if (keyboard[keys.forward] && store.isGrounded) {
    store.ax += Math.sin(player.rotation.y) * forwardVelocity;
    store.az += Math.cos(player.rotation.y) * forwardVelocity;
  }
  if (keyboard[keys.backwards] && store.isGrounded) {
    store.ax -= Math.sin(player.rotation.y) * forwardVelocity;
    store.az -= Math.cos(player.rotation.y) * forwardVelocity;
  }

  // Y Rotation
  if (keyboard[keys.right]) {
    player.rotation.y -= rotationVelocity;
    player.rotation.z = -25;
  }
  if (keyboard[keys.left]) {
    player.rotation.y += rotationVelocity;
    player.rotation.z = 25;
  }

  // Jump Impulse Force
  if (store.isGrounded && keyboard[keys.spacebar]) {
    store.isGrounded = false;
    store.vy += (store.jumpForce / player.mass); // Jump force is really just velocity change
  }

  // Descend the pig. Just for dev purposes
  if (keyboard[keys.shift] || keyboard[keys.c]) player.position.y -= (jumpVelocity / 2);
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
  mesh.position.x += (pos.x * padding);
  mesh.position.y += (pos.y * padding);
  mesh.position.z += (pos.z * padding);
  return gatherBoundingBox(mesh);
};
