var Jumper = require('./jumper');
var Platform = require('./platform');
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
