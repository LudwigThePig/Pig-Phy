import 'normalize.css';
import './style.scss';

import renderer from './mainThread';


window.onload = () => {
  document.getElementById('canvas-container').appendChild(renderer.domElement);
};
