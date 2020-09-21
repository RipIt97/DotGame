class LevelCreator {
  constructor() {
    this.Canvas = this.CreateCanvas();
    this.Obstacles = [];
    this.Goal = "";
    this.Spawn = "";

    this._drawStartPosition = null;
    this._selectedObstacle = null;
  }

  CreateCanvas () {
    var canvas = document.createElement("Canvas");
    canvas.width = 1600;
    canvas.height = 800;
    canvas.setAttribute("style", "background-color: lightgrey;");
    return canvas;
  }

  EnableAddObstacle () {
    this._HookUpCanvasEvents();
  }

  _HookUpCanvasEvents () {
    var canvas = this.Canvas;

    // Reset vars
    this._drawStartPosition = null;

    canvas.onclick = function (e) {
      if (this._drawStartPosition == null) {
        // We need to set a start position
        this._drawStartPosition = [e.pageX - 8, e.pageY - 8];
      }
      else {
        // We're ending our obstacle
        var newX = e.pageX - 8;
        var newY = e.pageY - 8;
        var width = newX - this._drawStartPosition[0];
        var height = newY - this._drawStartPosition[1];
        this.Obstacles.push([this._drawStartPosition[0], this._drawStartPosition[1], width, height]);
        this._drawStartPosition = null;
        this._DisableCanvasEvents();
        this.UpdateCanvas();
      }
    }.bind(this);

    canvas.onmousemove = function (e) {
      if (this._drawStartPosition == null) { return; } // Not started yet

      // Calculate new position
      var newX = e.pageX - 8;
      var newY = e.pageY - 8;
      var width = newX - this._drawStartPosition[0];
      var height = newY - this._drawStartPosition[1];

      // Set up some vars
      if (this._drawOldPosition == null) { this._drawOldPosition = [newX, newY]; }
      var canvas = this.Canvas;
      var ctx = canvas.getContext("2d");

      // Update the canvas
      this.UpdateCanvas();

      // Draw new rectangle
      ctx.strokeRect(this._drawStartPosition[0], this._drawStartPosition[1], width, height);
    }.bind(this);
  }

  _DisableCanvasEvents() {
    this.Canvas.onclick = null;
    this.Canvas.onmousemove = null;
  }

  RemoveLastObstacle() {
    this.Obstacles.pop();
    this.UpdateCanvas();
  }

  EnableMoveObstacle() {
    var canvas = this.Canvas;
    var ctx = canvas.getContext("2d");

    this.UpdateCanvas();

    canvas.onmousedown = function (e) {
      var xPos = e.pageX - 8;
      var yPos = e.pageY - 8;
      var selectedObstacleKey = null;

      for (var obstacleKey in this.Obstacles) {
        var obstacle = this.Obstacles[obstacleKey];
        if (xPos >= obstacle[0] && xPos <= obstacle[0] + obstacle[2]) {
          if (yPos >= obstacle[1] && yPos <= obstacle[1] + obstacle[3]) {
            selectedObstacleKey = obstacleKey;
            break;
          }
        }
      }

      if (selectedObstacleKey != null) {
        this._selectedObstacleKey = selectedObstacleKey;
        this._MoveObstacleStage2([xPos, yPos]);
      }
    }.bind(this);
  }

  _MoveObstacleStage2(originalPosition) {
    var canvas = this.Canvas;
    var ctx = canvas.getContext("2d");
    var selectedObstacle = this.Obstacles[this._selectedObstacleKey];
    this.Obstacles.splice(this._selectedObstacleKey, 1);
    this._selectedObstacleKey = null;
    canvas.onmousedown = null;

    ctx.fillStyle = "blue";
    ctx.fillRect(selectedObstacle[0], selectedObstacle[1], selectedObstacle[2], selectedObstacle[3]);

    canvas.onmousemove = function (originalPosition, selectedObstacle, e) {
      var xPos = e.pageX - 8;
      var yPos = e.pageY - 8;
      var xShift = xPos - originalPosition[0];
      var yShift = yPos - originalPosition[1];

      this.UpdateCanvas();
      selectedObstacle[0] += xShift;
      selectedObstacle[1] += yShift;
      originalPosition[0] = selectedObstacle[0];
      originalPosition[1] = selectedObstacle[1];

      var canvas = this.Canvas;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "blue";
      ctx.fillRect(selectedObstacle[0], selectedObstacle[1], selectedObstacle[2], selectedObstacle[3]);
      this._selectedObstacle = selectedObstacle;
    }.bind(this, originalPosition, selectedObstacle);

    canvas.onmouseup = function (e) {
      this.Obstacles.push(this._selectedObstacle);
      this._selectedObstacle = null;
      this.Canvas.onmousemove = null;
      this.UpdateCanvas();
    }.bind(this);
  }

  DrawObstacles () {
    var canvas = this.Canvas;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "orange";

    for (var obstacleKey in this.Obstacles) {
      var obstacle = this.Obstacles[obstacleKey];
      ctx.fillRect(obstacle[0], obstacle[1], obstacle[2], obstacle[3]);
    }
  }

  ClearCanvas() {
    var canvas = this.Canvas;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  UpdateCanvas () {
    this.ClearCanvas();
    this.DrawObstacles();
  }

  Show () {
    // Reset the body of the page
    var holder = document.getElementById("CanvasHolder");
    holder.innerHTML = "";

    // Add the canvas
    holder.appendChild(this.Canvas);
  }
}


window.onload = function () {
  var lc = new LevelCreator();
  lc.Show();

  $("#AddObstacle").on("click", function (e) {
    lc.EnableAddObstacle();
  }.bind(this));

  $("#RemoveLastObstacle").on("click", function (e) {
    lc.RemoveLastObstacle();
  }.bind(this));

  $("#MoveObstacle").on("click", function (e) {
    lc.EnableMoveObstacle();
  }.bind(this));
}
