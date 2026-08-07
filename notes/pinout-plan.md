# Pinout Plan

Raspberry Pi Pins:

| function | pin | pin | function |
| -------- | -- | -- | -------- | 
| 3v3 Power | 1 | 2 | 5v Power |
| GPIO 2 (I2C1 SDA) | 3 | 4 | 5v Power |
| GPIO 3 (I2C1 SCL) | 5 | 6 | Ground |
| GPIO 4 (GPCLK0) | 7 | 8 | GPIO 14 (UARTO TX) |
| Ground | 9 | 10 | GPIO 15 (UARTO RX) |
| GPIO 17 | 11 | 12 | GPIO 18 (PCM CLK) |
| GPIO 27 | 13 | 14 | Ground |
| GPIO 22 | 15 | 16 | GPIO 23 |
| 3v3 Power | 17 | 18 | GPIO 24 |
| GPIO 10 (SPIO MOSI) | 19 | 20 | Ground |
| GPIO 9 (SPIO MISO) | 21 | 22 | GPIO 25 |
| GPIO 11 (SPIO SCLK) | 23 | 24 | GPIO 8 (SPIO CE0) |
| Gound | 25 | 26 | GPIO 7 (SPIO CE1) |
| GPIO 0 (EEPROM SDA) | 27 | 28 | GPIO 1 (EEPROM SCL) |
| GPIO 5 | 29 | 30 | Ground |
| GPIO 6 | 31 | 32 | GPIO 12 (PWM0) |
| GPIO 13 (PWM1) | 33 | 34 | Ground |
| GPIO 19 (PCM FS) | 35 | 36 | GPIO 16 |
| GPIO 26 | 37 | 38 | GPIO 20 (PCM DIN) |
| Ground | 39 | 40 | GPIO 21 (PCM DOUT) |

Focussing on GPIO only

| GPIO | pin | pin | GPIO |
| ------ | -- | -- | ------ | 
| _3v3_  | 1  | 2  | _5v_   |
| **2**  | 3  | 4  | _5v_   |
| **3**  | 5  | 6  | _Gnd_  |
| **4**  | 7  | 8  | **14** |
| _Gnd_  | 9  | 10 | **15** |
| **17** | 11 | 12 | **18** |
| **27** | 13 | 14 | _Gnd_  |
| **22** | 15 | 16 | **23** |
| _3v3_  | 17 | 18 | **24** |
| **10** | 19 | 20 | _Gnd_  |
| **9**  | 21 | 22 | **25** |
| **11** | 23 | 24 | **8**  |
| _Gnd_  | 25 | 26 | **7**  |
| **0**  | 27 | 28 | **1**  |
| **5**  | 29 | 30 | _Gnd_  |
| **6**  | 31 | 32 | **12** |
| **13** | 33 | 34 | _Gnd_  |
| **19** | 35 | 36 | **16** |
| **26** | 37 | 38 | **20** |
| _Gnd_  | 39 | 40 | **21** |


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