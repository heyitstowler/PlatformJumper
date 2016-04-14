var Menu = function (startFunc, constants) {
  this.constants = constants;
  this.buttons = [];
  this.items = [
                {
                  text: "New Game",
                  func: startFunc
                },
                {
                  text: "How to Play",
                  func: function () { console.log("How to Play"); }
                }
              ];

  this.createButtons();
};

Menu.prototype.createButtons = function () {
  this.buttons = this.items.map(function (item) {
    var button = new Button(item);
    // button.addEventListener("click", button.funct);
    return button;
  });
};


Menu.prototype.draw = function (context) {
  context.clearRect(0, 0, this.constants.DIM_X, this.constants.DIM_Y);
  context.fillStyle = this.constants.BG_COLOR;
  context.fillRect(0, 0, this.constants.DIM_X, this.constants.DIM_Y);

  this.drawTitle(context);
  this.drawButtons(context);
};

Menu.prototype.drawTitle = function (context) {
  context.fillStyle = this.constants.FONT_FILL;
  context.strokeStyle = this.constants.STROKE_COLOR;
  context.font = "80px Helvetica";

  var text = "Platform Game";
  var measurement = context.measureText(text);
  var x = (context.canvas.width - measurement.width) / 2;

  context.strokeText(text, x, 100);
  context.fillText(text, x, 100);
};

Menu.prototype.drawButtons = function (context) {
  context.fillStyle = this.constants.FONT_FILL;
  context.strokeStyle = this.constants.STROKE_COLOR;

  this.buttons.forEach( function (button, idx) {
    var y = 300 + (idx * 100);
    button.draw(context, y);
  });
};
// ----------------- Buttons ----------------------------

var Button = function (options) {
  this.text = options.text;
  this.func = options.func;
  this.selected = false;
};

Button.prototype.draw = function (context, yPos) {
  context.font = "40px Helvetica";

  var measurement = context.measureText(this.text);
  var x = (context.canvas.width - measurement.width) / 2;

  context.strokeText(this.text, x, yPos);
  context.fillText(this.text, x, yPos);

  // context.fillRect(x - 20, yPos - 10, measurement + 40, 50);
  // context.strokeRect(x - 20, yPos - 10, measurement + 40, 50);
};

Menu.prototype.step = function (timeDelta) {};




module.exports = Menu;
