class OutputController {
  constructor(pop) {
    this.population = pop;
    this.hookUpPopCounter();
  }

  updatePop(pop) {
    this.population = pop;
  }

  displayGeneration() {
    $("#generationCounterValue").text(this.population.generation);
  }

  displayBestDot() {
    var dot = this.population.bestDot;
    var prevFit = $("#bestDotFitnessValue").text();
    var prevStep =$("#bestDotStepCountValue").text();
    $("#bestDotFitnessValue").text(dot.fitness);
    $("#bestDotStepCountValue").text(pop.maxStep);
    $("#bestDotFitnessImprovement").text((dot.fitness - prevFit).toFixed(2));
    $("#bestDotStepCountImprovement").text(pop.maxStep - prevStep);
  }

  hookUpPopCounter() {
    $("#populationCounterSlider").val(this.population.count);
    $("#populationCounterSlider").on("change", _.debounce(function(e) {
      var value = $(e.target).val();
      this.population.updateCount(value);
    }.bind(this)));

    $("#populationCounterSet50").on("click", function (e) {
      this.population.updateCount(50);
    }.bind(this));

    $("#populationCounterSet250").on("click", function (e) {
      this.population.updateCount(250);
    }.bind(this));

    $("#populationCounterSet500").on("click", function (e) {
      this.population.updateCount(500);
    }.bind(this));

    $("#populationCounterSet1000").on("click", function (e) {
      this.population.updateCount(1000);
    }.bind(this));
  }
}
