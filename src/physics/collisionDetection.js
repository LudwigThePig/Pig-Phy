import * as THREE from 'three';


/**
 * @param { object } mesh Instance of THREE.Mesh()
 * @returns { object } object containing all of the bounding verticies for a mesh
 */
export const gatherBoundingBox = mesh => {
  const boundingBox = new THREE.Box3().setFromObject(mesh);
  return {
    type: 'collision',
    xMin: boundingBox.min.x,
    xMax: boundingBox.max.x,
    yMin: boundingBox.min.y,
    yMax: boundingBox.max.y,
    zMin: boundingBox.min.z,
    zMax: boundingBox.max.z,
  };
};


/**
 * Collision detection for every solid object.
 */
export const checkCollisions = (collisions, pig) => {
  // Get the user's current collision area.
  let pigDimensions = new THREE.Box3().setFromObject(pig);
  pigDimensions = {
    x: pigDimensions.max.x - pigDimensions.min.x,
    y: pigDimensions.max.y - pigDimensions.min.y,
    z: pigDimensions.max.z - pigDimensions.min.z,
  };

  const bounds = {
    xMin: pig.position.x - pigDimensions.x,
    xMax: pig.position.x + pigDimensions.x,
    yMin: pig.position.y - pigDimensions.y,
    yMax: pig.position.y + pigDimensions.y,
    zMin: pig.position.z - pigDimensions.z,
    zMax: pig.position.z + pigDimensions.z,
  };

  // Run through each object and detect if there is a collision.
  for (let index = 0; index < collisions.length; index++) {
    if (collisions[index].type == 'collision') {
      if ((bounds.xMin <= collisions[index].xMax && bounds.xMax >= collisions[index].xMin)
         && (bounds.yMin <= collisions[index].yMax && bounds.yMax >= collisions[index].yMin)
         && (bounds.zMin <= collisions[index].zMax && bounds.zMax >= collisions[index].zMin)) {
        // We hit a solid object! Stop all movements.
        console.log('🦜: WE GOT A HIT CAPTAIN!');
      }
    }
  }
};
