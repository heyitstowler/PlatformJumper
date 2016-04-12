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

	var Jumper = __webpack_require__(3);
	var Platform = __webpack_require__(4);
	// var Obstacle = require('./obstacle');
	// var Treasure = require('./treasure');
	
	
	var Game = function () {
	  this.platforms = [];
	  this.obstacles = [];
	  this.treasures = [];
	  this.jumpers = [];
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.BG_COLOR = "#000";
	
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
	
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	
	var GameView = function (game, context) {
	  this.context = context;
	  this.game = game;
	};
	
	GameView.prototype.start = function () {
	  // this.bindKeyHandlers();
	  this.lastTime = 0;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  // this.game.step(timeDelta);
	  this.game.draw(this.context);
	  // this.lastTime = time;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Jumper = function () {};
	
	module.exports = Jumper;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Platform = function () {};
	
	module.exports = Platform;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map