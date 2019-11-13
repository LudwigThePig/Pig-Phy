import 'normalize.css'
import './style.scss';

class GameController {
  constructor(context, height) {
    this.height = height;
    this.width = (height / 9) * 16;
    this.ctx = context;

    this.init = this.init.bind(this);
  }

  init() {
    this.ctx.height = this.height;
    this.ctx.width = this.width;
  }

};

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('webgl2')
  const height = window.innerHeight * 0.98;
  const gameController = new GameController(ctx, height);

  gameController.init();
}


