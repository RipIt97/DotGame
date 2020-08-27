class OutputController {
  constructor(pop) {
    this.population = pop;
    this.hookUpPopSlider();
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

  hookUpPopSlider() {
    $("#populationCounterSlider").val(this.population.count);
    $("#populationCounterSlider").on("change", _.debounce(function(e) {
      var value = $(e.target).val();
      if (value == undefined || value == this.population.count) { return; }
      console.log(value);
      this.population.updateCount(value);
    }.bind(this)));
  }
}
