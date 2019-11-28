import 'normalize.css';
import './style.scss';

import renderer from './mainThread';


window.onload = () => {
  document.body.appendChild(renderer.domElement);
};
