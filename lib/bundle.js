/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1)
	
	document.addEventListener("DOMContentLoaded", function() {
	  var gameCanvas = document.getElementById("platformer-canvas");
	  gameCanvas.width = GameView.constants.DIM_X;
	  gameCanvas.height = GameView.constants.DIM_Y;
	
	  var context = gameCanvas.getContext("2d");
	  new GameView(context);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var Display = __webpack_require__(9);
	var TitleSequence = __webpack_require__(10);
	
	var GameView = function (context) {
	  this.context = context;
	  this.titleSequence = new TitleSequence(this);
	  // this.menu = new Menu(this.startGame.bind(this), GameView.constants);
	  // this.game = new Game();
	  // this.gameDisplay = new Display(this.game, GameView.constants);
	  // this.deaths = 0;
	  //
	  // this.state = {
	  //   paused: false
	  // };
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Jumper = __webpack_require__(4);
	var Platform = __webpack_require__(6);
	// var Obstacle = require('./obstacle');
	var Treasure = __webpack_require__(7);
	var Bubble = __webpack_require__(8);
	
	var VELOCITY = 5;
	var START_LIVES = 3;
	var TREASURE_VALUE = 5000;
	
	var Game = function () {
	  this.rawScore = 0;
	  this.lives = START_LIVES;
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.BG_COLOR = "#828282";
	
	Game.prototype.reset = function () {
	  this.alive = true;
	
	  this.platforms = [];
	  // this.obstacles = [];
	  this.treasures = [];
	  this.bubbles = [];
	  this.jumpers = [];
	
	  this.platformTimer = 0;
	  this.obstacleTimer = 0;
	  this.treasureTimer = 0;
	  this.difficultyTimer = 0;
	
	  this.difficulty = 1.0;
	
	  this.coinsCollected = this.coinsCollected || 0;
	
	  this.addPlatform(15, 500, 1200);
	};
	
	
	Game.prototype.add = function (object) {
	  if (object.type === "Platform") {
	    this.platforms.push(object);
	  } else if (object.type === "Obstacle") {
	    this.obstacles.push(object);
	  } else if (object.type === "Treasure") {
	    this.treasures.push(object);
	  } else if (object.type === "Jumper") {
	    this.jumpers.push(object);
	  } else if (object.type === "Bubble") {
	    this.bubbles.push(object);
	  } else {
	    throw "unknown object!";
	  }
	};
	
	Game.prototype.remove = function (object) {
	  if (object.type === "Platform") {
	    this.platforms.splice(this.platforms.indexOf(object), 1);
	  } else if (object.type === "Obstacle") {
	    this.obstacles.splice(this.obstacles.indexOf(object), 1);
	  } else if (object.type === "Treasure") {
	    this.treasures.splice(this.treasures.indexOf(object), 1);
	  } else if (object.type === "Bubble") {
	    this.bubbles.splice(this.bubbles.indexOf(object), 1);
	  } else if (object.type === "Jumper") {
	    this.jumpers.splice(this.jumpers.indexOf(object), 1);
	  } else {
	    throw "unknown object!";
	  }
	};
	
	Game.prototype.allObjects = function () {
	  // return [].concat(this.platforms, this.obstacles, this.treasures, this.bubbles, this.jumpers);
	  return [].concat(this.platforms, this.treasures, this.bubbles, this.jumpers);
	};
	
	Game.prototype.allColliders = function () {
	  // return [].concat(this.obstacles, this.treasures);
	  return this.treasures;
	};
	
	Game.prototype.draw = function (context) {
	  context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  this.allObjects().forEach(function (object) {
	    object.draw(context);
	  });
	};
	
	Game.prototype.step = function (timeDelta) {
	  this.addScore(timeDelta);
	  this.moveObjects(timeDelta);
	  this.checkCollisions();
	  this.checkIfDead();
	  this.checkTimers(timeDelta);
	};
	
	Game.prototype.moveObjects = function (timeDelta) {
	  this.allObjects().forEach(function (object) {
	    object.move(timeDelta);
	  });
	};
	
	Game.prototype.checkTimers = function (timeDelta) {
	  this.checkPlatformTimer(timeDelta);
	  // this.checkObstacleTimer(timeDelta);
	  this.checkTreasureTimer(timeDelta);
	  this.checkBubbleTimer(timeDelta);
	  this.checkDifficultyTimer(timeDelta);
	};
	
	Game.prototype.checkCollisions = function () {
	  var jumper = this.jumpers[0];
	  this.allColliders().forEach( function (object){
	    object.checkCollision(jumper);
	  });
	};
	
	Game.prototype.checkDifficultyTimer = function (timeDelta) {
	  this.difficultyTimer += timeDelta;
	
	  if (this.difficultyTimer > 10000) {
	    this.increaseDifficulty();
	    this.difficultyTimer = 0;
	  }
	};
	
	Game.prototype.increaseDifficulty = function () {
	  this.difficulty += 0.1;
	};
	
	// ------------------------ Jumpers -------------------------------------
	
	Game.prototype.checkIfDead = function () {
	  var jumper = this.jumpers[0];
	
	  if (jumper.yPos > 650) {
	    jumper.remove();
	    this.handleDeath();
	  }
	};
	
	Game.prototype.handleDeath = function () {
	  this.lives -= 1;
	  this.alive = false;
	};
	
	Game.prototype.addBonusLife = function () {
	  this.lives += 1;
	};
	
	Game.prototype.addJumper = function () {
	  var jumper = new Jumper(this);
	
	  this.add(jumper);
	
	  return jumper;
	};
	
	// ------------------------ Platforms -----------------------------------
	
	Game.prototype.checkPlatformTimer = function (timeDelta) {
	  this.platformTimer += timeDelta;
	
	  if (this.platformTimer > 1500) {
	    this.addRandomPlatform();
	    this.platformTimer = 0;
	  }
	};
	Game.prototype.addRandomPlatform = function () {
	  var y = Util.getRandomInt(150, 500);
	  var length = 100 + (40 * Util.getRandomInt(1, 11));
	  this.addPlatform(1000, y, length);
	};
	
	Game.prototype.addPlatform = function (xPos, yPos, length) {
	  var platform = new Platform(this, xPos, yPos, length, (VELOCITY * this.difficulty));
	  this.add(platform);
	};
	
	// ------------------------ Obstacles -----------------------------------
	
	// Skeleton code for obstacles is here for a future implementation
	
	// Game.prototype.checkObstacleTimer = function (timeDelta) {
	//   this.obstacleTimer += timeDelta;
	//
	//   if (this.obstacleTimer > 11000) {
	//     this.addRandomObstacle();
	//     this.obstacleTimer = 0;
	//   }
	// };
	//
	// Game.prototype.addRandomObstacle = function () {
	// };
	//
	// Game.prototype.addObstacle = function (xPos, yPos) {
	//
	// };
	
	// ------------------------ Treasures -----------------------------------
	
	Game.prototype.checkTreasureTimer = function (timeDelta) {
	  this.treasureTimer += timeDelta;
	
	  if (this.treasureTimer > 7000) {
	    this.addRandomTreasure();
	    this.treasureTimer = 0;
	  }
	};
	
	Game.prototype.addRandomTreasure = function () {
	  var y = Util.getRandomInt(150, 400);
	  this.addTreasure(y);
	};
	
	Game.prototype.addTreasure = function (yPos) {
	  var treasure = new Treasure(this, yPos, VELOCITY);
	  this.add(treasure);
	};
	
	Game.prototype.collectTreasure = function (treasure) {
	  this.remove(treasure);
	  this.coinsCollected += 1;
	  this.scoreTreasure();
	  if (this.coinsCollected === 10) {
	    this.coinsCollected = 0;
	    this.addBonusLife();
	    this.addBonusLifeBubble(treasure.yPos, treasure.xPos);
	  } else {
	    this.addBubble(treasure.yPos, treasure.xPos);
	  }
	};
	
	// ------------------------ Bubbles -----------------------------------
	
	Game.prototype.checkBubbleTimer = function (timeDelta) {
	  this.bubbles.forEach(function (bubble){
	    bubble.timer += timeDelta;
	  });
	};
	
	Game.prototype.addBubble = function (yPos, xPos) {
	  var bubble = new Bubble(this, yPos, xPos, VELOCITY);
	  this.add(bubble);
	};
	
	Game.prototype.addBonusLifeBubble = function (yPos, xPos) {
	  var bubble = new Bubble(this, yPos, xPos, VELOCITY, true);
	  this.add(bubble);
	};
	
	
	// ------------------------ Score ---------------------------------------
	
	Game.prototype.addScore = function (timeDelta) {
	  this.rawScore += Math.ceil(timeDelta);
	};
	
	Game.prototype.score = function () {
	  return Math.floor(this.rawScore / 100);
	};
	
	Game.prototype.scoreTreasure = function () {
	  this.rawScore += TREASURE_VALUE;
	};
	
	
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass };
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	
	  getRandomInt: function(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var GameObject = __webpack_require__(5);
	
	var JUMP = 12;
	var FALL = 0.4;
	var FUDGE = 35;
	
	var Jumper = function (game) {
	  this.state = { grounded: true, doubleJumped: false };
	  var options = {
	    game: game,
	    height: -50,
	    width: 30,
	    color: "#AD3D18",
	
	    xPos: 40,
	    yPos: 499,
	
	    yAcc: FALL
	  };
	
	  GameObject.call(this, options);
	  this.imageCounter = 0;
	  this.images = [];
	  this.loadImages();
	};
	
	Util.inherits(Jumper, GameObject);
	
	Jumper.prototype.type = "Jumper";
	
	Jumper.prototype.loadImages = function () {
	  var jumper = this;
	  for (var i = 0; i < 12; i++){
	    var image = new Image();
	    image.src = ('./lib/sprites/jumper/jumper_sprite_run' + i + '.png');
	    jumper.images.push(image);
	  }
	  var airborne = new Image();
	  airborne.src = ('./lib/sprites/jumper/jumper_sprite_airborne.png');
	  jumper.images.push(airborne);
	};
	
	Jumper.prototype.draw = function (context) {
	  var image;
	  var offsetY = 0;
	  if (!this.state.grounded) {
	    image = this.images[12];
	    this.imageCounter = 48;
	  } else {
	    var idx = Math.floor(this.imageCounter / 5);
	
	    image = this.images[idx];
	
	    switch (idx) {
	      case 0:
	      case 1:
	      case 2:
	      case 6:
	      case 7:
	      case 8:
	        offsetY = -6;
	        break;
	      case 3:
	      case 5:
	      case 9:
	      case 11:
	        offsetY = -3
	        break;
	      default:
	        offsetY = 0;
	    }
	
	    this.imageCounter += 1;
	    if (this.imageCounter > 59) {
	      this.imageCounter = 0;
	    }
	  }
	  context.drawImage(image, this.xPos, Math.floor(this.yPos) +
	                    this.height + offsetY);
	};
	
	Jumper.prototype.jump = function () {
	  if (this.state.grounded) {
	    this.yVel = 0 - JUMP;
	    this.state.grounded = false;
	  } else if (!this.state.doubleJumped) {
	    this.yVel = 1 - JUMP;
	    this.state.doubleJumped = true;
	  } else {
	    this.struggle();
	  }
	};
	
	Jumper.prototype.struggle = function () {
	  if (this.yVel > 4) {
	    this.yVel -= 3;
	  }
	};
	
	Jumper.prototype.land = function () {
	  this.yVel = 0;
	  this.state.grounded = true;
	  this.state.doubleJumped = false;
	};
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	Jumper.prototype.move = function (timeDelta) {
	  var timeScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
	  var offsetY = this.yVel * timeScale;
	  var yAcc = this.yAcc;
	  var yVel = this.yVel;
	
	  // 1 Compute final location for free-fall case
	  var newPos = this.yPos + offsetY;
	
	  // 2 Check if on a platform
	  if (this.isGrounded()) {
	
	  } else {
	    this.state.grounded = false;
	
	    // 3 Compute new velocity
	    this.yVel = yVel + (yAcc * timeScale);
	
	    // 3 Check if landing
	    if (!this.state.grounded) {
	      if (this.isLanding(newPos)) {
	        newPos = this.landingPosition(newPos);
	        this.land();
	      }
	    }
	  }
	
	  // 4 Move jumper
	  this.yPos = newPos;
	};
	
	// -------------------Platform Checks------------------------------
	
	Jumper.prototype.isGrounded = function () {
	  var grounded = false;
	  var jumper = this;
	  this.game.platforms.forEach(function (platform) {
	    if (jumper.xPos > (platform.xPos - FUDGE) && jumper.xPos < (platform.xPos + platform.width)) {
	      if (jumper.yPos === platform.yPos - 1) {
	        grounded = true;
	      }
	    }
	  });
	  return grounded;
	};
	
	Jumper.prototype.isLanding = function (newPos) {
	  var oldPos = this.yPos;
	  var xPos = this.xPos;
	  var landing = false;
	  this.game.platforms.forEach(function (platform) {
	    if (xPos > (platform.xPos - FUDGE) && xPos < (platform.xPos + platform.width)) {
	      if (oldPos - 2 < platform.yPos && newPos > platform.yPos) {
	        landing = true;
	      }
	    }
	  });
	
	  return landing;
	};
	
	Jumper.prototype.landingPosition = function (newPos) {
	  var oldPos = this.yPos;
	  var xPos = this.xPos;
	  var landingPos;
	  this.game.platforms.forEach(function (platform) {
	    if (xPos > (platform.xPos - FUDGE) && xPos < (platform.xPos + platform.width)) {
	      if (oldPos - 2 < platform.yPos && newPos > platform.yPos) {
	        landingPos = platform.yPos - 1;
	      }
	    }
	  });
	
	  return landingPos;
	};
	
	
	module.exports = Jumper;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var GameObject = function (options) {
	  this.game = options.game;
	
	  this.height = options.height;
	  this.width = options.width;
	
	  this.xPos = options.xPos || 0;
	  this.yPos = options.yPos || 0;
	
	  this.xVel = options.xVel || 0;
	  this.yVel = options.yVel || 0;
	
	  this.xAcc = options.xAcc || 0;
	  this.yAcc = options.yAcc || 0;
	
	  this.color = options.color || "#1888AD";
	  this.borderColor = options.borderColor || "#000000";
	};
	
	GameObject.prototype.corners = function () {
	  var corners = {
	    botLeft: [this.xPos, this.yPos],
	    topRight: [this.xPos + this.width, this.yPos - this.height]
	  };
	
	  return corners;
	};
	
	GameObject.prototype.draw = function (context) {
	  context.fillStyle = this.color;
	  context.strokeStyle = this.borderColor;
	
	  context.fillRect(this.xPos, this.yPos, this.width, this.height);
	  context.strokeRect(this.xPos, this.yPos, this.width, this.height);
	};
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	GameObject.prototype.move = function (timeDelta) {
	  var timeScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
	  var offsetX = this.xVel * timeScale;
	  var offsetY = this.yVel * timeScale;
	
	  this.xVel = this.xVel + (this.xAcc * timeScale);
	  this.yVel = this.yVel + (this.yAcc * timeScale);
	
	  this.xPos = this.xPos + offsetX;
	  this.yPos = this.yPos + offsetY;
	
	
	  if ((this.xPos + this.width) < 0) {
	    this.remove();
	  }
	
	};
	
	GameObject.prototype.checkCollision = function (target) {
	
	  var thisCorners = this.corners();
	  var left = thisCorners.botLeft;
	  var right = thisCorners.topRight;
	
	  var targetCorners = target.corners();
	  var tLeft = targetCorners.botLeft;
	  var tRight = targetCorners.topRight;
	
	  var collided = true;
	
	  if (left[0] > tRight[0] || tLeft[0] > right[0]){
	    collided = false;
	  }
	  if (left[1] > tRight[1] || tLeft[1] > right[1]) {
	    collided = false;
	  }
	
	  // if (collided) {
	  //   this.collision(target);
	  // }
	
	  return collided;
	};
	
	GameObject.prototype.collision = function (target) {};
	
	GameObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	
	module.exports = GameObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var GameObject = __webpack_require__(5);
	
	
	
	var Platform = function (game, xPos, yPos, length, velocity) {
	  var options = { height: 15 };
	  options.game = game;
	  options.xPos = xPos;
	  options.yPos = yPos;
	  options.width = length;
	  options.xVel = 0 - velocity;
	
	  GameObject.call(this, options)
	
	};
	
	Util.inherits(Platform, GameObject);
	
	Platform.prototype.type = "Platform";
	
	Platform.imageLeft = new Image();
	Platform.imageLeft.src = './lib/sprites/platform/platform_left.png';
	
	Platform.imageRight = new Image();
	Platform.imageRight.src = './lib/sprites/platform/platform_right.png';
	
	Platform.imageMid = new Image();
	Platform.imageMid.src = './lib/sprites/platform/platform_middle.png';
	
	Platform.prototype.draw = function (context) {
	  var yVal = this.yPos - this.height + 12;
	  var xVal = this.xPos + 30;
	  var units = ((this.width - 60) / 40);
	
	  context.drawImage(Platform.imageLeft, Math.floor(this.xPos), yVal);
	
	  for (var i = 0; i < units; i++) {
	    context.drawImage(Platform.imageMid, (Math.floor(xVal) + (40 * i)), yVal);
	  }
	
	  context.drawImage(Platform.imageRight, (Math.floor(this.xPos) + this.width - 30), yVal);
	};
	
	module.exports = Platform;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var GameObject = __webpack_require__(5);
	
	var Treasure = function (game, yPos, velocity) {
	  var options = {
	    height: -70,
	    width: 70,
	    xPos: 1000,
	  };
	  options.game = game;
	  options.yPos = yPos;
	  options.xVel = 0 - (velocity * .8);
	
	  this.imageCounter = 0;
	  this.images = [];
	  this.loadImages();
	
	  GameObject.call(this, options)
	};
	
	
	Util.inherits(Treasure, GameObject);
	
	Treasure.prototype.type = "Treasure";
	
	Treasure.prototype.loadImages = function () {
	  var treasure = this;
	  for (var i = 1; i < 7; i++){
	    var image = new Image();
	    image.src = ('./lib/sprites/treasure/treasure_icon' + i + '.png');
	    treasure.images.push(image);
	  }
	};
	
	Treasure.prototype.draw = function (context) {
	  var imageNumber = Math.floor(this.imageCounter / 15);
	  context.drawImage(this.images[imageNumber], Math.floor(this.xPos), this.yPos + this.height);
	  this.imageCounter += 1;
	  if (this.imageCounter > 89) {
	    this.imageCounter = 0;
	  }
	};
	
	Treasure.prototype.checkCollision = function (target) {
	  if(GameObject.prototype.checkCollision.call(this, target)){
	    this.collision(target);
	  }
	};
	
	Treasure.prototype.collision = function (jumper) {
	  this.game.collectTreasure(this);
	}
	module.exports = Treasure;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var GameObject = __webpack_require__(5);
	
	var Bubble = function (game, yPos, xPos, velocity, bonus) {
	  var options = {
	    height: -40,
	    width: 40,
	    xPos: xPos,
	    timer: 0,
	    disappearTime: 2250
	  };
	  options.game = game;
	  options.yPos = yPos;
	  options.xVel = 0 - (velocity * .3);
	
	
	  GameObject.call(this, options)
	
	  this.image = new Image();
	
	  if (bonus) {
	    this.image.src = './lib/sprites/bubble/bonus_bubble_sprite.png';
	  } else {
	    this.image.src = './lib/sprites/bubble/bubble_sprite.png';
	  }
	};
	
	
	Util.inherits(Bubble, GameObject);
	
	Bubble.prototype.type = "Bubble";
	
	
	Bubble.prototype.draw = function (context) {
	  context.drawImage(this.image, this.xPos, this.yPos + this.height);
	};
	
	Bubble.prototype.updateTimer = function (timeDelta) {
	  this.timer += timeDelta;
	  if (this.timer > this.disappearTime) {
	    this.remove();
	  }
	};
	module.exports = Bubble;


/***/ },
/* 9 */
/***/ function(module, exports) {

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


/***/ },
/* 10 */
/***/ function(module, exports) {

	var TitleSequence = function (gameView){
	  this.gameView = gameView;
	
	  this.titleScreen = new Image();
	  this.titleScreen.src = './lib/splashes/title.png';
	
	  this.aboutScreens = [];
	
	  var title = this;
	  for (var i = 1; i < 14; i++){
	    var image = new Image();
	    image.src = ('./lib/splashes/about_' + i + '.png');
	    this.aboutScreens.push(image);
	  }
	
	  this.blankHeader = new Image();
	  this.blankHeader.src = './lib/splashes/blank_header.png';
	  this.spriteStanding = new Image();
	  this.spriteStanding.src = 'lib/splashes/sprite_standing.png';
	
	  this.runAnimation = new Image();
	  this.runAnimation.src = 'lib/sprites/jumper/jumper_run.gif';
	
	  this.howToPlay = new Image();
	  this.howToPlay.src = './lib/splashes/how_to_play.png';
	};
	
	TitleSequence.prototype.drawTitleScreen = function (context) {
	  context.clearRect(0, 0, 1000, 600);
	  this.fadeInImage(context, this.titleScreen, false);
	};
	
	TitleSequence.prototype.drawHowToPlay = function (context) {
	  this.fadeInImage(context, this.howToPlay, false, this.titleScreen);
	};
	
	TitleSequence.prototype.startAbout = function (context) {
	  this.fadeTitle(context);
	  var TitleSequence = this;
	
	  var i = 0;
	  var delay = 5000;
	
	  var nextFrame = setInterval(function() {
	    if (i === 0) {
	      TitleSequence.fadeInImage(context, TitleSequence.aboutScreens[0], true)
	      i += 1;
	    } else if (i < 13) {
	      TitleSequence.fadeInImage(context, TitleSequence.aboutScreens[i],
	        true, TitleSequence.aboutScreens[i - 1]);
	      i += 1;
	    } else {
	      clearInterval(nextFrame);
	      TitleSequence.fadeLastImage(context);
	    }
	  }, delay);
	
	  key('b', function(){ clearInterval(nextFrame); });
	};
	
	TitleSequence.prototype.fadeInImage = function (context, image,
	  background, previousImage, animation) {
	  var blank = this.blankHeader;
	  var fade = 0;
	  var title = this;
	
	
	  var animateFade = function () {
	    if (fade > 100) {
	      if (previousImage) {
	        title.fadeInImage(context, image, background);
	      } else {
	        return;
	      }
	    } else {
	      if (previousImage) {
	        context.clearRect(0, 0, 699, 600);
	        if (background) {
	          title.drawFade(context, blank, 100);
	        } else {
	          context.clearRect(0, 0, 1000, 600);
	        }
	        title.drawFade(context, previousImage, (100 - fade));
	        fade += 2;
	      } else {
	        if (animation) {
	          // context.drawImage(animation, 700, 0);
	        }
	        if (background) {
	          title.drawFade(context, blank, 100);
	        } else {
	          context.clearRect(0, 0, 1000, 600);
	        }
	        title.drawFade(context, image, fade);
	        fade += 3;
	      }
	      requestAnimationFrame(animateFade);
	    }
	  };
	
	  animateFade();
	};
	
	TitleSequence.prototype.drawFade = function (context, image, fade) {
	  context.save();
	  context.globalAlpha = (fade / 100);
	  context.drawImage(image, 0, 0);
	  context.restore();
	};
	
	TitleSequence.prototype.fadeLastImage = function (context) {
	  var blank = this.aboutScreens[11];
	  var image = this.aboutScreens[12];
	  var fade = 0;
	  var title = this;
	
	
	  var animateFadeOut = function () {
	    if (fade > 100) {
	      title.gameView.loadTitleSequence()
	    } else {
	      // context.clearRect(0, 0, 1000, 600);
	      title.drawFade(context, image, 100);
	      title.drawFade(context, blank, fade);
	      fade += 1;
	
	      requestAnimationFrame(animateFadeOut);
	    }
	  };
	
	  animateFadeOut();
	};
	
	TitleSequence.prototype.fadeHowToPlay = function (context) {
	  var image = this.howToPlay;
	  var fade = 0;
	  var title = this;
	
	
	  var animateFadeOut = function () {
	    if (fade > 100) {
	      title.gameView.loadTitleSequence()
	    } else {
	      context.clearRect(0, 0, 1000, 600);
	      title.drawFade(context, image, (100 - fade));
	      fade += 1;
	
	      requestAnimationFrame(animateFadeOut);
	    }
	  };
	
	  animateFadeOut();
	};
	
	TitleSequence.prototype.fadeTitle = function (context) {
	  var image = this.titleScreen;
	  var fade = 0;
	  var title = this;
	
	
	  var animateFadeOut = function () {
	    if (fade > 100) {
	      return;
	    } else {
	      context.clearRect(0, 0, 1000, 600);
	      title.drawFade(context, image, (100 - fade));
	      fade += 1;
	
	      requestAnimationFrame(animateFadeOut);
	    }
	  };
	
	  animateFadeOut();
	};
	
	
	module.exports = TitleSequence;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map