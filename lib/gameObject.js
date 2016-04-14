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

GameObject.prototype.corners = function () {
  var corners = {
    botLeft: [this.xPos, this.yPos],
    topRight: [this.xPos + this.width, this.yPos - this.height]
  };

  return corners;
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

GameObject.prototype.checkCollision = function (target) {

  var thisCorners = this.corners();
  var left = thisCorners.botLeft;
  var right = thisCorners.topRight;

  var targetCorners = target.corners();
  var tLeft = targetCorners.botLeft;
  var tRight = targetCorners.topRight;

  var collided = true;

  if (left[0] > tRight[0] || tLeft[0] > right[0]){
    collided = false;
  }
  if (left[1] > tRight[1] || tLeft[1] > right[1]) {
    collided = false;
  }

  // if (collided) {
  //   this.collision(target);
  // }

  return collided;
};

GameObject.prototype.collision = function (target) {};

GameObject.prototype.remove = function () {
  this.game.remove(this);
};


module.exports = GameObject;
