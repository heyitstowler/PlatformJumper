var Display = require('./display');

var GameView = function (game, context) {
  this.context = context;
  this.game = game;
  this.gameDisplay = new Display(game);

  this.state = {
    paused: false
  };

  this.jumper = this.game.addJumper();
  console.log(this.jumper.state.grounded);
};

GameView.prototype.bindKeyHandlers = function () {
  // game functions
  var gameView = this;
  key("p", function () { gameView.togglePause(); return false });

  var jumper = this.jumper;
  key("space", function () {
                  if (!gameView.state.paused) {
                    jumper.jump();
                  }
                  return false });
  key("enter", function () { jumper.land(); return false });
};

GameView.prototype.start = function () {
  this.bindKeyHandlers();
  this.lastTime = 0;

  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.togglePause = function () {
  console.log("pause method!");
  if (this.state.paused) {
    this.state.paused = false;
    this.lastTime = window.performance.now();
    requestAnimationFrame(this.animate.bind(this));
  } else {
    this.state.paused = true;
  }
};

GameView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.context);
  this.gameDisplay.draw(this.context);
  this.lastTime = time;

  if (!this.state.paused) {
    requestAnimationFrame(this.animate.bind(this));
  } else {
    this.gameDisplay.pause(this.context);
  }
};

module.exports = GameView;
