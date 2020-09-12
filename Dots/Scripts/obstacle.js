class Obstacle {
  constructor(pos, width, height) {
    this.position = pos;
    this.width = width;
    this.height = height;
  }

  show() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "orange";
    ctx.fillRect(this.position[0], this.position[1], this.width, this.height);
  }
}
