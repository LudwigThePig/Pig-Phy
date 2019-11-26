import { forwardVelocity, rotationVelocity } from '../utils/velocities';


const key = {
  forward: 87, // W
  backwards: 83, // S
  left: 65, // A
  right: 68, // A
};


export default (player, keyboard) => {
  if (keyboard[key.forward]) {
    player.position.x += Math.sin(player.rotation.y) * forwardVelocity;
    player.position.z += Math.cos(player.rotation.y) * forwardVelocity;
  }
  if (keyboard[key.backwards]) {
    player.position.x -= Math.sin(player.rotation.y) * forwardVelocity;
    player.position.z -= Math.cos(player.rotation.y) * forwardVelocity;
  }
  if (keyboard[key.right]) player.rotation.y -= rotationVelocity;
  if (keyboard[key.left]) player.rotation.y += rotationVelocity;
};
