# Layout

Animations of every [Module](/usage/modules) has the same base layout consisting of an **Element** and a **Container**.

## Element

**Element** is an [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) animation currently executes for.
The Element is what an animation should make appear (`enter`) or disappear (`exit`).
All visual styles should be applied to the **Element**.

What the **Element** exactly is depends on a [Module](/usage/modules) — Tooltip, Popout, Message, etc.
However, for most of the Animations, what the **Element** is doesn't matter, with the exception being the Animations
made for a specific Module, most commonly for [Backdrop](/usage/modules#modals-backdrop).

To get the reference to the **Element** use inject [`element`](/reference/injects/general#element):
```json
{
  "key": "my-animation",
  "name": "My animation",
  "animate": {
    "anime": { // [!code focus:4]
      "targets": { "inject": "element" }, // [!code highlight]
      "parameters": { /* ... */ }
    }
  }
}
```

## Container

**Container** is an [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) that wraps the [**Element**](#element):

![Container & Element](../assets/img/container-element.png)

It exists for multiple purposes:
- To have a strictly defined [Containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Containing_block) and [Stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context).
- To implement [Overflow](/usage/advanced-animation-settings#overflow) setting by applying [`clip`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#clip)
  to [`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) property when disabled.
- To make [Accordion Animations](./accordions) without interfering with [**Element**](#element)'s position and size.

To get the reference to the **Container** use inject [`container`](/reference/injects/general#container):
```json
{
  "key": "my-animation",
  "name": "My animation",
  "animate": {
    "anime": { // [!code focus:4]
      "targets": { "inject": "container" }, // [!code highlight]
      "parameters": { /* ... */ }
    }
  }
}
```

## Hast

_BetterAnimations_ allows Animations to create additional custom elements required for animations by defining them
in [Hast](https://github.com/syntax-tree/hast) (**H**ypertext **A**bstract **S**yntax **T**ree) format inside [`hast`](/reference/animate#hast) property of [Animate](/reference/animate) as such:
```json
{
  "key": "my-animation",
  "name": "My animation",
  "animate": {
    "hast": { // [!code focus:27] [!code highlight:23]
      "type": "element",
      "tagName": "svg",
      "properties": {
        "className": "overlay",
        "width": "100%",
        "height": "100%",
        "viewBox": "0 0 100 100",
        "preserveAspectRatio": "none"
      },
      "children": [
        {
          "type": "element",
          "tagName": "path",
          "properties": {
            "className": "overlay__path",
            "vectorEffect": "non-scaling-stroke",
            "d": "M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z",
            "fill": "white"
          }
        }
      ]
    },
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

This definition will be transformed into the following HTML:
```html
<svg
  class="overlay"
  width="100%"
  height="100%"
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
>
  <path
    class="overlay__path"
    vector-effect="non-scaling-stroke"
    d="M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z"
    fill="white"
  />
</svg>
```

All the **root** elements defined inside [`hast`](/reference/animate#hast) will have [`position`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) property assigned to [`absolute`](https://developer.mozilla.org/en-US/docs/Web/CSS/position#absolute) by default
and will be mounted **inside** the [Container](#container) **before** the [Element](#element) while the Animation is alive:
```
Container
├── Hast Element 1
├── Hast Element 2
├── Hast Element 3
└── Element
```

> [!WARNING]
> Provided hast elements are sanitized before being inserted into DOM. See [sanitization schema](https://github.com/arg0NNY/BetterAnimations/blob/main/src/modules/animation/hastSanitizeSchema.js).

To get the reference to the created Hast elements use inject [`hast`](/reference/injects/general#hast):
```json
{
  "key": "my-animation",
  "name": "My animation",
  "animate": {
    "anime": { // [!code focus:4]
      "targets": { "inject": "hast", "selector": ".overlay" }, // [!code highlight]
      "parameters": { /* ... */ }
    }
  }
}
```

> [!TIP]
> `targets` accepts strings as selectors to target the created Hast elements. See [Targets](./anime#targets).
> 
> The equivalent to the code above is:
> ```json
> {
>   "key": "my-animation",
>   "name": "My animation",
>   "animate": {
>     "anime": { // [!code focus:4]
>       "targets": ".overlay", // [!code highlight]
>       "parameters": { /* ... */ }
>     }
>   }
> }
> ```

## CSS

_BetterAnimations_ allows Animations to mount custom CSS while alive by defining it as a representative object
inside [`css`](/reference/animate#css) property of [Animate](/reference/animate) as such:
```json
{
  "key": "my-animation",
  "name": "My animation",
  "animate": {
    "hast": [ // [!code focus:30]
      {
        "type": "element",
        "tagName": "div",
        "properties": {
          "className": "some-class"
        }
      },
      {
        "type": "element",
        "tagName": "div",
        "properties": {
          "className": "some-additional-class"
        }
      }
    ],
    "css": { // [!code highlight:10]
      ".some-class": {
        "background-color": "#FFF",
        "border-radius": "50%"
      },
      ".some-additional-class": {
        "inset": 0,
        "top": "20px"
      }
    },
    "anime": {
      "targets": ".some-class",
      "parameters": { /* ... */ }
    }
  }
}
```

This definition will be transformed into the following CSS:
```css
.some-class {
    background-color: #FFF;
    border-radius: 50%;
}
.some-additional-class {
    inset: 0;
    top: 20px;
}
```

**Selectors inside [`css`](/reference/animate#css) can only target the elements defined inside [`hast`](#hast).**
Use `{element}` and `{container}` to target an [Element](#element) and a [Container](#container) correspondingly:
```json
{
  "{element}": {
    "transform-origin": { "inject": "position" }
  },
  "{container}": {
    "z-index": 1
  }
}
```

## Switch Animations

**Enter** and **Exit** animations executing simultaneously in the scope of the same [Module](/usage/modules)
of type _Switch_ share the same **Switch Container**:
```
Switch Container
├── Container (Enter)
│   ├── Hast Element 1
│   ├── Hast Element 2
│   ├── Hast Element 3
│   └── Element
└── Container (Exit)
    ├── Hast Element 1
    ├── Hast Element 2
    ├── Hast Element 3
    └── Element
```

It cannot be accessed by either of the animations as it is used only to isolate the animations
by creating a [Containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Containing_block) and a [Stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context),
just like the regular [Container](#container).

**Switch Container**, **Container (Enter)** and **Container (Exit)** all share the same position and size.
However, **Container (Exit)** has property [`z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index) assigned to `1` by default to always overlap the **Container (Enter)**.

If you want to make **Container (Enter)** overlap **Container (Exit)** instead alter the [`z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index) property of the [Container](#container)
using the `{container}` selector inside [custom CSS](#css) as such:
```json
{
  "css": {
    "{container}": {
      "z-index": {
        "inject": "type",
        "enter": 2,
        "exit": 1
      }
    }
  }
}
```

## Inject restrictions

[`hast`](/reference/animate#hast) and [`css`](/reference/animate#css) properties of [Animate](/reference/animate)
have a limited set of injects that are allowed for use inside them:
- [Settings](/reference/injects/settings)
- [Math](/reference/injects/math)
- [Operators](/reference/injects/operators)
- [Snippets](/reference/injects/snippets)
- [`utils.random`](/reference/injects/anime#utils.random)
- [`utils.get`](/reference/injects/anime#utils.get)
- [`element`](/reference/injects/general#element)
- [`hast`](/reference/injects/general#hast)
- [`container`](/reference/injects/general#container)
- [`anchor`](/reference/injects/general#anchor)
- [`module`](/reference/injects/general#module)
- [`module.type`](/reference/injects/general#module.type)
- [`type`](/reference/injects/general#type)
- [`assign`](/reference/injects/general#assign)
- [`string.template`](/reference/injects/general#string.template)
- [`undefined`](/reference/injects/general#undefined)
- [`var.get`](/reference/injects/general#var.get)
- [`rect`](/reference/injects/general#rect)
- [`window`](/reference/injects/general#window)
- [`mouse`](/reference/injects/general#mouse)
- [`isIntersected`](/reference/injects/general#isIntersected)
- [`if`](/reference/injects/general#if)
- [`switch`](/reference/injects/general#switch)
- [`raw`](/reference/injects/general#raw)
