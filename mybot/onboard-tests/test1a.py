import RPi.GPIO as GPIO
import time


"""
Motor 1: 

| Coil  | Pin | Pin | GPIO |
| - | --- | -- | ------ |
| 1 | IN1 | 32 | **12** |
| 2 | IN2 | 36 | **16** |
| 2 | IN3 | 38 | **20** |
| 4 | IN4 | 40 | **21** |

Motor 2: 

| Coil  | Pin | Pin | GPIO |
| - | --- | -- | ------ |
| 1 | IN1 | 31 | **6** |
| 2 | IN2 | 33 | **13** |
| 2 | IN3 | 35 | **19** |
| 4 | IN4 | 37 | **26** |

Motor 3: 

| Coil  | Pin | Pin | GPIO |
| - | --- | -- | ------ |
| 1 | IN1 | 22 | **25** |
| 2 | IN2 | 24 | **8** |
| 2 | IN3 | 26 | **7** |
| 4 | IN4 | 28 | **1** |
"""

# set bcm mode and pin arrays for each motor

GPIO.setmode(GPIO.BCM)

M1_PINS = [12, 16, 20, 21]
M2_PINS = [6, 13, 19, 26]
M3_PINS = [24, 25, 8, 7]

all_pins = M2_PINS + M3_PINS + M1_PINS
try:

    # set all as outputs:

    for pin in all_pins:
        GPIO.setup(pin, GPIO.OUT)

    # set each on and off again in turn

    for pin in all_pins:
        print("setting pin %s high..." % (pin,))
        time.sleep(0.5)

        GPIO.output(pin, GPIO.HIGH)
        print("pin %s now high" % (pin,))

        time.sleep(0.5)

        print("setting pin %s low" % (pin,))
        time.sleep(0.5)

        GPIO.output(pin, GPIO.LOW)
        print("pin %s now low" % (pin,))

        time.sleep(0.5)
finally:
    for pin in all_pins:
        GPIO.output(pin, GPIO.LOW)
    GPIO.cleanup()

