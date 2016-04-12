# Platform Game #

## About

In Platform Game, you take on the role of the Jumper, a thing cursed to an
existence of perpetual escape.  The Jumper is constantly moving forward to
escape the certain doom that follows it, but the path forward is not an easy one.
Help the Jumper prolong the inevitable by using the spacebar, which causes the
Jumper to jump, allowing you to narrowly avoid obstacles and the many forms of
death the Jumper faces.  Life is short for the Jumper, so be sure to live it up
by collecting all the treasures you can.

##Elements:
#[ ] - Jumper:
[x] - Has a constant forward velocity (or rather, the screen does?).
[x] - Has a downward acceleration as long as it is not on a platform. (aka falling)  
[x] - Landing on top of a platform will reset the Jumper's vertical velocity to zero.
[x] - Can JUMP while on a platform, which instantaneously adds vertical velocity
[ ] - Dies upon contact with the bottom of the screen or an obstacle

#[ ] - Platforms
[x] - have a horizontal surface that cannot be crossed

#[ ] - Obstacles
[ ] - Have some vertical component that causes death upon contact with the Jumper

#[ ] - Treasures
[ ] - Disappear on contact with the Jumper, adding points to the Jumper's score

##TODO

[ ] - Landing fix.  Thought it was a double jump fix, but it was actually a grounding state check issue
      Try using it as a state and checking at the end of each move call?

<!--
  Stuff to talk about:

  generating platforms/objects/etc >>> timers

  drawing objects, moving objects >>> inheritance, default options

  held key issue
 -->
