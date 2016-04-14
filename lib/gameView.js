var Game = require('./game');
var Display = require('./display');
var Menu = require('./menu');

var GameView = function (context) {
  this.context = context;
  this.menu = new Menu(this.startGame.bind(this), GameView.constants);
  this.game = new Game();
  this.gameDisplay = new Display(this.game, GameView.constants);

  this.state = {
    paused: false
  };
};

GameView.constants = {
  DIM_X: 1000,
  DIM_Y: 600,
  BG_COLOR: "#828282",
  FONT_FILL: "#E0DDDC",
  STROKE_COLOR: "#000000",
  DEATH_TIME: 3000
};

// GameView.DIM_X = 1000;
// GameView.DIM_Y = 600;

GameView.prototype.bindKeyHandlers = function () {
  // game functions
  key.unbind('p');
  key.unbind('space');
  key.unbind('enter');

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

GameView.prototype.startGame = function () {
  console.log("starting game!");
  this.game.reset();
  this.jumper = this.game.addJumper();

  this.bindKeyHandlers();
  this.lastTime = window.performance.now();

  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.togglePause = function () {
  console.log("pause method!");
  if (this.state.paused) {
    this.state.paused = false;
    // this.lastTime = window.performance.now();
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
    if (this.game.alive) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.handleDeath();
    }
  } else {
    this.gameDisplay.pause(this.context);
  }
};

GameView.prototype.handleDeath = function () {
  this.gameDisplay.youDied(this.context, GameView.constants.DEATH_TIME, this.continue.bind(this));
};

GameView.prototype.continue = function () {
  if (this.game.lives > 0) {
    this.startGame();
  }
  else {
    this.gameDisplay.gameOver(this.context);
  }
};

// ---------------------------- Menu -------------------------------
GameView.prototype.bindMenuKeyHandlers = function () {
  // // game functions
  // var gameView = this;
  // key("p", function () { gameView.togglePause(); return false });
  //
  // var jumper = this.jumper;
  // key("space", function () {
  //                 if (!gameView.state.paused) {
  //                   jumper.jump();
  //                 }
  //                 return false });
  // key("enter", function () { jumper.land(); return false });
};

GameView.prototype.loadMenu = function () {
  this.bindMenuKeyHandlers();
  this.lastTime = 0;

  requestAnimationFrame(this.animateMenu.bind(this));
};

GameView.prototype.animateMenu = function(time){
  var timeDelta = time - this.lastTime;

  this.menu.step(timeDelta);
  this.menu.draw(this.context);
  this.lastTime = time;

  requestAnimationFrame(this.animateMenu.bind(this));
};



module.exports = GameView;
