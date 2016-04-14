var Util = require("./util");
var GameObject = require('./gameObject');

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
  context.drawImage(this.images[imageNumber], this.xPos, this.yPos + this.height);
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
