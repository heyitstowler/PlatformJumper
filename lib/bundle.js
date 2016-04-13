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

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(2)
	
	document.addEventListener("DOMContentLoaded", function() {
	  var gameCanvas = document.getElementById("platformer-canvas");
	  gameCanvas.width = Game.DIM_X;
	  gameCanvas.height = Game.DIM_Y;
	
	  var context = gameCanvas.getContext("2d");
	  var game = new Game();
	  new GameView(game, context).start();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var Jumper = __webpack_require__(3);
	var Platform = __webpack_require__(4);
	// var Obstacle = require('./obstacle');
	// var Treasure = require('./treasure');
	
	var VELOCITY = 5;
	
	var Game = function () {
	  this.platforms = [];
	  this.obstacles = [];
	  this.treasures = [];
	  this.jumpers = [];
	
	  this.platformTimer = 0;
	  this.obstacleTimer = 0;
	  this.treasureTimer = 0;
	
	  this.rawScore = 0;
	
	  // Starting platform!
	  this.addPlatform(15, 500, 1000);
	
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.BG_COLOR = "#828282";
	
	
	
	Game.prototype.add = function (object) {
	  if (object.type === "Platform") {
	    this.platforms.push(object);
	  } else if (object.type === "Obstacle") {
	    this.obstacles.push(object);
	  } else if (object.type === "Treasure") {
	    this.treasures.push(object);
	  } else if (object.type === "Jumper") {
	    this.jumpers.push(object);
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
	  } else {
	    throw "wtf?";
	  }
	};
	
	Game.prototype.allObjects = function () {
	  return [].concat(this.platforms, this.obstacles, this.treasures, this.jumpers);
	};
	
	Game.prototype.draw = function (context) {
	  context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  context.fillStyle = Game.BG_COLOR;
	  context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  this.allObjects().forEach(function (object) {
	    object.draw(context);
	  });
	};
	
	Game.prototype.step = function (timeDelta) {
	  this.addScore(timeDelta);
	  this.moveObjects(timeDelta);
	  // this.checkIfDead();
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
	};
	
	// ------------------------ Jumpers -------------------------------------
	
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
	  console.log("Add random platform!");
	  var y = Util.getRandomInt(150, 500);
	  var length = Util.getRandomInt(100, 500);
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
	};
	
	Game.prototype.addTreasure = function (xPos, yPos) {
	
	};
	
	// ------------------------ Score ---------------------------------------
	
	Game.prototype.addScore = function (timeDelta) {
	  this.rawScore += Math.ceil(timeDelta);
	};
	
	
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	
	var GameView = function (game, context) {
	  this.context = context;
	  this.game = game;
	
	  this.jumper = this.game.addJumper();
	  console.log(this.jumper.state.grounded);
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  var jumper = this.jumper;
	  key("space", function () { jumper.jump(); return false });
	  key("enter", function () { jumper.land(); return false });
	};
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.context);
	  this.lastTime = time;
	
	  requestAnimationFrame(this.animate.bind(this));
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
	
	  // var jumper = this;
	  // document.addEventListener('keyup', function(event){
	  //   if (event.keyCode === "space") {
	  //     jumper.enableJump();
	  //   }
	  // });
	};
	
	Util.inherits(Jumper, GameObject);
	
	Jumper.prototype.type = "Jumper";
	
	Jumper.prototype.jump = function () {
	  console.log("grounded? " + this.state.grounded)
	  if (this.state.grounded) {
	    this.yVel = 0 - JUMP;
	    this.state.grounded = false;
	    console.log("jump!");
	  } else if (!this.state.doubleJumped) {
	    this.yVel = 1 - JUMP;
	    this.state.doubleJumped = true;
	    console.log("double jump!");
	  } else {
	    this.struggle();
	  }
	};
	
	Jumper.prototype.struggle = function () {
	  console.log("THE STRUGGLE");
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
	
	Jumper.prototype.enableJump = function () {
	  this.state.jumpAllowed = true;
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
	};
	
	Util.inherits(Platform, GameObject);
	
	Platform.prototype.type = "Platform";
	
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
	
	GameObject.prototype.collideWith = function (otherObject) {};
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map