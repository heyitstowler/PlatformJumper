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

	var GameView = __webpack_require__(2)
	
	document.addEventListener("DOMContentLoaded", function() {
	  var gameCanvas = document.getElementById("platformer-canvas");
	  gameCanvas.width = GameView.constants.DIM_X;
	  gameCanvas.height = GameView.constants.DIM_Y;
	
	  var context = gameCanvas.getContext("2d");
	  new GameView(context).startGame();
	  // new GameView(context).loadMenu();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var Jumper = __webpack_require__(3);
	var Platform = __webpack_require__(4);
	// var Obstacle = require('./obstacle');
	var Treasure = __webpack_require__(8);
	var Bubble = __webpack_require__(10);
	
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
	  this.obstacles = [];
	  this.treasures = [];
	  this.bubbles = [];
	  this.jumpers = [];
	
	  this.platformTimer = 0;
	  this.obstacleTimer = 0;
	  this.treasureTimer = 0;
	
	  this.addPlatform(15, 500, 1000);
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
	    throw "wtf?";
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
	    throw "wtf?";
	  }
	};
	
	Game.prototype.allObjects = function () {
	  return [].concat(this.platforms, this.obstacles, this.treasures, this.bubbles, this.jumpers);
	};
	
	Game.prototype.allColliders = function () {
	  return [].concat(this.obstacles, this.treasures);
	};
	
	Game.prototype.draw = function (context) {
	  context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  // context.fillStyle = Game.BG_COLOR;
	  // context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
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
	  this.checkObstacleTimer(timeDelta);
	  this.checkTreasureTimer(timeDelta);
	  this.checkBubbleTimer(timeDelta);
	};
	
	Game.prototype.checkCollisions = function () {
	  var jumper = this.jumpers[0];
	  this.allColliders().forEach( function (object){
	    object.checkCollision(jumper);
	  });
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
	  console.log("YOU DIED");
	  this.lives -= 1;
	  this.alive = false;
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
	  var platform = new Platform(this, xPos, yPos, length, VELOCITY);
	  this.add(platform);
	};
	
	// ------------------------ Obstacles -----------------------------------
	
	Game.prototype.checkObstacleTimer = function (timeDelta) {
	  this.obstacleTimer += timeDelta;
	
	  if (this.obstacleTimer > 11000) {
	    this.addRandomObstacle();
	    this.obstacleTimer = 0;
	  }
	};
	
	Game.prototype.addRandomObstacle = function () {
	  console.log("Add random obstacle!");
	};
	
	Game.prototype.addObstacle = function (xPos, yPos) {
	
	};
	
	// ------------------------ Treasures -----------------------------------
	
	Game.prototype.checkTreasureTimer = function (timeDelta) {
	  this.treasureTimer += timeDelta;
	
	  if (this.treasureTimer > 7000) {
	    this.addRandomTreasure();
	    this.treasureTimer = 0;
	  }
	};
	
	Game.prototype.addRandomTreasure = function () {
	  console.log("Add random treasure!");
	  var y = Util.getRandomInt(150, 400);
	  this.addTreasure(y);
	};
	
	Game.prototype.addTreasure = function (yPos) {
	  var treasure = new Treasure(this, yPos, VELOCITY);
	  this.add(treasure);
	};
	
	Game.prototype.collectTreasure = function (treasure) {
	  this.remove(treasure);
	  this.scoreTreasure();
	  this.addBubble(treasure.yPos, treasure.xPos);
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var Display = __webpack_require__(7);
	var Menu = __webpack_require__(9);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var GameObject = __webpack_require__(5);
	
	var JUMP = 12;
	var FALL = 0.4;
	var FUDGE = 35;
	
	var Jumper = function (game) {
	  this.state = { grounded: true, doubleJumped: false, jumpAllowed: true };
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
	  // this.image = new Image();
	  // this.image.src = './lib/sprites/jumper/jumper_sprite.png';
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
	  context.drawImage(image, this.xPos, Math.floor(this.yPos) + this.height + offsetY);
	};
	
	Jumper.prototype.jump = function () {
	  if (this.state.grounded) {
	    this.yVel = 0 - JUMP;
	    this.state.grounded = false;
	    // console.log("jump!");
	  } else if (!this.state.doubleJumped) {
	    this.yVel = 1 - JUMP;
	    this.state.doubleJumped = true;
	    // console.log("double jump!");
	  } else {
	    this.struggle();
	  }
	};
	
	Jumper.prototype.struggle = function () {
	  if (this.yVel > 4) {
	    this.yVel -= 3;
	  }
	  // console.log("THE STRUGGLE");
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
	      if (oldPos < platform.yPos && newPos > platform.yPos) {
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
	      if (oldPos < platform.yPos && newPos > platform.yPos) {
	        landingPos = platform.yPos - 1;
	      }
	    }
	  });
	
	  return landingPos;
	};
	
	
	module.exports = Jumper;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var GameObject = __webpack_require__(5);
	
	
	
	var Platform = function (game, xPos, yPos, length, velocity) {
	  var options = { height: 15 };
	  options.game = game;
	  options.xPos = xPos;
	  options.yPos = yPos;
	  options.width = length;
	  options.xVel = 0 - velocity;
	
	  GameObject.call(this, options)
	
	  // this.imageLeft = new Image();
	  // this.imageLeft.src = './lib/sprites/platform/platform_left.png';
	  //
	  // this.imageRight = new Image();
	  // this.imageRight.src = './lib/sprites/platform/platform_right.png';
	  //
	  // this.imageMid = new Image();
	  // this.imageMid.src = './lib/sprites/platform/platform_middle.png';
	
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
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
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
	  console.log("Collided treasure!");
	  this.game.collectTreasure(this);
	}
	module.exports = Treasure;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var Menu = function (startFunc, constants) {
	  this.constants = constants;
	  this.buttons = [];
	  this.items = [
	                {
	                  text: "New Game",
	                  func: startFunc
	                },
	                {
	                  text: "How to Play",
	                  func: function () { console.log("How to Play"); }
	                }
	              ];
	
	  this.createButtons();
	};
	
	Menu.prototype.createButtons = function () {
	  this.buttons = this.items.map(function (item) {
	    var button = new Button(item);
	    // button.addEventListener("click", button.funct);
	    return button;
	  });
	};
	
	
	Menu.prototype.draw = function (context) {
	  context.clearRect(0, 0, this.constants.DIM_X, this.constants.DIM_Y);
	  context.fillStyle = this.constants.BG_COLOR;
	  context.fillRect(0, 0, this.constants.DIM_X, this.constants.DIM_Y);
	
	  this.drawTitle(context);
	  this.drawButtons(context);
	};
	
	Menu.prototype.drawTitle = function (context) {
	  context.fillStyle = this.constants.FONT_FILL;
	  context.strokeStyle = this.constants.STROKE_COLOR;
	  context.font = "80px Helvetica";
	
	  var text = "Platform Game";
	  var measurement = context.measureText(text);
	  var x = (context.canvas.width - measurement.width) / 2;
	
	  context.strokeText(text, x, 100);
	  context.fillText(text, x, 100);
	};
	
	Menu.prototype.drawButtons = function (context) {
	  context.fillStyle = this.constants.FONT_FILL;
	  context.strokeStyle = this.constants.STROKE_COLOR;
	
	  this.buttons.forEach( function (button, idx) {
	    var y = 300 + (idx * 100);
	    button.draw(context, y);
	  });
	};
	// ----------------- Buttons ----------------------------
	
	var Button = function (options) {
	  this.text = options.text;
	  this.func = options.func;
	  this.selected = false;
	};
	
	Button.prototype.draw = function (context, yPos) {
	  context.font = "40px Helvetica";
	
	  var measurement = context.measureText(this.text);
	  var x = (context.canvas.width - measurement.width) / 2;
	
	  context.strokeText(this.text, x, yPos);
	  context.fillText(this.text, x, yPos);
	
	  // context.fillRect(x - 20, yPos - 10, measurement + 40, 50);
	  // context.strokeRect(x - 20, yPos - 10, measurement + 40, 50);
	};
	
	Menu.prototype.step = function (timeDelta) {};
	
	
	
	
	module.exports = Menu;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var GameObject = __webpack_require__(5);
	
	var Bubble = function (game, yPos, xPos, velocity) {
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
	  this.image.src = './lib/sprites/bubble/bubble_sprite.png';
	};
	
	
	Util.inherits(Bubble, GameObject);
	
	Bubble.prototype.type = "Bubble";
	
	
	Bubble.prototype.draw = function (context) {
	  context.globalAlpha = 1 - (this.timer / this.disappearTime)
	  context.drawImage(this.image, this.xPos, this.yPos + this.height);
	  // write text
	};
	
	Bubble.prototype.updateTimer = function (timeDelta) {
	  this.timer += timeDelta;
	  if (this.timer > this.disappearTime) {
	    this.remove();
	  }
	};
	module.exports = Bubble;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map