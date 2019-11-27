import { sceneDimensions } from './dimensions';

export const randomBoundedInt = (givenMin, givenMax) => {
  const min = Math.ceil(givenMin);
  const max = Math.floor(givenMax);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const randomPosition = () => {
  const xMin = -(sceneDimensions.X / 2);
  const xMax = sceneDimensions.X / 2;
  const zMin = -(sceneDimensions.Z / 2);
  const zMax = sceneDimensions.Z / 2;
  const x = randomBoundedInt(xMin, xMax);
  const z = randomBoundedInt(zMin, zMax);
  return { x, y: 0, z };
};
