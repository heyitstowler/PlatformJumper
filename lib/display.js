var Display = function (game) {
  this.game = game;
  this.strokeColor = "#000000";
  this.fillColor = "#E0DDDC";
  this.heartImage = new Image();
  this.heartImage.src = './lib/heart_icon.png';
};

Display.prototype.draw = function (context) {
  this.drawScore(context);
  this.drawLives(context);
};

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
  context.strokeText("PAUSED", 175, 300);
  context.fillText("PAUSED", 175, 300);
};


module.exports = Display;
