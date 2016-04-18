var Display = function (game, constants) {
  this.game = game;
  this.constants = constants;
  this.strokeColor = this.constants.STROKE_COLOR;
  this.fillColor = this.constants.FONT_FILL;

  this.heartImage = new Image();
  this.heartImage.src = './lib/sprites/display_icons/heart_icon.png';
  this.coinImage = new Image();
  this.coinImage.src = './lib/sprites/display_icons/coin_icon.png';

  this.pauseOverlay = new Image();
  this.pauseOverlay.src = './lib/splashes/pause.png';

  this.deathOverlay = new Image();
  this.deathOverlay.src = './lib/splashes/you_died.png';

  this.deathMessages = [
    new Image(),
    new Image(),
    new Image()
  ];

  this.deathMessages.forEach(function (image, index) {
    image.src = ('lib/splashes/death_message_' + (index + 1) + '.png');
  });

  this.gameOverlay = new Image();
  this.gameOverlay.src = './lib/splashes/game_over.png';
};

Display.prototype.draw = function (context) {
  this.drawScore(context);
  this.drawLives(context);
  this.drawCoins(context);
};

Display.prototype.clearDisplay = function (context, color) {
  // color = color || "#fff";

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  // context.fillStyle = color;
  // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

Display.prototype.score = function () {
  return this.game.score();
};

Display.prototype.drawScore = function (context) {
  var text = this.score();
  context.fillStyle = this.strokeColor;
  // context.strokeStyle = this.strokeColor;
  context.font = "40px Emo";
  // context.strokeText(text, 350, 40);

  var x = this.centerText(context, "SCORE") - 20;
  context.fillText("SCORE", x, 40);
  context.font = "60px Emo"

  x = this.centerText(context, text) - 30;
  context.fillText(text, x, 100);
}

Display.prototype.drawLives = function (context) {
  for (var i = this.game.lives; i > 0; i--) {
    var xCoord = 360 + (i * 50);
    context.drawImage(this.heartImage, xCoord, 525);
  }
}

Display.prototype.drawCoins = function (context) {
  for (var i = this.game.coinsCollected; i > 0; i--) {
    var xCoord = 5 + (i * 30);
    context.drawImage(this.coinImage, xCoord, 535);
  }
}

Display.prototype.pause = function (context) {
  context.drawImage(this.pauseOverlay, 0, 0);
};

Display.prototype.drawDead = function (context, deaths) {
  context.drawImage(this.deathOverlay, 0, 0);
  if (deaths > 2) {
    deaths = 2;
  }
  context.drawImage(this.deathMessages[deaths], 0, 0);
};

Display.prototype.gameOver = function (context) {
  context.drawImage(this.gameOverlay, 0, 0);
  context.fillStyle = this.strokeColor;

  context.font = "75px Emo";
  var text = "score: " + this.score();

  var x = this.centerText(context, text);
  context.fillText(text, x, 450);
};

Display.prototype.centerText = function(context, text) {
    var measurement = context.measureText(text);
    var x = (context.canvas.width - measurement.width) / 2;
    return x;
};

Display.prototype.youDied = function (context, timer, callback, deaths) {
  this.elapsedTime = 0;
  this.targetTime = timer;

  this.drawDead(context, deaths);
  var deathTimer = setInterval(function () {
    clearInterval(deathTimer);
    callback();
  }, timer);
};



module.exports = Display;
