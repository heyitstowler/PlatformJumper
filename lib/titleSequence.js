var TitleSequence = function (gameView){
  this.gameView = gameView;

  this.titleScreen = new Image();
  this.titleScreen.src = './lib/splashes/title.png';

  this.aboutScreens = [];

  var title = this;
  for (var i = 1; i < 14; i++){
    var image = new Image();
    image.src = ('./lib/splashes/about_' + i + '.png');
    this.aboutScreens.push(image);
  }

  this.blankHeader = new Image();
  this.blankHeader.src = './lib/splashes/blank_header.png';
  this.spriteStanding = new Image();
  this.spriteStanding.src = 'lib/splashes/sprite_standing.png';

  this.runAnimation = new Image();
  this.runAnimation.src = 'lib/sprites/jumper/jumper_run.gif';

  this.howToPlay = new Image();
  this.howToPlay.src = './lib/splashes/how_to_play.png';
};

TitleSequence.prototype.drawTitleScreen = function (context) {
  context.clearRect(0, 0, 1000, 600);
  this.fadeInImage(context, this.titleScreen, false);
};

TitleSequence.prototype.drawHowToPlay = function (context) {
  this.fadeInImage(context, this.howToPlay, false, this.titleScreen);
};

TitleSequence.prototype.startAbout = function (context) {
  this.fadeTitle(context);
  var TitleSequence = this;

  var i = 0;
  var delay = 5000;

  var nextFrame = setInterval(function() {
    if (i === 0) {
      TitleSequence.fadeInImage(context, TitleSequence.aboutScreens[0], true)
      i += 1;
    } else if (i < 13) {
      TitleSequence.fadeInImage(context, TitleSequence.aboutScreens[i],
        true, TitleSequence.aboutScreens[i - 1]);
      i += 1;
    } else {
      clearInterval(nextFrame);
      TitleSequence.fadeLastImage(context);
    }
  }, delay);

  key('b', function(){ clearInterval(nextFrame); });
};

TitleSequence.prototype.fadeInImage = function (context, image,
  background, previousImage, animation) {
  var blank = this.blankHeader;
  var fade = 0;
  var title = this;


  var animateFade = function () {
    if (fade > 100) {
      if (previousImage) {
        title.fadeInImage(context, image, background);
      } else {
        return;
      }
    } else {
      if (previousImage) {
        context.clearRect(0, 0, 699, 600);
        if (background) {
          title.drawFade(context, blank, 100);
        } else {
          context.clearRect(0, 0, 1000, 600);
        }
        title.drawFade(context, previousImage, (100 - fade));
        fade += 2;
      } else {
        if (animation) {
          // context.drawImage(animation, 700, 0);
        }
        if (background) {
          title.drawFade(context, blank, 100);
        } else {
          context.clearRect(0, 0, 1000, 600);
        }
        title.drawFade(context, image, fade);
        fade += 3;
      }
      requestAnimationFrame(animateFade);
    }
  };

  animateFade();
};

TitleSequence.prototype.drawFade = function (context, image, fade) {
  context.save();
  context.globalAlpha = (fade / 100);
  context.drawImage(image, 0, 0);
  context.restore();
};

TitleSequence.prototype.fadeLastImage = function (context) {
  var blank = this.aboutScreens[11];
  var image = this.aboutScreens[12];
  var fade = 0;
  var title = this;


  var animateFadeOut = function () {
    if (fade > 100) {
      title.gameView.loadTitleSequence()
    } else {
      // context.clearRect(0, 0, 1000, 600);
      title.drawFade(context, image, 100);
      title.drawFade(context, blank, fade);
      fade += 1;

      requestAnimationFrame(animateFadeOut);
    }
  };

  animateFadeOut();
};

TitleSequence.prototype.fadeHowToPlay = function (context) {
  var image = this.howToPlay;
  var fade = 0;
  var title = this;


  var animateFadeOut = function () {
    if (fade > 100) {
      title.gameView.loadTitleSequence()
    } else {
      context.clearRect(0, 0, 1000, 600);
      title.drawFade(context, image, (100 - fade));
      fade += 1;

      requestAnimationFrame(animateFadeOut);
    }
  };

  animateFadeOut();
};

TitleSequence.prototype.fadeTitle = function (context) {
  var image = this.titleScreen;
  var fade = 0;
  var title = this;


  var animateFadeOut = function () {
    if (fade > 100) {
      return;
    } else {
      context.clearRect(0, 0, 1000, 600);
      title.drawFade(context, image, (100 - fade));
      fade += 1;

      requestAnimationFrame(animateFadeOut);
    }
  };

  animateFadeOut();
};


module.exports = TitleSequence;
