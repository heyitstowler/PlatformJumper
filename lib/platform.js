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

  this.imageLeft = new Image();
  this.imageLeft.src = './lib/sprites/platform/platform_left.png';

  this.imageRight = new Image();
  this.imageRight.src = './lib/sprites/platform/platform_right.png';

  this.imageMid = new Image();
  this.imageMid.src = './lib/sprites/platform/platform_middle.png';

};

Util.inherits(Platform, GameObject);

Platform.prototype.type = "Platform";

Platform.prototype.draw = function (context) {
  var yVal = this.yPos - this.height + 12;
  var xVal = this.xPos + 30;
  var units = ((this.width - 60) / 40);

  context.drawImage(this.imageLeft, this.xPos, yVal);

  for (var i = 0; i < units; i++) {
    context.drawImage(this.imageMid, (xVal + (40 * i)), yVal);
  }

  context.drawImage(this.imageRight, (this.xPos + this.width - 30), yVal);
};

module.exports = Platform;
