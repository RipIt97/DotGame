class Brain {
  constructor(size) {
    this.step = 0;
    this.directions = new Array(size);

    this.randomize();
  }

  randomize() {
    for (var i = 0; i < this.directions.length; i++) {
      var x = Math.floor(Math.random() * 5) - 2;
      var y = Math.floor(Math.random() * 5) - 2;
      this.directions[i] = [x,y];
    }
  }

  clone() {
    var brain = new Brain(this.directions.length);
    brain.steps = 0;
    for (var i = 0; i < this.directions.length; i++) {
      brain.directions[i] = this.directions[i];
    }
    return brain;
  }

  mutate(fitness) {
    var rate = .4 - fitness;
    if (rate < .01) { rate = .01; }
    if (rate > .1) { rate = .1; }
    rate = .01;
    for (var i = 0; i < this.directions.length; i++) {
      if (Math.random() < rate) {
        this.directions[i] = this.getRandomMove();
      }
    }
  }

  getRandomMove() {
    var x = Math.floor(Math.random() * 9) - 4;
    var y = Math.floor(Math.random() * 9) - 4;
    return [x,y];
  }

}
