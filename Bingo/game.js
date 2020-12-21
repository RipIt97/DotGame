class Game {
  constructor() {
    this._setup();
    this._startNewGame();
  }

  _startNewGame () {
    this.called = [];
    this.uncalled = [];
    this._grid = [];
    this._grid[0] = [];
    this._grid[1] = [];
    this._grid[2] = [];
    this._grid[3] = [];
    this._grid[4] = [];
    this._lastCalled = null;

    for (var i = 1; i <= 75; i++)
    {
      this.uncalled.push(i);
    }

    $("#justCalledText").text("");
    $("#BList").empty();
    $("#IList").empty();
    $("#NList").empty();
    $("#GList").empty();
    $("#OList").empty();
  }

  _setup () {
    // Create the containers
    var body = $("body");
    var topRow = $("<div id='topRow'></div>");
    topRow.append($("<div id='topLeft'></div>"));
    topRow.append($("<div id='topCenter'></div>"));
    topRow.append($("<div id='topRight'></div>"));
    var botRow = $("<div id='bottomRow'></div>");

    // Start adding controls
    this._addLastCalled(topRow.find("#topLeft"));
    this._addCenter(topRow.find("#topCenter"));
    this._addControls(topRow.find("#topRight"));

    // Add bingo grid
    this._addBottom(botRow);

    // Finally add to the DOM
    body.append(topRow);
    body.append(botRow);
  }

  _addLastCalled (container) {
    return;
    var label = $("<label id='lastCalledLabel'>Last Called:</label>")
    var text = $("<p id='lastCalledText'>I19</p>")

    container.append(label);
    container.append(text);
  }

  _addCenter (container) {
    var label = $("<label id='justCalledLabel'>Just Called:</label>");
    var called = $("<p id='justCalledText'></p>");

    container.append(label);
    container.append(called);
  }

  _addControls (container) {
    var newGame = $("<button id='newGame'>New Game</button>");
    var roll = $("<button id='roll'>Roll</button>");

    newGame.bind("click", function (e) {
      this._startNewGame();
    }.bind(this));

    roll.bind("click", function (e) {
      this._doRoll();
    }.bind(this));

    container.append(newGame);
    container.append(roll);
  }

  _addBottom (container) {
    var letterBox = $("<div id='letterBox'></div>");
    letterBox
      .append("<div id='B'><p>B</p><ul id='BList'></ul></div>")
      .append("<div id='I'><p>I</p><ul id='IList'></ul></div>")
      .append("<div id='N'><p>N</p><ul id='NList'></ul></div>")
      .append("<div id='G'><p>G</p><ul id='GList'></ul></div>")
      .append("<div id='O'><p>O</p><ul id='OList'></ul></div>")

    container.append(letterBox);
  }

  _doRoll () {
    if (this.uncalled.length == 0) { return; }
    var rand = Math.floor(Math.random() * this.uncalled.length);
    var val = this.uncalled[rand];
    this.called.push(val);
    this.uncalled.splice(rand, 1);
    this._updateText(val);
    this._updateGrid(val);
  }

  _updateText (newValue) {
    var oldValue = $("#justCalledText").text();
    this._lastCalled = oldValue.length == 0 ? null : oldValue;
    var textVal;
    var parsedValue = parseInt(newValue);
    if (parsedValue <= 15) {
      textVal = "B";
    }
    else if (parsedValue <= 30) {
      textVal = "I";
    }
    else if (parsedValue <= 45) {
      textVal = "N";
    }
    else if (parsedValue <= 60) {
      textVal = "G";
    }
    else {
      textVal = "O";
    }
    textVal = textVal + newValue;
    $("#justCalledText").text(textVal);
  }

  _updateGrid (newValue) {
    var parsedValue = parseInt(newValue);
    if (parsedValue <= 15) {
      this._grid[0].push(parsedValue);
      this._grid[0].sort(function (a, b) { return a - b; });
    }
    else if (parsedValue <= 30) {
      this._grid[1].push(parsedValue);
      this._grid[1].sort(function (a, b) { return a - b; });
    }
    else if (parsedValue <= 45) {
      this._grid[2].push(parsedValue);
      this._grid[2].sort(function (a, b) { return a - b; });
    }
    else if (parsedValue <= 60) {
      this._grid[3].push(parsedValue);
      this._grid[3].sort(function (a, b) { return a - b; });
    }
    else {
      this._grid[4].push(parsedValue);
      this._grid[4].sort(function (a, b) { return a - b; });
    }

    $("#BList").empty();
    this._grid[0].forEach(val => $("#BList").append("<li id='" + val + "'>" + val + "</li>"));

    $("#IList").empty();
    this._grid[1].forEach(val => $("#IList").append("<li id='" + val + "'>" + val + "</li>"));

    $("#NList").empty();
    this._grid[2].forEach(val => $("#NList").append("<li id='" + val + "'>" + val + "</li>"));

    $("#GList").empty();
    this._grid[3].forEach(val => $("#GList").append("<li id='" + val + "'>" + val + "</li>"));

    $("#OList").empty();
    this._grid[4].forEach(val => $("#OList").append("<li id='" + val + "'>" + val + "</li>"));

    $(".red").removeClass("red");
    $(".green").removeClass("green");
    if (this._lastCalled != null) {
      $("#" + this._lastCalled.substr(1)).addClass("green");
    }
    $("#" + newValue).addClass("red");
  }
}

window.onload = function () {
  new Game();
}
