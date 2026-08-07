# Power Plan

I'll use my Tuxinsun 22.5watt 20000mAh fast charger for power.

The steppers are 28BYJ-48 style and their boards are ULN-2003 boards.

There are several options for configuration...

## 1. Bank powers everything

This is the easiest first option. I can try powering the stepper boards and the
pi from the powerbank. This can be tried with them connected to the same port
or to different ports. ~750-1000uF 20+V electrolytics can be attached to the
stepper board inputs to even out any bumps.

The issue is that when the steppers engage, there could be a voltage dip on the
bank. If the ports are isolated (unlikely on a cheap power bank) then there could
be different effects depending on whether the pi and stepper boards share a port
or the pi uses a dedicated one. Either might be better. Or there might be no difference.

Caps could help smooth out the bumps, preventing a pi reset.

Having said that, it might just all be fine. 22.5w is a great deal more than 
pi + steppers.

## 2. Bank powers steppers, Pi has it's own

There are two versions of this, one where the Pi has a separate on-board
battery (maybe another bank... robot getting very heavy at that stage!)
and one where it's fed from its PSU via umbillical.

## 3. Pi sits remote from robot

Feeds board signals via umbillical. Too complicated!
