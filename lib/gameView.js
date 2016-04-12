

var GameView = function (game, context) {
  this.context = context;
  this.game = game;

  this.jumper = this.game.addJumper();
  console.log(this.jumper.state.grounded);
};

GameView.prototype.bindKeyHandlers = function () {
  var jumper = this.jumper;
  key("space", function () { jumper.jump(); return false });
  key("enter", function () { jumper.land(); return false });
};

GameView.prototype.start = function () {
  this.bindKeyHandlers();
  this.lastTime = 0;

  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.context);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
