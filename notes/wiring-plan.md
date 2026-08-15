# Wiring Plan(s)

4 control bundles for each motor. Starting with controlling only three motors.

One pair m-f jumpers to power each component, m ends to breadboard rail.

Feed breadboard rail from usb-A of power bank. Solder USB cable to m jumpers.

This approach means I can easily add a motor, but also switch to separate
battery for board.

One m-f jumper from pi ground to the ground rail.

Power pi from other usb-A port on power bank (more protections there than
5v pin)

