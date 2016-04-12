var Util = require("./util");
var GameObject = require('./gameObject');


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
