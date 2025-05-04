<script setup>
import intersection from '../assets/lottie/intersection.json'
</script>

# Intersection

_BetterAnimations_ intersects Animation instances to create seamless transitions between unfinished Enter and Exit
animations.

<Lottie :animation-data="intersection" />

> [!NOTE]
> Intersection happens only if [Module](/usage/modules) is of type [_Reveal_](/usage/basics#reveal)
> and [Animation](/reference/animation), [Module](/usage/modules) and [Element](./layout#element) are exactly the same for both Animation instances.

## Handling Intersections

Let's take a simple Fade animation as an example:
```json
{
  "key": "fade",
  "name": "Fade",
  "animate": {
    "anime": {
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 400,
        "ease": "inOutSine",
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": {
            "from": 1,
            "to": 0
          }
        }
      }
    }
  }
}
```

This animation works completely fine, but it lacks support for intersections, as it always sets [`from`](https://animejs.com/documentation/animation/tween-parameters/from) value,
ignoring the fact that the actual `opacity` may differ if previous Animation instance didn't have time to finish its work.

To add support for intersections the Animation, we'll have to cover two cases:
1. **Exit animation intersects with Enter animation** (Exit started before Enter finished)
2. **Enter animation intersects with Exit animation** (Enter started before Exit finished)

Let's start with the first one:
```json
{
  "key": "fade",
  "name": "Fade",
  "animate": {
    "anime": {
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 400,
        "ease": "inOutSine",
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": { // [!code --:4]
            "from": 1,
            "to": 0
          },
          "exit": 0 // [!code ++]
        }
      }
    }
  }
}
```

In this case we may simply remove [`from`](https://animejs.com/documentation/animation/tween-parameters/from) value, as it doesn't matter from what `opacity` animation starts as long as it
ends on `0`. [Anime](./anime) will automatically set [`from`](https://animejs.com/documentation/animation/tween-parameters/from) value equal to the current `opacity`.

Covering the second case is a bit more complex:
```json
{
  "key": "fade",
  "name": "Fade",
  "animate": {
    "anime": {
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 400,
        "ease": "inOutSine",
        "opacity": {
          "inject": "type",
          "enter": { // [!code --:4]
            "from": 0,
            "to": 1
          },
          "enter": { // [!code ++:8]
            "inject": "isIntersected",
            "true": 1,
            "false": {
              "from": 0,
              "to": 1
            }
          },
          "exit": 0
        }
      }
    }
  }
}
```

Here we couldn't just simply remove [`from`](https://animejs.com/documentation/animation/tween-parameters/from) value and set [`to`](https://animejs.com/documentation/animation/tween-parameters/to) to `1` like we did with the previous case,
as the [Element](./layout#element) has opacity `1` by default, so there will be no visible animation under normal circumstances, since it will animate `opacity` from `1` to `1`.

To fix this issue, we used inject <InjectRef inject="isIntersected" /> to cover two cases:
- **If intersected** (`isIntersected` is `true`)

  If animation has been intersected, we can certainly tell that the current `opacity` value will be in some intermediate
  state between `0` and `1`, since the previous Animation instance has not been cleared yet (see [Lifecycle](./lifecycle)).
  
  In such a case, we can simply define only [`to`](https://animejs.com/documentation/animation/tween-parameters/to) value and let [Anime](./anime) automatically determine [`from`](https://animejs.com/documentation/animation/tween-parameters/from) value.
- **If NOT intersected** (`isIntersected` is `false`)

  If animation has not been intersected, `opacity` will be in its original state (which is `1` by default),
  since no Animation has altered it.
  
  In such a case, we must define both [`from`](https://animejs.com/documentation/animation/tween-parameters/from) and [`to`](https://animejs.com/documentation/animation/tween-parameters/to) values to execute an animation from `0` to `1`.

> [!TIP]
> The process of adding support for intersections for properties other than `opacity` is relatively the same.
> You may explore the [source code](https://github.com/arg0NNY/BetterAnimations/blob/main/src/packs/preinstalled.pack.json) of a preinstalled pack to see more examples of Intersection handling.

## Disabling Intersections

If your Animation doesn't support Intersections, you should explicitly disable it by passing `false`
to [`intersect`](/reference/meta#intersect) inside [`meta`](/reference/meta):
```json
{
  "key": "fade",
  "name": "Fade",
  "meta": { // [!code ++:3]
    "intersect": false
  },
  "animate": {
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

> [!WARNING]
> Disabling Intersections is not recommended.
> 
> It's acceptable only if Animation simply can't intersect or intersection support introduces excessive complexity.
