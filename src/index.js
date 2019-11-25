import 'normalize.css';
import './style.scss';

import GameController from './rawWebGL';
import renderer from './renderer';


window.onload = () => {
  document.body.appendChild(renderer.domElement);
};
