# Injects

_Injects_ are contextual functions allowing animations to be dynamic.
They provide useful utilities and customizability.

> [!IMPORTANT]
> _Injects_ can be used only inside specific properties of an animation — _injectables_. See [Animate](/reference/animate).

## Basic usage

To call an inject declare `inject` property with the name of the inject you want to call
anywhere inside _injectable_ and pass **parameters** that this specific inject accepts.

For example, inject <InjectRef inject="element" />, according to <InjectRef inject="element" text="Reference" />, when used with no parameters,
returns a reference to an animating [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element):
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "anime": { // [!code focus:11]
      "targets": { "inject": "element" }, // [!code highlight]
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
```js {3}
import { animate } from 'animejs'

animate(element, { // `element` is a reference to an animating `Element`
  duration: 200,
  ease: 'inOutSine',
  opacity: {
    from: 0,
    to: 1
  }
})
```

However, according to the same <InjectRef inject="element" text="Reference" />, it may accept optional parameters
`selector` and `multiple` to query elements inside an animating element:
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "anime": { // [!code focus:16]
      "targets": { "inject": "element" }, // [!code --]
      "targets": { // [!code ++:5]
        "inject": "element",
        "selector": ".some-class",
        "multiple": true
      },
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
```js {3}
import { animate } from 'animejs'

animate(element.querySelectorAll('.some-class'), {
  duration: 200,
  ease: 'inOutSine',
  opacity: {
    from: 0,
    to: 1
  }
})
```

To consolidate, let's try to use inject <InjectRef inject="type" />, which, according to <InjectRef inject="type" text="Reference" />, when declared with parameters
`enter` and `exit`, will return the value passed under the property corresponding to the current animation type:
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "anime": { // [!code focus:15]
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": { // [!code highlight:8]
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        }
      }
    }
  }
}
```

When parsed in the context of animation type `enter` it will result in the following:
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "anime": { // [!code focus:15]
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": { // [!code highlight:4]
          "from": 0,
          "to": 1
        }
      }
    }
  }
}
```

When parsed in the context of animation type `exit`:
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "anime": { // [!code focus:15]
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": 0 // [!code highlight]
      }
    }
  }
}
```

## Lazy Injects

_Lazy Injects_ (or _Callbacks_), unlike regular _injects_, which are parsed immediately,
transform into function and parse their contents only when this function is called.

One of the most commonly used _lazy inject_ is <InjectRef inject="var.set" />,
which sets the <InjectRef inject="var.set" parameter="value" /> to the variable under the specified <InjectRef inject="var.set" parameter="name" />:
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "onBeforeCreate": { // [!code focus:27] [!code highlight:12]
      "inject": "var.set",
      "name": "opacity",
      "value": {
        "inject": "type",
        "enter": {
          "from": 0,
          "to": 1
        },
        "exit": 0
      }
    },
    "anime": {
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        }
      }
    }
  }
}
```

> [!TIP]
> This example uses _hook_ `onBeforeCreate`. Hooks are covered at [Lifecycle](./lifecycle).
> 
> At the moment all you have to know is that any function (_lazy inject_) passed to `onBeforeCreate`
> will be called right before `anime` property is parsed.

To get the value of the variable named `opacity` we just assigned using <InjectRef inject="var.set" />,
we'll need to use inject <InjectRef inject="var.get" />:
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "onBeforeCreate": { // [!code focus:31]
      "inject": "var.set",
      "name": "opacity",
      "value": {
        "inject": "type",
        "enter": {
          "from": 0,
          "to": 1
        },
        "exit": 0
      }
    },
    "anime": {
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": { // [!code --:8]
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "opacity": { // [!code ++:4]
          "inject": "var.get",
          "name": "opacity"
        }
      }
    }
  }
}
```

This will execute the following code when animation is triggered:
```js
import { animate } from 'animejs'

const type = 'enter'
const vars = {}

const onBeforeCreate = () => {
  vars['opacity'] = {
    enter: {
      from: 0,
      to: 1
    },
    exit: 0
  }[type]
}

onBeforeCreate()

animate(element, {
  duration: 200,
  ease: 'inOutSine',
  opacity: vars['opacity']
})
```

> [!NOTE]
> The code above is a simplified version of what actually happens in _BetterAnimations_ when animation
> is being executed.
> 
> It is only to give the general idea of how Animation Lifecycle works. Learn more at [Lifecycle](./lifecycle).

To get the values of the arguments received by the _lazy inject_ use inject <InjectRef inject="arguments" />:
```json
{
  "key": "myAnimation",
  "name": "My Animation",
  "animate": {
    "anime": { // [!code focus:15]
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "scale": {
          "inject": "function",
          "return": {
            "a": { "inject": "arguments", "index": 2 }, // [!code highlight]
            "inject": "-",
            "b": { "inject": "arguments", "index": 1 } // [!code highlight]
          }
        }
      }
    }
  }
}
```

## Reference

We have only covered a handful of injects out of many more provided by _BetterAnimations_.
Navigate to [Reference](/reference/injects/general) to see all of them.
