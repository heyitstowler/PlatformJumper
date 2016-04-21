var Game = require('./game');
var Display = require('./display');
var TitleSequence = require('./titleSequence');

var GameView = function (context) {
  this.context = context;
  this.titleSequence = new TitleSequence(this);
  
  this.boundStatus = "default";

  this.loadTitleSequence();
};

GameView.constants = {
  DIM_X: 1000,
  DIM_Y: 600,
  BG_COLOR: "#828282",
  FONT_FILL: "#E0DDDC",
  STROKE_COLOR: "#000000",
  DEATH_TIME: 3000
};


GameView.prototype.newGame = function (){
  key.unbind('enter');

  this.game = new Game();
  this.gameDisplay = new Display(this.game, GameView.constants);
  this.deaths = 0;

  this.state = {
    paused: false
  };

  this.startGame();
};


GameView.prototype.unbindKeys = function () {
  if (this.boundStatus !== "unbound") {
    key.unbind('p');
    key.unbind('h');
    key.unbind('a');
    key.unbind('b');
    key.unbind('space');
    key.unbind('enter');
    this.boundStatus = "unbound";
  }
};

GameView.prototype.bindKeyHandlers = function () {
  // game functions
  this.unbindKeys();

  var gameView = this;
  key("p", function () { gameView.togglePause(); return false });

  var jumper = this.jumper;
  if (this.boundStatus !== "gameBindings") {
    key("space", function () {
                    if (!gameView.state.paused) {
                      jumper.jump();
                    }
                    return false });
    // Sweet Dev-mode hack for infinite jumps!
    key("enter", function () { jumper.land(); return false });
    this.boundStatus = "gameBindings";
  }
};

GameView.prototype.startGame = function () {
  this.game.reset();
  this.jumper = this.game.addJumper();

  this.bindKeyHandlers();
  this.lastTime = window.performance.now();

  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.togglePause = function () {
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
  if (this.game.lives > 0) {
    this.gameDisplay.youDied(this.context, GameView.constants.DEATH_TIME,
      this.continue.bind(this), this.deaths);
    this.deaths += 1;
  } else {
    this.gameOver();
  }
};

GameView.prototype.continue = function () {
  if (this.game.lives > 0) {
    this.startGame();
  }
  else {
    this.gameOver();
  }
};

GameView.prototype.gameOver = function () {
  this.unbindKeys();
  this.gameDisplay.gameOver(this.context);
  var gameView = this;
  var backToTitleInterval = setInterval( function () {
    clearInterval(backToTitleInterval);
    gameView.loadTitleSequence();
  }, 4000);
};




// ---------------------------- Title -------------------------------

GameView.prototype.loadTitleSequence = function() {
  var title = this.titleSequence;
  var context = this.context;
  var gameView = this;

  var backBindings = function() {
  if (gameView.boundStatus !== "backBindings") {
      key.unbind("enter");
      key.unbind("a");
      key.unbind("h");
      key.unbind("b");
      key('b', function () { gameView.loadTitleSequence()});
      gameView.boundStatus = "backBindings";
      return false
    }
  };

  title.drawTitleScreen(context);

  var titleScreenInterval = setInterval(function() {
    clearInterval(titleScreenInterval);
    backBindings();
    title.startAbout(context);
  }, 4000);

  if (this.boundStatus !== "titleBindings") {
    key('enter', function(){
      if (titleScreenInterval) {
        clearInterval(titleScreenInterval);
      }
      gameView.newGame();
      return false
    });

    key('a', function(){
      if (titleScreenInterval) {
        clearInterval(titleScreenInterval);
      }
      backBindings();
      title.startAbout(context);
      return false
    });

    key('h', function(){
      if (titleScreenInterval) {
        clearInterval(titleScreenInterval);
      }
      backBindings();
      title.drawHowToPlay(context);
      return false
    });
    gameView.boundStatus = "titleBindings";
  }
};

module.exports = GameView;
