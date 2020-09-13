class Dot {
  constructor(goal, obstacles, position) {
    this.canvas = document.getElementById("myCanvas");
    this.brain = new Brain(MOVE_LIMIT);
    this.radius = 2;
    this.position = [100,400];
    this.velocity = [0,0];
    this.isDead = false;
    this.isWinner = false;
    this.goal = goal;
    this.obstacles = obstacles;
    this.fitness = 0;
    this.isBestDot = false;
    this.timesStalled = 0;
    this.consecutiveStalls = 0;
    this.finalStep = MOVE_LIMIT;
  }

  show() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var rad = this.radius;
    ctx.beginPath();

    ctx.fillStyle = "black";
    if (this.isWinner) {ctx.fillStyle = "blue"; }
    if (this.isDead) { ctx.fillStyle = "red"; }
    if (this.isBestDot) {
      ctx.fillStyle = "purple";
      rad = 4;
    }
    ctx.arc(this.position[0], this.position[1], rad, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    this.isShowing = true;
  }

  move() {
    if (this.brain.directions.length > this.brain.step) {
      var move = this.brain.directions[this.brain.step];
      this.velocity[0] += move[0];
      if (this.velocity[0] > 5) { this.velocity[0] = 5; }
      if (this.velocity[0] < -5) { this.velocity[0] = -5; }

      this.velocity[1] += move[1];
      if (this.velocity[1] > 5) { this.velocity[1] = 5; }
      if (this.velocity[1] < -5) { this.velocity[1] = -5; }

      this.position[0] += this.velocity[0];
      this.position[1] += this.velocity[1];
      this.brain.step++;
    } else {
      this.isDead = true;
    }
  }

  update() {
    if (!this.isDead && !this.isWinner) {
      this.move();
      this.checkPosition();
    }
  }

  checkPosition() {
    if (this.position[0] < 2 || this.position[0] > this.canvas.width - 2 || this.position[1] < 2 || this.position[1] > this.canvas.height - 2) {
      this.isDead = true;
      this.finalStep = this.brain.step;
    }
    else if ((this.position[0] < this.goal.x + 5) && (this.position[0] > this.goal.x - 5) && (this.position[1] < this.goal.y + 5) && (this.position[1] > this.goal.y - 5)) {
      this.isWinner = true;
      this.finalStep = this.brain.step;
    }
    else if (this.checkObstacles()) {
      this.isDead = true;
      this.finalStep = this.brain.step;
    }
  }

  checkObstacles() {
    for (var i = 0; i < this.obstacles.length; i++) {
      var obst = this.obstacles[i];
      var tL = obst.position;
      var tR = [obst.position[0] + obst.width, obst.position[1]];
      var bR = [obst.position[0] + obst.width, obst.position[1] + obst.height];
      var bL = [obst.position[0], obst.position[1] + obst.height];
      if (this.position[0] > tL[0] - 2 && this.position[0] < tR[0] + 2 && this.position[1] > tL[1] - 2 && this.position[1] < bL[1] + 2) {
        return true;
      }
    }
    return false;
  }

  generateBaby() {
    var dot = new Dot(this.goal, this.obstacles);
    dot.brain = this.brain.clone();
    dot.isDead = false;
    dot.isWinner = false;
    dot.timesStalled = this.timesStalled;
    dot.consecutiveStalls = this.consecutiveStalls;
    dot.finalStep = this.finalStep;
    return dot;
  }

  calculateFitness() {
    // Add step points
    var stepPoints = this.isWinner ? Math.max(1000 - this.finalStep, 0) : 0;
    var xDif = this.position[0] - this.goal.x;
    var yDif = this.position[1] - this.goal.y;
    var dist = Math.floor(Math.sqrt(Math.pow(xDif, 2) + Math.pow(yDif, 2)));
    if (dist < .001) { dist = .001; }
    var distPoints = 1 / dist;
    if (distPoints < .01) { distPoints *= 100; }
    this.fitness = stepPoints + distPoints;
    this.fitness = this.fitness.toFixed(2);
  }

  mutateDot(bestFitness) {
    var startMutationOn = 0;
    var ratio = this.brain.directions.length / 20; // 5% increase at a time

    if (bestFitness - this.brain.prevFitness < .01) { // fitness didn't increase enough
      this.timesStalled += 1;
      startMutationOn = Math.min(this.finalStep - Math.abs(this.finalStep - (ratio * this.consecutiveStalls)) + ((ratio / 4) * this.timesStalled), this.finalStep - ratio);
      startMutationOn = Math.max(startMutationOn, 0);
      this.consecutiveStalls += 1;
    }
    else {
       this.consecutiveStalls = 0;
    }

    if (this.consecutiveStalls % 10 == 0 && this.consecutiveStalls != 0) {
      this.brain.randomize(startMutationOn);
    }

    this.brain.mutate(bestFitness, startMutationOn, this.timesStalled, this.consecutiveStalls);
  }

  // 50 dots, 763 first win, 720 best win 

  setDotPrevFitness (bestFitness) {
    this.brain.setPrevFitness(bestFitness);
  }

}
