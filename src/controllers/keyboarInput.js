import { forwardVelocity, rotationVelocity } from '../utils/velocities';

const keyboard = {};

const key = {
  forward: 87, // W
  backwards: 83, // S
  left: 65, // A
  right: 68, // A
};

const getKeyCode = event => event.which;


export const keydown = event => { keyboard[getKeyCode(event)] = true; };
export const keyup = event => { keyboard[getKeyCode(event)] = false; };

export const getNewPosition = obj => {
  if (keyboard[key.forward]) obj.position.z += forwardVelocity;
  if (keyboard[key.backward]) obj.position.z -= forwardVelocity;
  if (keyboard[key.left]) obj.rotation.y -= rotationVelocity;
  if (keyboard[key.right]) obj.rotation.y += rotationVelocity;
};
