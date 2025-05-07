<script setup>
import switchAnimations from '../assets/lottie/switch-animations.json'
import switchAnimationsMixing from '../assets/lottie/switch-animations-mixing.json'
</script>

# Switch Animations In-depth

Switch Animations are actually the same as plain [Animations](./basics#animations). The only difference is that Enter and Exit animations
of a Switch Animation execute in parallel when the switch happens.

That's why it is important not to think about Switch Animations as a separate concept. Switch Animations are just
plain [Animations](./basics#animations) that are executed in [Modules](./modules) of type [_Switch_](./basics#switch).

## Understanding Switch Animations

Let's take [_Servers_](./modules#servers) as an example. When you switch from one Discord Server to another, it executes two animations:
- Exit animation for the Server you are currently on
- Enter animation for the Server you are switching to

When combined, it looks like one animation:

<Lottie :animation-data="switchAnimations" />

All the other Switch Modules execute [Animations](./basics#animations) by the exact same principle.

## Mixing Switch Animations

Since the Switch Modules execute two different animations, we can select different Animations for each of them.
To unlock the ability to configure the Enter and Exit animations of Switch Modules separately, enable [Advanced Mode](./advanced-mode).

<Lottie :animation-data="switchAnimationsMixing" />
