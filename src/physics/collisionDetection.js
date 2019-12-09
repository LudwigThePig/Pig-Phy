import * as THREE from 'three';


/**
 * @param { THREE.Mesh } mesh
 * @returns { object } object containing all of the bounding verticies for a mesh
 */
export const gatherBoundingBox = mesh => {
  const boundingBox = new THREE.Box3().setFromObject(mesh);
  return {
    id: mesh.id,
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
 * @param { THREE.Mesh } player
 * @returns returns the maximum width, height, and depth of a mesh
 */
export const getMeshDimensions = player => {
  const playerDimensions = new THREE.Box3().setFromObject(player);
  return {
    x: playerDimensions.max.x - playerDimensions.min.x,
    y: playerDimensions.max.y - playerDimensions.min.y,
    z: playerDimensions.max.z - playerDimensions.min.z,
  };
};


/**
 * @param { Array<objects> } collisions Array of bounding verticies
 * @param { THREE.Mesh } pig the player to compare verticies against
 * @returns { Array<number> } array of the ids of the objects that have been hit
 */
export const broadCollisionSweep = (collisions, pig) => {
  const collisionIDs = [];
  const pigDimensions = getMeshDimensions(pig);
  const bounds = {
    xMin: pig.position.x - (pigDimensions.x / 2),
    xMax: pig.position.x + (pigDimensions.x / 2),
    yMin: pig.position.y - (pigDimensions.y / 2),
    yMax: pig.position.y + (pigDimensions.y / 2),
    zMin: pig.position.z - (pigDimensions.z / 2),
    zMax: pig.position.z + (pigDimensions.z / 2),
  };

  // Run through each object and detect if there is a collision.
  for (let i = 0; i < collisions.length; i++) {
    if (collisions[i].type == 'collision') {
      if ((bounds.xMin <= collisions[i].xMax && bounds.xMax >= collisions[i].xMin)
         && (bounds.yMin <= collisions[i].yMax && bounds.yMax >= collisions[i].yMin)
         && (bounds.zMin <= collisions[i].zMax && bounds.zMax >= collisions[i].zMin)) {
        // We hit a solid object! Stop all movements.
        collisionIDs.push({ id: collisions[i].id, index: i });
      }
    }
  }

  return collisionIDs;
};
