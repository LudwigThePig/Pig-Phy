class Main {
  constructor() {
    this.height = window.innerHeight * 0.98;
    this.width = (this.height / 9) * 16;
    this.gl;
  }

    canvas = canvasRef.current;
    gl = canvas.getContext('webgl2');

    pt = val => val * (height / 1000);
    gl.getParameter(gl.LINE_WIDTH);
  }, [canvasRef, height, width]);


};

export default Main;
