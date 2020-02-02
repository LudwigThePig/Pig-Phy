import * as THREE from 'three';


/**
 * @param {THREE.Mesh} entityA a collidable entity
 * @param {THREE.Mesh} entityB another collidable entity
 * @returns {boolean} true if the two entities' bounding box intersect.
 * @description This function compares two entities against eachother to determine if there bounding
 * boxes are interescting. Bounding boxes are just six coordinates--min and max x/y/z coordinates.
 * As the name suggests, this is a rough and cheap approximation. If this tests passes, we perform
 * a narrow collision detection sweep.
 */
export const isBroadCollision = (entityA, entityB) => {
  // Bbox: A set of verticies outling the approximate boundaries of an entity
  const boundBoxA = entityA.geometry.boundingBox;
  const boundBoxB = entityB.geometry.boundingBox;

  // The absolute coords of the bounding box
  const absBoundA = {
    xMin: entityA.position.x + boundBoxA.min.x,
    xMax: entityA.position.x + boundBoxA.max.x,
    yMin: entityA.position.y + boundBoxA.min.y,
    yMax: entityA.position.y + boundBoxA.max.y,
    zMin: entityA.position.z + boundBoxA.min.z,
    zMax: entityA.position.z + boundBoxA.max.z,
  };
  const absBoundB = {
    xMin: entityB.position.x + boundBoxB.min.x,
    xMax: entityB.position.x + boundBoxB.max.x,
    yMin: entityB.position.y + boundBoxB.min.y,
    yMax: entityB.position.y + boundBoxB.max.y,
    zMin: entityB.position.z + boundBoxB.min.z,
    zMax: entityB.position.z + boundBoxB.max.z,
  };

  // The actual check
  if ((absBoundA.xMin <= absBoundB.xMax && absBoundA.xMax >= absBoundB.xMin)
      && (absBoundA.yMin <= absBoundB.yMax && absBoundA.yMax >= absBoundB.yMin)
      && (absBoundA.zMin <= absBoundB.zMax && absBoundA.zMax >= absBoundB.zMin)) {
    // entityB.position.y += 0.1;

    return true;
  }
  return false;
};


/**
 * @param {THREE.Mesh} entityA a collidable entity
 * @param {THREE.Mesh} entityB another collidable entity
 * @returns {boolean} true if the entities are intersecting
 */
export const isNarrowCollision = (entityA, entityB) => {
  let rayCastingEntity;
  let targetEntity;

  // Raycasting from the entity with more verticies provides more precision.
  // Not sure if this is good practice...
  if (entityA.geometry.vertices.length > entityB.geometry.vertices.length) {
    rayCastingEntity = entityA;
    targetEntity = entityB;
  } else {
    rayCastingEntity = entityB;
    targetEntity = entityA;
  }

  const { vertices } = rayCastingEntity.geometry;

  for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
    const localVertex = vertices[vertexIndex].clone();
    const globalVertex = localVertex.applyMatrix4(rayCastingEntity.matrix);
    const directionVector = globalVertex.sub(rayCastingEntity.position);
    const originPoint = rayCastingEntity.position.clone();

    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    const collisionResults = ray.intersectObject(targetEntity);

    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      return true;
    }
  }
  return false;
};

export const handleCollision = (entityA, entityB) => {
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
  entityA.position.x += 0.1;
  entityB.position.x -= 0.1;
};
