var GameView = require('./gameView')

document.addEventListener("DOMContentLoaded", function() {
  var gameCanvas = document.getElementById("platformer-canvas");
  gameCanvas.width = GameView.constants.DIM_X;
  gameCanvas.height = GameView.constants.DIM_Y;

  var context = gameCanvas.getContext("2d");
  new GameView(context);
});
