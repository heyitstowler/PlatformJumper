var Util = require("./util");
var GameObject = require('./gameObject');

var Treasure = function (game, yPos, velocity) {
  this.image = new Image();
  this.image.src = ('./lib/treasure_icon.png');
  var options = {
    height: 70,
    width: 70,
    xPos: 1000
  };
  options.game = game;
  options.yPos = yPos;
  options.xVel = 0 - (velocity * .8);


  GameObject.call(this, options)
};

Util.inherits(Treasure, GameObject);

Treasure.prototype.type = "Treasure";

Treasure.prototype.draw = function (context) {
  context.drawImage(this.image, this.xPos, this.yPos);
};
module.exports = Treasure;
