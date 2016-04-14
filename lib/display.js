var Display = function (game, constants) {
  this.game = game;
  this.constants = constants;
  this.strokeColor = this.constants.STROKE_COLOR;
  this.fillColor = this.constants.FONT_FILL;
  this.heartImage = new Image();
  this.heartImage.src = './lib/heart_icon.png';
};

Display.prototype.draw = function (context) {
  this.drawScore(context);
  this.drawLives(context);
};

Display.prototype.clearDisplay = function (context, color) {
  color = color || "#fff";

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = color;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

Display.prototype.score = function () {
  return this.game.score();
};

Display.prototype.drawScore = function (context) {
  var text = "SCORE: " + this.score();
  context.fillStyle = this.fillColor;
  context.strokeStyle = this.strokeColor;
  context.font = "40px Helvetica";
  context.strokeText(text, 350, 40);
  context.fillText(text, 350, 40);
}

Display.prototype.drawLives = function (context) {
  for (var i = this.game.lives; i > 0; i--) {
    var xCoord = 375 + (i * 50);
    context.drawImage(this.heartImage, xCoord, 525);
  }
}

Display.prototype.pause = function (context) {
  context.fillStyle = this.fillColor;
  context.strokeStyle = this.strokeColor;
  context.font = "150px Helvetica";
  var text = "PAUSED";

  var x = this.centerText(context, text);

  context.strokeText(text, x, 300);
  context.fillText(text, x, 300);
};

Display.prototype.drawDead = function (context) {
  context.fillStyle = this.fillColor;
  context.strokeStyle = this.strokeColor;
  context.font = "150px Helvetica";
  var text = "You died!";

  var x = this.centerText(context, text);
  context.strokeText(text, x, 350);
  context.fillText(text, x, 350);
};

Display.prototype.gameOver = function (context) {
  this.clearDisplay(context, "#800A0A");

  context.fillStyle = this.fillColor;
  context.strokeStyle = this.strokeColor;
  context.font = "175px Helvetica";
  var text = "Game over!";

  var x = this.centerText(context, text);
  context.strokeText(text, x, 300);
  context.fillText(text, x, 300);

  context.font = "75px Helvetica";
  var text = "Your score: " + this.score();

  var x = this.centerText(context, text);
  context.strokeText(text, x, 450);
  context.fillText(text, x, 450);
};

Display.prototype.centerText = function(context, text) {
    var measurement = context.measureText(text);
    var x = (context.canvas.width - measurement.width) / 2;
    return x;
};

Display.prototype.youDied = function (context, timer, callback) {
  this.elapsedTime = 0;
  this.targetTime = timer;

  this.drawDead(context);
  var deathTimer = setInterval(function () {
    clearInterval(deathTimer);
    callback();
  }, timer);
};



module.exports = Display;
