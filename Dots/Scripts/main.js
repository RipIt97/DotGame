var pop;
var output;
var tempCount = window.localStorage.getItem("DOT_COUNT");
var DOT_COUNT = (isNaN(tempCount) || tempCount == null) ? 50 : tempCount; // This controls how many dots
var GEN_LIMIT = 1000; // This controls how many generations to run
var MOVE_LIMIT = 1000; // This controls the max amount of moves a dot can make before it dies

window.onload = function () {
  // Create the canvas
  var cv = $("<canvas id='myCanvas' height='800px' width='1600px'></canvas>");
  cv.css("background-color", "lightgrey");
  $("#canvasHolder").append(cv);

  pop = new Population(DOT_COUNT);
  output = new OutputController(pop);

  $(pop).bind("updateCount", function (test, newCount, test2, test3) {
    window.localStorage.setItem("DOT_COUNT", newCount);
    location.reload();
  })
  var promise = new Promise(runGenerationStep);
  promise.then(runGenerationStepFinished).then(runPostGeneration);
}

runGenerationStep = function(resolve, reject) {
  setTimeout(
    function(resolve, reject) {
      if (!pop.allDotsDead()) {
        pop.update();
        if (true)//pop.generation % 5 == 0)
        {
          pop.show();
        }
        resolve(new Promise(runGenerationStep));
      }
      else {
        resolve(1);
      }
    }.bind(this, resolve, reject), 20);
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

    console.log("Best dot: " + pop.bestDot.fitness + " (" + pop.bestDot.finalStep + ")");
    pop.generateBabies();
    pop.mutateDots();
    pop.setPrevFitnesses();
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
