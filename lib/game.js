var Util = require("./util");
var Jumper = require('./jumper');
var Platform = require('./platform');
// var Obstacle = require('./obstacle');
var Treasure = require('./treasure');
var Bubble = require('./bubble');

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
