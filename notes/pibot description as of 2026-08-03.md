# pibot description as of 2026-08-03

There are some photos in immich-202060803_075543

They show the core of what will be a raspberry pi-driven robot.
It's made of Lego some stepper motors I got a long time ago and
some uv resin holding them together.

The robot can move by turning two wheels. There's a castor behind
to keep it stable but allow turning. The wheels are about 86mm 
apart (center-center) and the tyres are 36mm diameter at the point that
touches the ground.

The motors are driven by matching boards, which can be powered separately 
from the pi. They each have 4 inputs that can be powered alone or in pairs
(for higher precision). I have a 12v AA battery bank for this purpose.
Actually, I'm now reading they are 5v coils, so maybe I could use the 
same input as for the pi?

Motor info:

- Rated Voltage: 5V DC
- Number of Phases: 4
- Stride Angle: 5.625°/64
- Pull in torque: 300 gf.cm
- Insulated Power: 600VAC/1mA/1s
- Coil: Unipolar 5 lead coil

There are LED indicators on them to show which inputs are active. They're
already connected to the motors (though can be unplugged)

The connections to the pi can be via breakout board. I think I have enough
jumper cables to connect 3 of the motors rn. The pi is a 3B. I can't remember
if that has wifi or if I'll need to plug it in. It would be great to be able
to send commands remotely.

I do have a pi camera and some proximity sensors, but wasn't planning on 
using them at this early stage.

## Application 1: "printer"

I'd like my first toy application for this robot to be drawing stuff.
With 3 motors activatable, I can drive with 2 and lift a single pen up/down
with the 3rd. I'm interested to see can we:

- make interesting patterns from mathematical (polar) functions
- attempt to write some text based on paths and positions
    - calculate on-the-fly from current position how to make a path or get the pen to another posision
- attempt to recreate something graphical
    - drawing lines, with same caveats as writing text
    - polar crosshatching only

TODO:

I've made these stepper motors turn from a pi before, but I don't think
I have any of that code left. I think I did it in C/C++ before, and would
like to do this again for the speed it gives (and I need more practise
in these languages)

First I want to make the software that drives the motors and show that it works. The motors for the wheels are literally glued in place, so they are going nowhere. The function/method names can indicate the direction on the car rather than cw/ccw on the motor. 

Complete the initial build:

- correct the castor height
- install pi and power
- install pen-holder and pen-control rod

Once the pen is in place, I want to make the software that calculates
pen paths. For text it would be cool if each character path resulted in
the robot starting and ending on the baseline in oriented with the text
direction. This would mean we could string characters together without
needing to re-calculate paths from a different angle or re-position the 
robot. 

Currently the joint for the pen-holder equipment is 42mm from the wheel
axle, so the pen is likely to be either about 55mm from the axle and central
between the wheels, or maybe 30mm from the axle and offset to one side by 
15mm. 

In the future of the printer project, I want either two pens or a pen-changer. Two pens could mean two colour, and the geometry is just
mirrored for each. But the robot would need to re-position when switching.
Vs pen-switcher would more likely mean central geometry, no repositioning
and multible colours, with the caveat of being much more complicated to 
construct well. Let's see how I get on with one pen first!

Comms - I need to figure out how I'm sending data to the pi. I was going 
to use a pi-zero W, but none of mine have headers installed. My 3b has a
header installed. Also, the 3b is maybe quicker? I'm not sure if there's 
a limit on the io speed, but I don't thing a C++ program will be able to 
switch that fast on either. Though they both ought to be able to out-pace
the motors I guess? I read once you can get MHz out of the gpio on a pi.

The stride angle of the motor is 5.625°, but it's on a ~64x reducer, giving
0.0883° per stride. We also do not need to keep them powered to hold position? So if we're done, we can set them all off to save power.

There is also play in the gearbox to compensate for. Exact values tbd.

The wheels are 36mm diameter. They're 84mm apart. A wheel perimeter should
be about 113.1mm. This means 0.088° on a wheel moves that wheel 0.0276mm.
If both wheels move 0.0276mm on the 84mm circle the wheels would rotate on,
that's a 263.9mm perimeter, so 0.0276mm is about 0.0376°. If the pen is
55mm from the axle, its turning circle is 345.6mm, and 0.0376° on that
is about 0.0361mm. And obviously if the whole car moves forward/back, that's
0.0276mm. So we have sub-mm precision (but accuracy will not be there I think)
I hope this translates into being able to scrawl some vaguely readable text :D

Initial back-of-envelope calcs (needs verification and irl calibration):

- half-step each motor, same direction, moves pen 0.028 mm
- half-step each motor, opp direction, moves pen 0.036 mm (along an arc 55mm radius)

500 steps per second should be 0.028mm * 500/s = 14mm/s - fast enough.
Though we could do 500 whole-steps per second, which is 28mm/s. Too fast!

---

Plan for dev

Basic motor movements in C/C++ - motor, speed, accel, direction, mode 
(single coil, double coil, or half-step)

Should be able to send a set of commands, one for each motor, and the 
program should be able to interlace the commands to have them all happen
at once? 

Design a set of characters that can be written with the robot starting/
ending in the same orientation at the same baseline level.

How will the movements of the motors be coordinated in time? Maybe the
C/C++ prog needs to accept a formula? idk.