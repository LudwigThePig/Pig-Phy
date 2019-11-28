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
 * @param { number } meshWidth the width of the object to be placed.
 * @returns number
 */
export const randomPosition = (axis, meshWidth = 1) => {
  const ax = axis.toLowerCase();
  const offset = meshWidth / 2; // offset to avoid mesh from hanging over the edge

  if (ax === 'x') {
    const xMin = -(sceneDimensions.X / 2) + offset;
    const xMax = (sceneDimensions.X / 2) - offset;
    return randomBoundedInt(xMin, xMax);
  }
  const zMin = -(sceneDimensions.Z / 2) + offset;
  const zMax = (sceneDimensions.Z / 2) - offset;
  return randomBoundedInt(zMin, zMax);
};
