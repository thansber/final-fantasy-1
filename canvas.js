class Canvas {

  constructor(cv, ctx) {
    this.canvas = cv;
    this.ctx = this.canvas.getContext('2d');
    this.scale = 32;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize(w, h) {
    const canvasWidth = w * this.scale;
    const canvasHeight = h * this.scale;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.width = canvasWidth + "px";
    this.canvas.style.height = canvasHeight + "px";
  }
}