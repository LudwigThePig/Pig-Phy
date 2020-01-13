import * as THREE from 'three';
import game from '../gameManager';


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
export const getMeshDimensions = mesh => {
  const meshDimensions = new THREE.Box3().setFromObject(mesh);
  return {
    x: meshDimensions.max.x - meshDimensions.min.x,
    y: meshDimensions.max.y - meshDimensions.min.y,
    z: meshDimensions.max.z - meshDimensions.min.z,
  };
};


/**
 * @param { Array<objects> } collisions Array of bounding vertices
 * @param { THREE.Mesh } pig the player to compare vertices against
 * @returns { Array<number> } array of the ids of the objects that have been hit
 */
export const broadCollisionSweep = (collisions) => {
  const collisionIDs = [];
  const pigMesh = game.meshes[game.pig];
  const pigDimensions = getMeshDimensions(pigMesh);
  const bounds = {
    xMin: pigMesh.position.x - (pigDimensions.x / 2),
    xMax: pigMesh.position.x + (pigDimensions.x / 2),
    yMin: pigMesh.position.y - (pigDimensions.y / 2),
    yMax: pigMesh.position.y + (pigDimensions.y / 2),
    zMin: pigMesh.position.z - (pigDimensions.z / 2),
    zMax: pigMesh.position.z + (pigDimensions.z / 2),
  };

  // Run through each object and detect if there is a collision.
  for (let i = 0; i < collisions.length; i++) {
    if (!collisions[i]) continue;
    const bbox = collisions[i].boundingBox;
    if (bbox.type === 'collision') {
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
export const narrowCollisionSweep = (entity) => {
  const pigMesh = game.meshes[game.pig];

  const { vertices } = pigMesh.compositeGeometry;
  for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
    const localVertex = vertices[vertexIndex].clone();
    const globalVertex = localVertex.applyMatrix4(pigMesh.matrix);
    const directionVector = globalVertex.sub(pigMesh.position);
    const originPoint = pigMesh.position.clone();

    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    const collisionResults = ray.intersectObject(entity);

    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      console.log(entity);
      /**
       * Some notes one what to do with this collision
       *
       * 1. Need momentum of both bodies before collision (mass * velocity)
       * 2. Need to apply resultant velocities to each body
       * 3. Apply air resistance and such to the other bodies
       *
       *
       * Calculating new velocities (from stack exchange)
       * v: velocity after collision
       * u: velocity before collision
       * m: mass (use the largest number possible for the mass of a fixed, static object)
       *
       * A.v = (A.u * (A.m - B.m) + (2 * B.m * B.u)) / (A.m + B.m)
       * B.v = (B.u * (B.m - A.m) + (2 * A.m * A.u)) / (A.m + B.m)
       */

      return true;
    }
  }
  return false;
};
