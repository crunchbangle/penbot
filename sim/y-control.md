# y-control for fixed-angle gliphs question

I'm aware that drawing a circle, or indeed any closed loop, will cause the bot to veer off the line. So I was wondering about choosing whether to go cw or ccw depending on where the bot is compared to the line.

okay, so what I'm wondering is if we could get away with fixed paths for a font, from the robot's perspective, with the possibility of them being slightly differently oriented, but otherwise not needing to rotate them from the robot's path. or does that not matter? I'm sure it doesn't matter on the sim, but feels like it would matter irl. that's why I was wondering about controlling the y position of the bot on the canvas to minimise the angle deviation

(without needing to explicitly reposition the bot)