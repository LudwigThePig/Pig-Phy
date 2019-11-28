# Ludiwg's Game

# Table of Contents
- [Ludiwg's Game](#ludiwgs-game)
- [Table of Contents](#table-of-contents)
- [About](#about)
- [Technology](#technology)
- [Requirements and Running Locally](#requirements-and-running-locally)
- [Features](#features)
  - [Game Features](#game-features)
  - [Engine Features](#engine-features)

# About

Although this is a game and running the repo locally will launch a game, the aim of this project is to develop a 3d game engine. This project will be sufficiently complete when I abandon it and start a new repo with all of the things that I have learned in here. This is more of a draft than a final product.

# Technology

- **Webpack** for bundling JavaScript and css files
- **Three.js**  for rendering 3d assets
- **Web Workers** for delegating tasks to separate threads

# Requirements and Running Locally

**Requirements**:

- A modern browser that supports webl
- Node version 12.*.* or greater. Early version may work but are not explicitly supported


**Running Locally**
Open your terminal and enter,

```sh
git clone https://github.com/LudwigThePig/Ludwig-s-Game.git
cd Ludwig-s-Game
npm install
npm start
```
# Features

## Game Features

You can move Ludwig around and hit some blocks.

## Engine Features

**Collision Detection**

Currently, the engine is setup to detect collision between rigid bodies. To apply collision detection to a mesh, use the `applyRigidBody` method. It will extract the bounding verticies and push them onto the rigidBodies array, which is then checked at render time.

**Player Movement**

Player movement is pretty simple right now. You can move forward, backwards, and rotate.

**Physics**

If the pig hits a box, it goes flying up! Not much more than that at the moment
