var Util = {
  inherits: function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  },

  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
};

module.exports = Util;
