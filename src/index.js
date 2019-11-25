import 'normalize.css';
import 'style.scss';

import GameController from './rawWebGL';

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const height = window.innerHeight * 0.98;
  const gameController = new GameController(canvas, height);

  gameController.init();
};
