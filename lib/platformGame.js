var Game = require('./game');
var GameView = require('./gameView')

document.addEventListener("DOMContentLoaded", function() {
  var gameCanvas = document.getElementById("platformer-canvas");
  gameCanvas.width = Game.DIM_X;
  gameCanvas.height = Game.DIM_Y;

  var context = gameCanvas.getContext("2d");
  var game = new Game();
  new GameView(game, context).start();

});
