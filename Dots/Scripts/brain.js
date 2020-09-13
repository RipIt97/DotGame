class Brain {
  constructor(size) {
    this.step = 0;
    this.directions = new Array(size);
    this.prevFitness = 0;
    this.randomize(0);
  }

  randomize(index) {
    if (index == null) { index = 0; }
    for (var i = index; i < this.directions.length; i++) {
      var x = Math.floor(Math.random() * 5) - 2;
      var y = Math.floor(Math.random() * 5) - 2;
      this.directions[i] = [x,y];
    }
  }

  clone() {
    var brain = new Brain(this.directions.length);
    brain.prevFitness = this.prevFitness;
    brain.steps = 0;
    for (var i = 0; i < this.directions.length; i++) {
      brain.directions[i] = this.directions[i];
    }
    return brain;
  }

  mutate(fitness, startMutationOn, ts, cs) {
    var highMutationOn = false;
    if (fitness - this.prevFitness < .01) {
      highMutationOn = true;
    }

    console.log("High Mutation: " + highMutationOn + ", Start Mutation On: " + startMutationOn + ", Consecutive Stalls: " + cs + ", Total Stalls: " + ts);
    for (var i = 0; i < this.directions.length; i++) {
      var rate = .005;
      if (highMutationOn) {
         if (i > startMutationOn) { rate = .05; }
         else { rate = 0; }
      }
      if (Math.random() < rate) {
        this.directions[i] = this.getRandomMove();
      }
    }
  }

  getRandomMove() {
    var x = Math.floor(Math.random() * 13) - 6;
    var y = Math.floor(Math.random() * 13) - 6;
    return [x,y];
  }

  setPrevFitness (fitness) {
    this.prevFitness = fitness;
  }

}
