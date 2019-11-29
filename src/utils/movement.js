export const filler = 'Stop Yelling at me!';

export const calculatePosDifference = (oldPos, newPos) => ({
  x: (newPos.x - oldPos.x),
  y: (newPos.y - oldPos.y),
  z: (newPos.z - oldPos.z),
});
