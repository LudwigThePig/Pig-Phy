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

/**
 * @param {THREE.Mesh} A One entity in a collision event
 * @param {THREE.Mesh} B The other entity in a collision event
 * @returns {void} function mutates the entities
 */
export const handleCollision = (A, B) => {
  if (!A || !B) return;

  // Copy of velocity before collision
  const AU = { x: A.v.x, y: A.v.y, z: A.v.z };
  const BU = { x: B.v.x, y: B.v.y, z: B.v.z };

  A.v.x = (AU.x * (A.mass - B.mass) + (2 * B.mass * BU.x)) / (A.mass + B.mass);
  A.v.z = (AU.z * (A.mass - B.mass) + (2 * B.mass * BU.z)) / (A.mass + B.mass);

  B.v.x = (BU.x * (B.mass - A.mass) + (2 * A.mass * AU.x)) / (A.mass + B.mass);
  B.v.z = (BU.z * (B.mass - A.mass) + (2 * A.mass * AU.z)) / (A.mass + B.mass);
};
