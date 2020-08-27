class OutputController {
  constructor(pop) {
    this.population = pop;
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
}
