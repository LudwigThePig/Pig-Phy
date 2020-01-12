/* eslint-disable max-classes-per-file */
// * ___________Components___________
const moveables = () => {

};

const renderables = (x, y, z) => {

};

// * ___________Systems___________


export default class GameManager {
  constructor() {
    this.index = 0;
    this.entities = [];
  }

  createEntity() {
    this.index++;
    this.entities[this.index] = undefined;
    return this.index;
  }
}


export class Entity {
  constructor(gameManager, pointer) {
    this.gameManager = gameManager;
    this.pointer = pointer;
  }

  addComponent(component, value) {

  }
}
