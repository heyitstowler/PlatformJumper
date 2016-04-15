var Util = require("./util");
var GameObject = require('./gameObject');

var JUMP = 12;
var FALL = 0.4;
var FUDGE = 35;

var Jumper = function (game) {
  this.state = { grounded: true, doubleJumped: false, jumpAllowed: true };
  var options = {
    game: game,
    height: -50,
    width: 30,
    color: "#AD3D18",

    xPos: 40,
    yPos: 499,

    yAcc: FALL
  };

  GameObject.call(this, options);
  // this.image = new Image();
  // this.image.src = './lib/sprites/jumper/jumper_sprite.png';
  this.imageCounter = 0;
  this.images = [];
  this.loadImages();
};

Util.inherits(Jumper, GameObject);

Jumper.prototype.type = "Jumper";

Jumper.prototype.loadImages = function () {
  var jumper = this;
  for (var i = 0; i < 12; i++){
    var image = new Image();
    image.src = ('./lib/sprites/jumper/jumper_sprite_run' + i + '.png');
    jumper.images.push(image);
  }
  var airborne = new Image();
  airborne.src = ('./lib/sprites/jumper/jumper_sprite_airborne.png');
  jumper.images.push(airborne);
};

Jumper.prototype.draw = function (context) {
  var image;
  var offsetY = 0;
  if (!this.state.grounded) {
    image = this.images[12];
    this.imageCounter = 48;
  } else {
    var idx = Math.floor(this.imageCounter / 5);

    image = this.images[idx];

    switch (idx) {
      case 0:
      case 1:
      case 2:
      case 6:
      case 7:
      case 8:
        offsetY = -6;
        break;
      case 3:
      case 5:
      case 9:
      case 11:
        offsetY = -3
        break;
      default:
        offsetY = 0;
    }

    this.imageCounter += 1;
    if (this.imageCounter > 59) {
      this.imageCounter = 0;
    }
  }
  context.drawImage(image, this.xPos, Math.floor(this.yPos) + this.height + offsetY);
};

Jumper.prototype.jump = function () {
  if (this.state.grounded) {
    this.yVel = 0 - JUMP;
    this.state.grounded = false;
    // console.log("jump!");
  } else if (!this.state.doubleJumped) {
    this.yVel = 1 - JUMP;
    this.state.doubleJumped = true;
    // console.log("double jump!");
  } else {
    this.struggle();
  }
};

Jumper.prototype.struggle = function () {
  if (this.yVel > 4) {
    this.yVel -= 3;
  }
  // console.log("THE STRUGGLE");
};

Jumper.prototype.land = function () {
  this.yVel = 0;
  this.state.grounded = true;
  this.state.doubleJumped = false;
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;

Jumper.prototype.move = function (timeDelta) {
  var timeScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
  var offsetY = this.yVel * timeScale;
  var yAcc = this.yAcc;
  var yVel = this.yVel;

  // 1 Compute final location for free-fall case
  var newPos = this.yPos + offsetY;

  // 2 Check if on a platform
  if (this.isGrounded()) {

  } else {
    this.state.grounded = false;

    // 3 Compute new velocity
    this.yVel = yVel + (yAcc * timeScale);

    // 3 Check if landing
    if (!this.state.grounded) {
      if (this.isLanding(newPos)) {
        newPos = this.landingPosition(newPos);
        this.land();
      }
    }
  }

  // 4 Move jumper
  this.yPos = newPos;
};

// -------------------Platform Checks------------------------------

Jumper.prototype.isGrounded = function () {
  var grounded = false;
  var jumper = this;
  this.game.platforms.forEach(function (platform) {
    if (jumper.xPos > (platform.xPos - FUDGE) && jumper.xPos < (platform.xPos + platform.width)) {
      if (jumper.yPos === platform.yPos - 1) {
        grounded = true;
      }
    }
  });
  return grounded;
};

Jumper.prototype.isLanding = function (newPos) {
  var oldPos = this.yPos;
  var xPos = this.xPos;
  var landing = false;
  this.game.platforms.forEach(function (platform) {
    if (xPos > (platform.xPos - FUDGE) && xPos < (platform.xPos + platform.width)) {
      if (oldPos < platform.yPos && newPos > platform.yPos) {
        landing = true;
      }
    }
  });

  return landing;
};

Jumper.prototype.landingPosition = function (newPos) {
  var oldPos = this.yPos;
  var xPos = this.xPos;
  var landingPos;
  this.game.platforms.forEach(function (platform) {
    if (xPos > (platform.xPos - FUDGE) && xPos < (platform.xPos + platform.width)) {
      if (oldPos < platform.yPos && newPos > platform.yPos) {
        landingPos = platform.yPos - 1;
      }
    }
  });

  return landingPos;
};


module.exports = Jumper;
