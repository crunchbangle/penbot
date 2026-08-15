# Setup and test

I don't have a pen attached, or even power/boards mounted. But am checking power supply.

Pi needed:

```bash
sudo apt update
sudo apt install python3-dev
mkdir test1
cd test1
python -m venv venv
source ./venv/bin/activate
pip install RPi.GPIO

```

I did that via Raspberry Pi Connect, with Pi
running from power bank usb-A, as described in 
wiring plan. The rest of the wiring is in place
too I think.

Motor 1 LEDs flickering, but nothing else.
Motors 2 and 3 seemed fine.

Maybe i reversed power through motor 1 board? I think they're 
supposed to have protection, but it wasn't working.

So I swapped out the board. Then powering any of them just reset the pi.
The bank was down in 60s%. Maybe just not enough?

Rigged up a little lego battery holder for my 3.7V 1900mAh 7.0Mh packs.
Now pi power is from that...

It wasn't enough to power the pi. So plugging the pi into the wall for now.

All the LEDs work now.

So, let's speed things up a bit. I'm going to attempt to turn motor 3 10 degrees one way, then 20 the other, then 10 back the first.

Okay. I used test1b.py to move all the motors. With the motors powered from
the powerbank and the pi powered from its own supply, this worked fine.

Actually, not really fine. The motors did what they were meant to. And
the modified Bresemhan stream works nice. But the wheels slipped a lot:

- slippery surface
- impeded by wires connected to off-board stuff (neither pi nor motor boards are actually mounted yet)
- coaster needs another space to get all the wheels level.

So, then I balanced all the stuff on top, and it actually did pretty well. 
Next I need to mount the boards and power bank properly, and then make a pen
attachment. 

test1c.py only really differs in the stream I think?

```py
H1 = "p150 B600 C500 P150 c1000 p150 C500" # down-stroke of H
H2 = " P150 B600" # cross-stroke of H
H3 = " p150 C500 P150 c1000 p150 C500" # 2nd down-stroke of H
MV = " p150 B500" # move over
ID = " C500 P150 c100 p150 c100 P150 c800 p150 C500 B600" # i with dot and move over
ED = " C500 P150 c800 p150 c100 P150 c100 p150 C500 b2000" # ! with dot and move back
stream = H1 + H2 + H3 + MV + ID + ED
```

This didn't quite go to plan:

1. I got my cw/ccw the wrong way for down-strokes
2. the robot ended up off-course somehow.
3. the pen-holder fell of

But it did draw a nice arc :D