var pop;
var output;
var DOT_COUNT = 300; // This controls how many dots
var GEN_LIMIT = 100; // This controls how many generations to run
var MOVE_LIMIT = 300; // This controls the max amount of moves a dot can make before it dies

window.onload = function () {
  // Create the canvas
  var cv = $("<canvas id='myCanvas' height='800px' width='1600px'></canvas>");
  cv.css("background-color", "lightgrey");
  $("#content").append(cv);

  pop = new Population(DOT_COUNT);
  output = new OutputController(pop);

  var promise = new Promise(runGenerationStep);
  promise.then(runGenerationStepFinished).then(runPostGeneration);
}

runGenerationStep = function(resolve, reject) {
  setTimeout(
    function(resolve, reject) {
      if (!pop.allDotsDead()) {
        pop.update();
        pop.show();
        resolve(new Promise(runGenerationStep));
      }
      else {
        resolve(1);
      }
    }.bind(this, resolve, reject), 25);
}

runGenerationStepFinished = function (done) {
  if (done == 1) {
    // Our generation is done!
    console.log(`Generation ${pop.generation} done!`);
  }
  else {
    // We have a promise that we'll need to resolve
    done.then(runGenerationStepFinished);
  }
}

runPostGeneration = function() {
  setTimeout( function () {
    pop.calculateFitness();

    output.updatePop(pop);
    output.displayGeneration();
    output.displayBestDot();
    
    console.log("Best dot: " + pop.bestDot.fitness);
    pop.generateBabies();
    pop.mutateDots();
    pop.generation++;

    if (pop.generation < GEN_LIMIT) {
      var promise = new Promise(runGenerationStep);
      promise.then(runGenerationStepFinished).then(runPostGeneration);
    }
  });
}

// BEST .951
/*
IDEA
Turn it into a game played on a website. Let users control simulations and run them using JavaScript.

Allow visual customizations like colors, show all dots or only best dot, etc.

Provide customizations like being able to control population size, generation count, move count, spawn position, goal position,
create obstacles, mutation rate, mutation severity, etc.

Allow users to share replays of simuations by copying JSON blob of move dictionary and provide API to load others.
Eventually, create a centralized sharing location where replays can be liked to rise to top of leaderboards.

*/
