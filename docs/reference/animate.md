---
outline: deep
---

# Animate

Execution definition of an [Animation](./animation).

Must be defined inside [`animate`](./animation#animate) property or [`enter`](./animation#enter) and [`exit`](./animation#exit) properties of an [Animation](./animation).

> [!IMPORTANT]
> All the hooks and properties are injectable. See [Injects](/create/injects).

> [!TIP]
> All the hooks and properties accept nested arrays and `null`
> for convenience and easily extendable animations. See [Extending Animations](/create/extending-animations).

## Hooks

Hooks are callbacks executed on specific points in Animation's [Lifecycle](/create/lifecycle).
Accepts an array of or a single function. Most common use-case is with [Lazy Injects](/create/injects#lazy-injects).

**Example:**
```json
{
  "onBeforeCreate": [
    {
      "inject": "var.set",
      "name": "variableName",
      "value": {
        "inject": "type",
        "enter": 5,
        "exit": 10
      }
    },
    {
      "inject": "debug",
      "data": "onBeforeCreate triggered!"
    }
  ]
}
```

### `onBeforeExtend` <Badge type="info" text="optional" />

A hook triggered before [`extends`](#extends) is parsed. 

### `onBeforeLayout` <Badge type="info" text="optional" />

A hook triggered before [`hast`](#hast) and [`css`](#css) are parsed.

### `onBeforeCreate` <Badge type="info" text="optional" />

A hook triggered before [`anime`](#anime) is parsed.

### `onCreated` <Badge type="info" text="optional" />

A hook triggered after [`anime`](#anime) is parsed and before [Accordion](/create/accordions) is executed (if enabled).

### `onBeforeBegin` <Badge type="info" text="optional" />

A hook triggered before [`play()`](https://animejs.com/documentation/animation/animation-methods/play) is called on the created [Anime instances](/create/anime).

### `onCompleted` <Badge type="info" text="optional" />

A hook triggered after all [Anime instances](/create/anime) finish ([`then()` callback](https://animejs.com/documentation/animation/animation-callbacks/then) is triggered).

### `onBeforeDestroy` <Badge type="info" text="optional" />

A hook triggered after animation is cancelled, whether by finishing or forcibly, before starting the clearing process.

### `onDestroyed` <Badge type="info" text="optional" />

A hook triggered after the clearing process.

## Properties

### `extends` <Badge type="info" text="optional" />

An array of or a single [Animate](./animate) definition.
All the hooks and properties of each item will be prepended to the root ones.
See [Extending Animations](/create/extending-animations).

### `hast` <Badge type="info" text="optional" />

An array of or a single hast [`Element`](https://github.com/syntax-tree/hast?tab=readme-ov-file#element) definition of elements to be mounted while the Animation is alive. See [Layout](/create/layout#hast).

> [!WARNING]
> Provided hast elements are sanitized before being inserted into DOM. See [sanitization schema](https://github.com/arg0NNY/BetterAnimations/blob/main/src/modules/animation/hastSanitizeSchema.js).

> [!WARNING]
> `hast` has a limited set of injects that are allowed for use inside it. See [Layout](/create/layout#inject-restrictions).

**Example:**
```json
{
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
        "fill": "var(--bg-base-tertiary)"
      }
    }
  ]
}
```

### `css` <Badge type="info" text="optional" />

An object representing the CSS to be mounted while the Animation is alive. See [Layout](/create/layout#css).

Selectors can only target the elements defined inside [`hast`](#hast). Use `{element}` and `{container}` to target an animating element and a container correspondingly.

> [!WARNING]
> `css` has a limited set of injects that are allowed for use inside it. See [Layout](/create/layout#inject-restrictions).

**Example:**
```json
{
  "{element}": {
    "transform-origin": { "inject": "position" }
  },
  "{container}": {
    "z-index": 1
  },
  ".my-element": {
    "inset": 0,
    "z-index": 5
  }
}
```

### `anime` <Badge type="info" text="optional" />

An array of or a single [Anime](./anime) definition. At least one Anime instance must be defined. See [Anime](/create/anime).

Can be omitted if instances are defined inside [`extends`](#extends).

**Example:**
```json
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
}
```
