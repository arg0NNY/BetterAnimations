<script setup>
import easing from '../assets/lottie/easing.json'
import overflow from '../assets/lottie/overflow.json'
</script>

# Advanced Animation Settings

This section describes [Animation Settings](./animation-settings) that are only available in [Advanced Mode](./advanced-mode).

## Easing

Controls the [easing](https://easings.net/) of the animation.

<Lottie :animation-data="easing" style="max-width: 450px;" />

**Available options:**
- **Linear**
- **Ease**
  - **Bezier** — In, Out, In Out.
  - **Style** — Sine, Quad, Cubic, Quart, Quint, Circ, Expo, Bounce.
- **Back**
  - **Bezier** — In, Out, In Out.
  - **Overshoot** — A range from 1 to 10.
- **Elastic**
  - **Bezier** — In, Out, In Out.
  - **Amplitude** — A range from 1 to 10.
  - **Period** — A range from 0.1 to 2.
- **Steps**
  - **Amount** — A range from 1 to 100.

## Overflow

Determines whether the animation can overflow its container.

<Lottie :animation-data="overflow" />

> [!NOTE]
> Some Animations may force the value of this setting if they are only meant to be used either with or without overflow.

> [!WARNING]
> [_Layers_](./modules#layers) and [_Modals -> Backdrop_](./modules#modals-backdrop) don't support Overflow setting, as their container takes up the whole Discord window, which can't be overflown.
