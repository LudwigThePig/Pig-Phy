import { forwardVelocity, rotationVelocity } from '../utils/velocities';


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
 * @returns { void } function mutates the meesh input
 */
export const moveRigidBody = (mesh, direction) => {
  console.log(mesh);
  mesh.position.y += 0.3;
};
