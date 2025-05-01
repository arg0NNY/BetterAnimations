# Anime

_BetterAnimations_ uses [Anime JavaScript Animation Engine](https://animejs.com/) to define its animations.

> [!IMPORTANT]
> It is highly recommended to get familiar with [Anime Documentation](https://animejs.com/documentation) before proceeding further.

## Defining an instance

An Animation must have an Anime instance defined to be executed. To define an instance you'll need to
pass **targets** and **parameters** to `anime` property of [Animate](/reference/animate) definition.

```json
{
  "key": "my-animation",
  "name": "My animation",
  "animate": {
    "anime": { // [!code focus:11]
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": {
          "from": 0,
          "to": 1
        }
      }
    }
  }
}
```

This will execute the following code when animation is triggered:
```js
import { animate } from 'animejs'

animate(element, {
  duration: 200,
  ease: 'inOutSine',
  opacity: {
    from: 0,
    to: 1
  }
})
```

> [!TIP]
> This example uses inject [`element`](/reference/injects/general#element). Injects are covered at [Injects](./injects).
> 
> At the moment all you have to know is that `{ "inject": "element" }` will be replaced with an instance
> of an [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) animation currently executes for. See [Layout](./layout#element).

## Targets

`targets` accepts an [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) or a string containing a [selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors).
At least one target must be specified.

You can also specify multiple targets and have a nested array if needed:
```json
{
  "targets": [
    { "inject": "element" },
    [
      "#element-id",
      ".selector-1"
    ],
    ".selector-2"
  ]
}
```

This will target `element` and all the elements matching the selectors: `#element-id`, `.selector-1`, `.selector-2`.

> [!IMPORTANT]
> Target selectors can only target elements created by an Animation. Refer to [Layout](./layout#hast).

## Parameters

`parameters` accepts an object containing Anime parameters. Refer to [Anime Documentation](https://animejs.com/documentation).

> [!NOTE]
> [`autoplay`](https://animejs.com/documentation/animation/animation-playback-settings/autoplay) parameter is used by _BetterAnimations_ and will be ignored if specified in an instance.

## WAAPI

_BetterAnimations_ creates a plain [`Animation`](https://animejs.com/documentation/animation) instance by default.
However, it is highly recommended to use `WAAPI` ([Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)) when possible as a much better alternative to plain JS animation performance-wise.

Refer to [Anime Documentation](https://animejs.com/documentation/web-animation-api) to learn about WAAPI animations and [when they can be used](https://animejs.com/documentation/web-animation-api/when-to-use-waapi).

To create a [`WAAPI`](https://animejs.com/documentation/web-animation-api) instance instead of a plain [`Animation`](https://animejs.com/documentation/animation) explicitly specify a type `waapi`:
```json
{
  "anime": {
    "type": "waapi", // [!code ++]
    "targets": { "inject": "element" },
    "parameters": {
      "duration": 200,
      "ease": "inOutSine",
      "opacity": {
        "from": 0,
        "to": 1
      }
    }
  }
}
```

This will execute the following code when animation is triggered:
```js
import { waapi } from 'animejs'

waapi.animate(element, {
  duration: 200,
  ease: 'inOutSine',
  opacity: {
    from: 0,
    to: 1
  }
})
```

## Timer

To create a [`Timer`](https://animejs.com/documentation/timer) specify a type `timer`:

```json {3}
{
  "anime": {
    "type": "timer",
    "parameters": {
      "duration": 200
    }
  }
}
```

This will execute the following code when animation is triggered:
```js
import { createTimer } from 'animejs'

createTimer({
  duration: 200
})
```

## Timeline

To create a [`Timeline`](https://animejs.com/documentation/timeline) specify a type `timeline` and pass a non-empty array of `children`:
```json {3,9-36}
{
  "anime": {
    "type": "timeline",
    "parameters": {
      "defaults": {
        "duration": 750
      }
    },
    "children": [
      {
        "type": "label",
        "name": "start"
      },
      {
        "targets": ".square",
        "parameters": {
          "x": "15rem"
        },
        "position": 500
      },
      {
        "targets": ".circle",
        "parameters": {
          "x": "15rem"
        },
        "position": "start"
      },
      {
        "targets": ".triangle",
        "parameters": {
          "x": "15rem",
          "rotate": "1turn"
        },
        "position": "<-=500"
      }
    ]
  }
}
```

This will execute the following code when animation is triggered:
```js
import { createTimeline } from 'animejs'

const tl = createTimeline({
  defaults: { duration: 750 }
})

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500')
```

## Multiple instances

You can create multiple Anime instances by passing an array of instance definitions:
```json
{
  "anime": [
    {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": {
          "from": 0,
          "to": 1
        }
      }
    },
    {
      "type": "timer",
      "parameters": {
        "duration": 400
      }
    }
  ]
}
```

This will execute the following code when animation is triggered:
```js
import { waapi, createTimer } from 'animejs'

waapi.animate(element, {
  duration: 200,
  ease: 'inOutSine',
  opacity: {
    from: 0,
    to: 1
  }
})

createTimer({
  duration: 200
})
```

An animation will be considered finished when all of its instances finish ([`then()` callback](https://animejs.com/documentation/animation/animation-callbacks/then) is triggered).
