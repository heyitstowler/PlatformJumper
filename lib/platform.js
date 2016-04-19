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
