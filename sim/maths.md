Claude from online... don't take the "spec" too seriously, 
but the maths is gold, and the descripion of the car should be accurate. That's what we want to simulate in an animated way, so I can understand what's going on.

# Penbot animator — build spec

Drop this in the repo root and point Claude Code at it. It contains the derived
kinematics so nothing has to be re-derived, plus numeric assertions so the
implementation can self-verify.

---

## 1. What to build

A single-page browser tool that takes a 2D pen path, converts it into stepper
motor instructions for a differential-drive pen plotter, and animates the robot
executing them. Three panes:

1. **Canvas** — top-down animation: chassis, two wheels, pen, the drawn trail,
   and (toggleable) the path of the axle centre and the instantaneous centre of
   curvature.
2. **Controls** — play / pause / scrub / speed, plus editable machine constants.
3. **Telemetry** — live readouts of `theta`, `v`, `omega`, `v_L`, `v_R`,
   cumulative step counts `n_L`/`n_R`, and pen up/down state. A strip chart of
   `v_L` and `v_R` against time is the single most useful debugging view — build it.

Plain HTML + Canvas 2D + vanilla JS in one file, no build step. Optimise for
fast iteration over architecture. No framework unless it earns its place.

## 2. Machine constants

All must be editable in the UI and live in one config object.

| Symbol | Meaning | Default |
|---|---|---|
| `d` | wheel spacing (track width), mm | 84 |
| `p` | pen offset forward of the wheel axis, mm | 55 |
| `wheelDia` | wheel diameter, mm | 34 |
| `stepsPerRev` | full steps per motor revolution | 200 |
| `microsteps` | microstepping divisor | 16 |
| `vMax` | per-wheel speed limit, mm/s | 30 |
| `aMax` | per-wheel acceleration limit, mm/s² | 200 |

Derived: `lambda = PI * wheelDia / (stepsPerRev * microsteps)` — mm of wheel
travel per microstep. With the defaults, `lambda = 0.033378` mm/step.

Constraint to enforce and warn on: `d/2 < p`. Below that the pen sits between
the wheels and lateral motion becomes more expensive than forward motion.

## 3. Kinematics — use these exactly

State is `(x_c, y_c, theta)` for the wheel-axis midpoint plus heading. The pen is
at `P = C + p * (cos theta, sin theta)`.

Sign conventions: `theta` measured CCW from +x. `v_L`, `v_R` are **linear** speeds
at the contact patches in mm/s, not angular. `omega > 0` is CCW.

### Inverse (path to motors) — the core transform

```js
// desired pen velocity (vxp, vyp) and current heading theta
const v     =  vxp * Math.cos(theta) + vyp * Math.sin(theta);
const omega = (-vxp * Math.sin(theta) + vyp * Math.cos(theta)) / p;
const vR = v + (d / 2) * omega;
const vL = v - (d / 2) * omega;
```

The Jacobian determinant is `p`, constant and non-zero, so this never becomes
singular. There is no null space: the pen cannot be held still while the wheels
move.

### Forward (motors to pose)

Heading comes exactly from the step counts, with no integration drift:

```js
theta = theta0 + lambda * (nR - nL) / d;
```

Position needs the exact arc update, not a Euler step:

```js
const ds = (dsR + dsL) / 2, dth = (dsR - dsL) / d;
if (Math.abs(dth) < 1e-9) {
  xc += ds * Math.cos(theta); yc += ds * Math.sin(theta);
} else {
  const R = ds / dth;
  xc += R * (Math.sin(theta + dth) - Math.sin(theta));
  yc += R * (Math.cos(theta) - Math.cos(theta + dth));
}
theta += dth;
```

## 4. Pipeline

```
path source -> resample -> inverse transform -> step targets -> timing -> playback + export
```

1. **Path source.** Start with parametric primitives (line, circle, arc,
   polyline, Lissajous) and a hand-typed list of waypoints. SVG path import is a
   stretch goal — do it last, if at all.

2. **Resample** to chords of `<= 0.05` mm. Uniform arc length, not uniform
   parameter — a circle parametrised by angle is fine, a Bezier is not.

3. **Inverse transform, per chord**, with a midpoint predictor for
   second-order accuracy:

```js
const thMid = theta + 0.5 * dthPrev;   // dthPrev from the previous chord
const ds  =  dx * Math.cos(thMid) + dy * Math.sin(thMid);
const dth = (-dx * Math.sin(thMid) + dy * Math.cos(thMid)) / p;
targetR += (ds + d * dth / 2) / lambda;   // keep as FLOATS
targetL += (ds - d * dth / 2) / lambda;
```

4. **Quantise, carrying residuals.** Round `targetL`/`targetR` to integers only
   at the moment of emitting a step and carry the fractional remainder into the
   next segment. Rounding per-segment and discarding the remainder accumulates
   error — this is the single most likely bug.

5. **Timing.** Clamp the commanded pen speed so that
   `max(|v_L|, |v_R|) <= vMax` and the implied wheel acceleration stays under
   `aMax`. Note the reachable set is a rhombus, not a disc (section 6) — a naive
   circular clamp is wrong in both directions.

6. **Export.** Emit `(t_ms, nL, nR, penDown)` waypoints as CSV/JSON for the
   firmware to interpolate between. Do not emit individual step pulses.

## 5. Behaviour to get right

- **Pen up for all repositioning.** A turn-in-place drags the pen around a 55 mm
  radius arc. There is no reorientation that leaves the pen still. Any move
  between disconnected path segments must lift the pen.
- **Corners.** A discontinuity in pen velocity direction demands a step change in
  wheel velocity, which a stepper cannot follow. Either fillet the vertex or
  decelerate to zero and restart. Detect and flag sharp vertices in the input.
- **No heading pre-planning.** Do not implement turn-then-drive. Feed the
  transform the path tangent and let the heading converge on its own (section 6).

## 6. Diagnostics worth surfacing in the UI

- **Lateral pen resolution** `p * lambda / d`. With defaults: 21.9 um. Warn above
  ~50 um, where small features start to look faceted.
- **Steps per full robot rotation** `PI * d / lambda` = 7906 with defaults. Useful
  for calibrating `d` on real hardware.
- **Velocity envelope.** Under a per-wheel limit `V`, reachable pen speed is a
  rhombus in the body frame: `V` straight forward or back, `(2p/d) * V = 1.310 * V`
  pure sideways, and only `0.802 * V` on the 45 degree diagonals. Draw it, and
  mark the current commanded velocity on it.
- **Minimum steady-state arc.** At any fixed wheel-speed ratio,
  `R_pen = sqrt(R_axle^2 + p^2) >= p`. So the tightest circle reachable at
  constant speeds is radius `p` = 55 mm (a spin on the spot). Anything tighter
  requires time-varying wheel speeds. Flag when a requested arc is below `p` so
  it's clear the motion will be an oscillation rather than a sweep.

## 7. Test cases with expected values

Assert these. Constants `d = 84`, `p = 55` unless stated.

### Inverse transform, `theta = 90` degrees, pen speed 10 mm/s

| Pen velocity | expected `v_R` | expected `v_L` |
|---|---|---|
| `(0, 10)` north | +10.000 | +10.000 |
| `(10, 0)` east | −7.636 | +7.636 |
| `(-10, 0)` west | +7.636 | −7.636 |
| `(7.071, 7.071)` NE 45° | +1.671 | +12.471 |
| `(7.947, 6.068)` NE 52.64° | 0.000 | +12.137 |
| `(0, 0)` | 0.000 | 0.000 |

Tolerance 1e-3. The fifth row is the one-wheel-stopped direction:
`atan(2p/d) = 52.64` degrees from the heading, equivalently `atan(d/2p) = 37.36`
degrees up from the axle line.

### Round trip

Inverse then forward on any pen velocity must return the input to within 1e-9.

### 5 mm diameter circle (radius `a` = 2.5 mm)

Command a full circle and check:

- Peak yaw excursion `a/p = 0.04545` rad = 2.60 degrees.
- Peak wheel speed `u * sqrt(1 + (d/2p)^2) = 1.2585 * u` for pen speed `u`.
- The two wheel speed traces are the same sinusoid, phase-separated by
  `2 * atan(d/2p) = 74.7` degrees. This is a good visual check on the strip chart.
- Pen closes the loop to within 20 um; net heading change under 0.5 degrees.
- Each wheel reverses direction exactly twice per circle.

### Heading convergence on a straight line

Command a straight pen path with an initial heading error `e0 = 90` degrees.
Closed form: `tan(e/2) = tan(e0/2) * exp(-s/p)` where `s` is pen arc length.

- After `s = 55` mm the error should be 40.4 degrees.
- After `s = 110` mm, 15.4 degrees.
- Pen cross-track error must be zero throughout — the error lives entirely in
  the heading, never in the pen position. Assert this; it catches sign errors in
  the inverse transform that the table above can miss.

### Constant-ratio arc

Hold a fixed `v_R : v_L` ratio and fit a circle to the pen trail. Its radius must
equal `sqrt(R_axle^2 + p^2)` and must never come out below `p` = 55 mm.

## 8. Explicit non-goals

No hardware I/O, no serial, no G-code dialect compatibility, no path
optimisation or travel-order solving. Simulation and step generation only.