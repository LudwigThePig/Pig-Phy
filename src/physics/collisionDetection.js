import * as THREE from 'three';


/**
 * @param { THREE.Mesh } mesh
 * @returns { object } object containing all of the bounding verticies for a mesh
 */
export const gatherBoundingBox = mesh => {
  const boundingBox = new THREE.Box3().setFromObject(mesh);
  mesh.boundingBox = {
    id: mesh.id,
    type: 'collision',
    xMin: boundingBox.min.x,
    xMax: boundingBox.max.x,
    yMin: boundingBox.min.y,
    yMax: boundingBox.max.y,
    zMin: boundingBox.min.z,
    zMax: boundingBox.max.z,
  };
  return mesh;
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
 * @param { Array<objects> } collisions Array of bounding vertices
 * @param { THREE.Mesh } pig the player to compare vertices against
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
    const bbox = collisions[i].boundingBox;
    if (bbox.type == 'collision') {
      if ((bounds.xMin <= bbox.xMax && bounds.xMax >= bbox.xMin)
         && (bounds.yMin <= bbox.yMax && bounds.yMax >= bbox.yMin)
         && (bounds.zMin <= bbox.zMax && bounds.zMax >= bbox.zMin)) {
        // We hit a solid object! Stop all movements.
        collisionIDs.push({ id: bbox.id, index: i });
      }
    }
  }

  return collisionIDs;
};


/**
 * @param { THREE.Mesh } entity An object that was caught up in our broad sweep
 * @param { THREE.Mesh } pig our faithful piggy
 * @returns { bool } returns whether there was a collision or not.
 * @description compare two meshes, the player and some other junk. We check if the other
 * entity by shooting rays out from the center of our player to each of its verticies.
 * If one of those rays passes through the other mesh, we got a hit!
 */
export const narrowCollisionSweep = (entity, pig) => {
  const { vertices } = pig.compositeGeometry;
  for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
    const localVertex = vertices[vertexIndex].clone();
    const globalVertex = localVertex.applyMatrix4(pig.matrix);
    const directionVector = globalVertex.sub(pig.position);
    const originPoint = pig.position.clone();

    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    const collisionResults = ray.intersectObject(entity);

    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      return true;
    }
  }
  return false;
};
