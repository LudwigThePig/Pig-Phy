import { forwardVelocity, rotationVelocity, jumpVelocity } from '../utils/velocities';
import game from '../gameManager';


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
  const pigPhy = game.physics[game.pig];


  // Forwards And Backwards
  if (keyboard[keys.forward] && game.isGrounded && !game.isSliding) {
    pigPhy.a.x += Math.sin(player.rotation.y) * forwardVelocity;
    pigPhy.a.z += Math.cos(player.rotation.y) * forwardVelocity;
  }
  if (keyboard[keys.backwards] && game.isGrounded && !game.isSliding) {
    pigPhy.a.x -= Math.sin(player.rotation.y) * forwardVelocity;
    pigPhy.a.z -= Math.cos(player.rotation.y) * forwardVelocity;
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
  if (game.isGrounded && keyboard[keys.spacebar]) {
    game.isGrounded = false;
    pigPhy.v.y += (game.jumpForce / player.mass); // Jump force is really just velocity change
  }


  // Slide the Pig :)
  if (keyboard[keys.shift] || keyboard[keys.c]) {
    game.isSliding = true;
  } else if (game.isSliding) { // Avoid redundant reassignment
    game.isSliding = false;
  }
};

export const filler = 'stop yelling at me!';
