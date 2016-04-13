var Util = require("./util");
var GameObject = require('./gameObject');

var JUMP = 12;
var FALL = 0.4;
var FUDGE = 5;

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
  console.log("grounded? " + this.state.grounded)
  if (this.state.grounded) {
    this.yVel = 0 - JUMP;
    this.state.grounded = false;
    console.log("jump!");
  } else if (!this.state.doubleJumped) {
    this.yVel = 0 - JUMP;
    this.state.doubleJumped = true;
    console.log("double jump!");
  } else {
    this.struggle();
  }
};

Jumper.prototype.struggle = function () {
  console.log("THE STRUGGLE");
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

  if (this.state.grounded) {
    yVel = 0;
    yAcc = 0;
  }

  this.yVel = yVel + (yAcc * timeScale);
  var newPos = this.yPos + offsetY;

  if (!this.state.grounded) {
    if (this.isLanding(newPos)) {
      newPos = this.landingPosition(newPos);
      this.land();
    } else {
       this.state.grounded = false;
     }
  }
  this.yPos = newPos;
};

Jumper.prototype.enableJump = function () {
  this.state.jumpAllowed = true;
};

// -------------------Platform Checks------------------------------

Jumper.prototype.isLanding = function (newPos) {
  var oldPos = this.yPos;
  var xPos = this.xPos;
  var landing = false;
  this.game.platforms.forEach(function (platform) {
    if (oldPos < platform.yPos && newPos > platform.yPos) {
      if (xPos > platform.xPos && xPos < (platform.xPos + platform.width)) {
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
    if (oldPos < platform.yPos && newPos > platform.yPos) {
      if (xPos > (platform.xPos - FUDGE) && xPos < (platform.xPos + platform.width)) {
        landingPos = platform.yPos - 1;
      }
    }
  });

  return landingPos;
};


module.exports = Jumper;
