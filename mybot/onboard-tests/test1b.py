import RPi.GPIO as GPIO
import time
import re

# speed:
MS_BETWEEN_STEPS = 5

# set bcm mode and pin arrays for each motor

GPIO.setmode(GPIO.BCM)

M1_PINS = [12, 16, 20, 21]
M2_PINS = [6, 13, 19, 26]
M3_PINS = [24, 25, 8, 7]

# 2037.88641975309 whole steps is one revolution
# 56.6079561042524 whole steps is 10 degrees.
# so let's just do 57 steps on each motor

stream = "P285p285L570l570R570r570B570b570C570c570";

def multi_char(m):
    c = m.group(1)
    n = int(m.group(2))
    return c * n

class motor:
    # this motor only allows one pin on at a time
    def __init__(self, pins):
        self.pins = pins
        self.pin_on = -1

    def cw(self):
        GPIO.output(self.pins[self.pin_on], GPIO.LOW)
        self.pin_on = (self.pin_on + 1) % len(self.pins)
        GPIO.output(self.pins[self.pin_on], GPIO.HIGH)

    def ccw(self):
        GPIO.output(self.pins[self.pin_on], GPIO.LOW)
        self.pin_on = (self.pin_on -1) % len(self.pins)
        GPIO.output(self.pins[self.pin_on], GPIO.HIGH)

    def off(self):
        GPIO.output(self.pins[self.pin_on], GPIO.LOW)

right = motor(M1_PINS)
left = motor(M2_PINS)
pen = motor(M3_PINS)

def process_stream(s):
    e = re.sub(r'([PpLlRrCcBb])(\d+)', multi_char, s)
    last_msg = ''
    msg = ''
    for c in e:
        match c:
            case 'P':
                pen.cw()
                msg = "pen down"
            case 'p':
                pen.ccw()
                msg = "pen up"
            case 'L':
                left.ccw()
                msg = "left forward"
            case 'l':
                left.cw()
                msg = "left backward"
            # right is the opposite way from left
            case 'R':
                right.cw()
                msg = "right forward"
            case 'r':
                right.ccw()
                msg = "right backward"
            case 'B':
                left.ccw()
                right.cw()
                msg = "both forward"
            case 'b':
                left.cw()
                right.ccw()
                msg = "both backward"
            case 'C':
                left.ccw()
                right.ccw()
                msg = "clockwise (both motors ccw)"
            case 'c':
                left.cw()
                right.cw()
                msg = "anti-clockwise (both motors cw)"
            case _:
                print("unknown char: %s" % (c, ))
        if msg != last_msg:
            print(msg)
            last_msg = msg
        time.sleep(MS_BETWEEN_STEPS/1000.0)

all_pins = M2_PINS + M3_PINS + M1_PINS
try:
    # set all as outputs:
    for pin in all_pins:
        GPIO.setup(pin, GPIO.OUT)

    process_stream(stream)

finally:
    for pin in all_pins:
        GPIO.output(pin, GPIO.LOW)
    GPIO.cleanup()
