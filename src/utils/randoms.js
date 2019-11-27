import { sceneDimensions } from './dimensions';

export const randomBoundedInt = (givenMin, givenMax) => {
  const min = Math.ceil(givenMin);
  const max = Math.floor(givenMax);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 *
 * @param {str} axis one of 'x', 'z' (case insenstive)
 *  if none is given, random z pos is returned
 * @returns number
 */
export const randomPosition = (axis) => {
  const ax = axis.toLowerCase();
  if (ax === 'x') {
    const xMin = -(sceneDimensions.X / 2);
    const xMax = sceneDimensions.X / 2;
    return randomBoundedInt(xMin, xMax);
  }
  const zMin = -(sceneDimensions.Z / 2);
  const zMax = sceneDimensions.Z / 2;
  return randomBoundedInt(zMin, zMax);
};
