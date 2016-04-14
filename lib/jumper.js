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

  // var jumper = this;
  // document.addEventListener('keyup', function(event){
  //   if (event.keyCode === "space") {
  //     jumper.enableJump();
  //   }
  // });
};

Util.inherits(Jumper, GameObject);

Jumper.prototype.type = "Jumper";

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
