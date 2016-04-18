var Util = require("./util");
var GameObject = require('./gameObject');

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
  // context.globalAlpha = 1 - (this.timer / this.disappearTime)
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
