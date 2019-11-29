export const extractPosition = pos => ({
  x: pos.x,
  y: pos.y,
  z: pos.z,
});

export const calculatePosDifference = (oldPos, newPos) => {
  const returnObj = {
    x: (newPos.x - oldPos.x),
    y: (newPos.y - oldPos.y),
    z: (newPos.z - oldPos.z),
  };
  // console.log(returnObj);
  return returnObj;
};
