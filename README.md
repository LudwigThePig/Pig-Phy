# Pig Phy

# Table of Contents
- [Ludiwg's Game](#ludiwgs-game)
- [Table of Contents](#table-of-contents)
- [About](#about)
- [Technology](#technology)
- [Requirements and Running Locally](#requirements-and-running-locally)


# About

This is my first stab at writing a game engine from scratch, where *from scratch* is every layer above the actual rendering to the canvas. The physics engine, collision detection, and shader library are all proprietary. The game was architected with an [ECS](https://en.wikipedia.org/wiki/Entity_component_system). 

My goal is to implement this into my website ([ludwigthepig.com](https://ludwigthepig.com)), build a game around the engine, create a dozen or so levels, and display one level per. I will release the source code with some documentation that makes it easy for others to create there own levels and have it featured on the site.

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

