class Population {
  constructor (dotCount) {
    this.canvas = document.getElementById("myCanvas");
    this.count = dotCount;
    this.dots = [];
    this.generation = 0;
    this.maxStep = MOVE_LIMIT;

    this.goal = {
      x: 1400,
      y: 400,
      radius: 5,
    }
    this.obstacles =[];

    var o1 = new Obstacle([250,500], 100, 300);
    var o2 = new Obstacle([250,0], 100, 300);
    this.obstacles.push(o1);
    this.obstacles.push(o2);

    var o3 = new Obstacle([500,250], 100, 300);
    var o4 = new Obstacle([500,0], 100, 50);
    var o5 = new Obstacle([500,750], 100, 50);
    this.obstacles.push(o3);
    this.obstacles.push(o4);
    this.obstacles.push(o5);

    var o6 = new Obstacle([750,500], 100, 300);
    var o7 = new Obstacle([750,0], 100, 300);
    this.obstacles.push(o6);
    this.obstacles.push(o7);

    var o8 = new Obstacle([1000,250], 100, 300);
    var o9 = new Obstacle([1000,0], 100, 50);
    var o10 = new Obstacle([1000,750], 100, 50);
    this.obstacles.push(o8);
    this.obstacles.push(o9);
    this.obstacles.push(o10);

    var o11 = new Obstacle([1250,500], 100, 300);
    var o12 = new Obstacle([1250,0], 100, 300);
    this.obstacles.push(o11);
    this.obstacles.push(o12);

    var o13 = new Obstacle([1500,250], 100, 300);
    var o14 = new Obstacle([1500,0], 100, 50);
    var o15 = new Obstacle([1500,750], 100, 50);
    this.obstacles.push(o13);
    this.obstacles.push(o14);
    this.obstacles.push(o15);



    for (var i = 0; i < dotCount; i++) {
      this.dots.push(new Dot(this.goal, this.obstacles));
    }
    this.clearCanvas();
  }

  update() {
    for (var i = 0; i < this.dots.length; i++) {
      if (this.dots[i].brain.step > this.maxStep) {
        this.dots[i].isDead = true;
      }
      else {
        //console.log(`Generation ${this.generation} Move ${this.dots[0].brain.step}`);
        this.dots[i].update();
      }
    }
  }

  show() {
    this.clearCanvas();
    this.showObstacles();
    for (var i = 0; i < this.dots.length; i++) {
      this.dots[i].show();
    }
  }


  // ----------------------------------------------------------------------------------------------------------------
  clearCanvas () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    // Clear previous
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add the goal
    ctx.beginPath();
    ctx.arc(this.goal.x, this.goal.y, this.goal.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.stroke();
    ctx.fill();
  }

  showObstacles() {
    for (var i = 0; i < this.obstacles.length; i++) {
      var obst = this.obstacles[i];
      obst.show();
    }
  }

  allDotsDead() {
    for (var i = 0; i < this.dots.length; i++) {
      if (!this.dots[i].isDead) {
        if (!this.dots[i].isWinner) { return false; }
      }
    }
    return true;
  }

  calculateFitness() {
    this.sumOfFitness = 0;
    for (var i = 0; i < this.dots.length; i++) {
      this.dots[i].calculateFitness();
      this.sumOfFitness += this.dots[i].fitness;
    }

    var bestFitness = Math.max.apply(Math, this.dots.map(function(o) { return o.fitness; }));
    this.bestDot = this.dots.find(dot => dot.fitness == bestFitness);
    if (this.bestDot.isWinner) {
      this.maxStep = Math.min(this.bestDot.brain.step, this.maxStep);
    }
  }

  generateBabies() {
    var newDots = new Array(this.dots.length);
    newDots[0] = pop.bestDot.generateBaby(); // Best dot always lives
    newDots[0].isBestDot = true;
    for (var i = 1; i < newDots.length; i++) {
      newDots[i] = this.selectParent();
    }
    this.dots = newDots;
  }

  selectParent() {
    var rand = Math.random() * this.sumOfFitness;
    var localSum = 0;
    for (var i = 0; i < this.dots.length; i++) {
      localSum += this.dots[i].fitness;
      if (localSum > rand) { return this.dots[i].generateBaby(); }
    }
    return this.bestDot.generateBaby(); // shouldn't ever get here
  }

  mutateDots() {
    for (var i = 1; i < this.dots.length; i++) {
      this.dots[i].mutateDot(this.bestDot.fitness);
    }
    this.dots[0].timesStalled = this.dots[1].timesStalled;
    this.dots[0].consecutiveStalls = this.dots[1].consecutiveStalls;
  }

  setPrevFitnesses() {
    for (var i = 0; i < this.dots.length; i++) {
      this.dots[i].setDotPrevFitness(this.bestDot.fitness);
    }
  }

  //---------------------------------------------------------------------------

  updateCount(count) {
    if (count == undefined || count == this.count) { return; }
    $(this).trigger("updateCount", count);
  }

}
