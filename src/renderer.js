import * as THREE from 'three';

const height = window.innerHeight - 20;
const width = window.innerWidth - 20;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);


export default renderer;
