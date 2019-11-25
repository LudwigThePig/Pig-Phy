import 'normalize.css';
import './style.scss';

import renderer from './renderer';


window.onload = () => {
  document.body.appendChild(renderer.domElement);
};
