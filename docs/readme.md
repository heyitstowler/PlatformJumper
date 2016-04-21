# Platform Jumper #

## About

In Platform Jumper, you take on the role of the Jumper, a thing cursed to an
existence of perpetual escape.  The Jumper is constantly moving forward to
escape the certain doom that follows it, but the path forward is not an easy one.
Help the Jumper prolong the inevitable by using the spacebar, which causes the
Jumper to jump, allowing you to narrowly avoid obstacles and the many forms of
death the Jumper faces.  Life is short for the Jumper, so be sure to live it up
by collecting all the treasures you can.

## Elements:
### [x] - Jumper:
[x] - Has a constant forward velocity (or rather, the screen does?).
[x] - Has a downward acceleration as long as it is not on a platform. (aka falling)  
[x] - Landing on top of a platform will reset the Jumper's vertical velocity to zero.
[x] - Can JUMP while on a platform, which instantaneously adds vertical velocity
[x] - Dies upon contact with the bottom of the screen

### [x] - Platforms
[x] - Have a horizontal surface that can be jumped through but not dropped through
[x] - Randomly generated (vertical position and length) at regular intervals

### [x] - Treasures
[x] - Disappear on contact with the Jumper, adding points to the Jumper's score
[x] - Randomly generated (vertical position) at regular intervals

### [x] - Game Logic
[x] - Game updates timers to generate objects
[x] - Game keeps track of score (time survived and treasures collected)
[x] - Game keeps track of lives, subtracting one with each death and causing the
      game to end when out of lives

### [x] - Display
[x] - Displays current score and final score on game over
[x] - Displays current number of lives

## Extras
### [x] - Misc. Features
[x] - Pause function
[x] - Collecting 10 coins gives you an extra Life
[x] - Difficulty increases as you survive: platform velocity modifier increases

### [x] - Custom Sprites and animations
#### [x]  - Jumper
  [x] - Separate sprites for running and being airborne
  [x] - Oscillates to look like running
  [x] - Restarts running animation at specific frame on landing so the animation looks natural
[x] - Treasures
[x] - Platforms
[x] - +50 bubble appears upon collecting treasures
[x] - Lives and Treasure sprites on display
[x] - Extra Life bubble appears when you collect your 10th coin


### [x] - Title Screen
[x] - Displays on opening
[x] - Gives option to start game, view how to play, or go to about
[x] - Returns to Title Screen on game over

### [x] - About the Game / How to Play
[x] - How to play succinctly explains game controls
[x] - About automatically scrolls through pages
[x] - Can return to Title Screen at any point in About/How To


## Challenges and implementations
### Jumper
### Platforms
### Treasures
### Pause Function



## Future implementations

### Maybes:
[ ] - heart loss animation
[ ] - ready//start! animation
[ ] - In-game message overlays (Close landing, struggles)

### [ ] Obstacles
[ ] - Jumper dies on contact

<!--
  Stuff to talk about:

  generating platforms/objects/etc >>> timers

  drawing objects, moving objects >>> inheritance, default options

  held key issue
 -->
