import { forwardVelocity } from '../utils/velocities';

export default (event, obj) => {
  const keyCode = event.which;
  if (keyCode == 87) {
    obj.position.y += forwardVelocity;
  } else if (keyCode === 83) {
    obj.position.y -= forwardVelocity;
  } else if (keyCode === 65) {
    obj.position.x -= xSpeed;
  } else if (keyCode === 68) {
    obj.position.x += xSpeed;
  } else if (keyCode === 32) {
    obj.position.set(0, 0, 0);
  }
};
