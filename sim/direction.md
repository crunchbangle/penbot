# Heading dynamics and the CW/CCW choice

Notation from `maths.md`: `d` track width, `p` pen offset forward of the axle,
`theta` heading, pen at `P = C + p*(cos theta, sin theta)`.

## The pen does not veer

The inverse transform has Jacobian determinant `p`, constant and non-zero. There
is no null space. Given any desired pen velocity there is exactly one `(v_L, v_R)`
that produces it. So in the kinematic model the pen tracks **any** path exactly,
closed loops included, and cross-track error is identically zero.

What is free is the heading. The bot is a two-state-plus-one system: the pen
consumes two degrees of freedom, `theta` is left to do whatever the dynamics
dictate. So the thing that "veers off" is the chassis, not the line.

## The heading-error ODE

Let `phi(s)` be the path tangent angle, `kappa = dphi/ds` the curvature, and
`e = theta - phi` the heading error. Pen speed `u`, so `ds = u dt`.

From the inverse transform, `omega = u*sin(phi - theta)/p = -u*sin(e)/p`, hence
`dtheta/ds = -sin(e)/p`, and:

```
de/ds = -sin(e)/p - kappa            (*)
```

Everything below falls out of (*). Note it is independent of speed — this is a
purely geometric effect. Going slower does not help.

### Straight line, kappa = 0

`de/ds = -sin(e)/p`, which integrates to

```
tan(e/2) = tan(e0/2) * exp(-s/p)
```

Monotone convergence to `e = 0` with length scale `p = 55 mm`. The bot
self-aligns, exactly like a trailing caster — the pen leads, the axle follows.
This is why §5 of the spec says do not implement turn-then-drive: heading
convergence is free, and it costs zero pen error while it happens.

### Constant curvature, |kappa| = 1/a

Equilibria of (*) satisfy

```
sin(e*) = -kappa * p = -/+ p/a
```

Two cases.

**`a >= p`.** Two equilibria exist. Linearising, `d/de[-sin(e)/p] = -cos(e)/p`,
so the branch with `cos(e*) > 0` is **stable** and the other is unstable. The bot
settles into a steady **crab**: heading held at a fixed offset from the tangent,
axle centre tracing a concentric circle of radius

```
R_axle = sqrt(a^2 - p^2)
```

which is the `R_pen = sqrt(R_axle^2 + p^2) >= p` identity from §6, read
backwards. In steady state `theta = phi + e*`, so after one lap the heading
returns exactly to where it started. Nothing accumulates. Loops close.

**`a < p` (i.e. `a < 55 mm`).** Now `|sin(e)/p| <= 1/p < 1/a = |kappa|`, so
`de/ds` never changes sign. No equilibrium, no crab angle to settle into. The
tangent laps the heading: `e` decreases by `2*pi` per lap while `theta` itself
barely moves — peak yaw excursion is only `a/p` rad (the 5 mm circle test case in
§7: `2.5/55 = 2.60 deg`). The motion degenerates from a sweep into an
**oscillation**: both wheels reverse twice per lap and the chassis sits roughly
still while the wheels shuffle the pen around the loop.

Since `rR = cos(e) - (d/2p) sin(e)` and `rL = cos(e) + (d/2p) sin(e)`, both are
`sqrt(1 + (d/2p)^2) = 1.2584` times a cosine of `e`, phase-separated by
`2*atan(d/2p) = 74.7 deg`. That is the signature to look for on the strip chart.

**This is the normal regime for text.** A letter `O` at 20 mm cap height has
outer radius ~10 mm, well under 55 mm. Every bowl, every counter, every dot is in
oscillation mode. Not broken — just slow, and the one place where step
quantisation shows up worst, because the wheels spend time near zero speed where
`lambda`-sized rounding is a large fraction of the commanded motion.

## So: does direction of travel matter?

Yes, but not for the reason it first appears. Cross-track error is zero either
way. What the CW/CCW choice actually buys you:

1. **Which equilibrium, and how far to walk to it.** Reversing the loop flips the
   sign of `kappa`, which flips `e*`. Because `e` lives on a circle, entering with
   a heading outside the stable branch's short arc means `e` runs monotonically
   the *long* way round — potentially a near-full extra chassis rotation of dead
   travel before it settles. Picking the direction whose `e*` is nearer the
   current heading avoids that. This is the real win, and it is exactly the
   "depends on where the bot is compared to the line" intuition, restated in
   heading rather than position.

2. **Chassis excursion.** For `a >= p` the axle centre sits `p^2/a` inward
   radially and `p*sqrt(1-(p/a)^2)` back along the tangent. Reversing the
   direction mirrors that trailing offset. If the chassis is about to swing over
   something you care about — a clamp, the edge of the paper, an already-drawn
   region — direction choice moves it.

3. **Total wheel travel and time.** Different transients, different total
   `integral(|v_L| + |v_R|) dt`. Usually a few percent, occasionally much more
   when case 1 bites.

None of this needs a closed-form solver. The forward problem is cheap: plan both
directions, measure, keep the better one. That is what the **Direction** panel in
`penbot-sim.html` does — it runs the path forwards and reversed and reports peak
`|e|`, total wheel travel, run time, chassis bounding box, and settling length
for each.

## What is genuinely *not* modelled here

The pen is a frictionless point in this model. On real hardware, dragging a pen
sideways at `p = 55 mm` ahead of the axle applies a yaw moment about the wheels,
and lateral pen force in oscillation mode reverses twice per loop. That, plus
wheel slip, is where actual pen error will come from — not from the kinematics.
The simulator's cross-track readout is therefore a *quantisation* diagnostic, not
a prediction of real accuracy.
