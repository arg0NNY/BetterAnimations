
# `AnimateOptions`

An object describing the handling of the animation.

---

## `hast`

- **Required:** ❌
- **Type:** `Array | Object`
- **Allowed injects**: [`variant`](Injects.md#variant), [`type`](Injects.md#type), [`Object.assign`](Injects.md#objectassign)

Required HTML for the animation represented in [hast](https://github.com/syntax-tree/hast).
Can be easily generated using [hastscript](https://github.com/syntax-tree/hastscript). Can be
an array of hast `Element` or a single one.

Gets inserted in the root of the animation wrapper **right before** animating element while animation is being played.
All the root elements have `position: absolute` by default.

> Note that provided tree gets sanitized according to [this schema](https://github.com/syntax-tree/hast-util-sanitize/blob/e9dba3269d2750d99f3334883b9e09aec77b69e0/lib/schema.js)
before being inserted into DOM for safety purposes, with an exception to `className` attribute, which is allowed for any element.

#### Example:
```json
{
  "hast": [
    {
      "type": "element",
      "tagName": "div",
      "properties": {
        "className": "el"
      }
    }
  ]
}
```

---

## `css`
- **Required:** ❌
- **Type:** `Object`
- **Allowed injects**: [`variant`](Injects.md#variant), [`type`](Injects.md#type), [`Object.assign`](Injects.md#objectassign)

Required CSS for the animation represented as an object, where the keys are selectors and
the values are the sets of CSS properties.

Gets inserted into DOM while animation is being played.

For example, this JSON:
```json
{
  ".el": {
    "inset": 0,
    "z-index": 20
  },
  ".el:nth-child(odd)": {
    "background": "#fff"
  }
}
```

Gets transpiled into this CSS:
```css
.el {
    inset: 0;
    z-index: 20;
}
.el:nth-child(odd) {
    background: #fff;
}
```

However, you can only target elements that you've created using `hast` property,
with a single exception to animating element, which you can target using `{node}`
as a selector, for example:
```json
{
  "{node}": {
    "background": "#fff"
  }
}
```

---

## `anime`
- **Required:** ✅
- **Type:** `Array | Object`
- **Disallowed injects**: [`type`](Injects.md#type) if using inside `enter` or `exit`

An array of [anime.js configurations](https://animejs.com/documentation/) or a single one.

Gets executed when the animation starts. Animation marks as finished when all the
provided anime instances resolve their `finished` promises.

Everything acts like normal usage of [anime.js](https://animejs.com), with a couple of specifics:

- You can only target elements that you've created using `hast` property,
  with an exception to animating element, which you can target using `node` inject,
  and to anything inside it, using `querySelector` or `querySelectorAll` params in the
  `node` inject. For example:

  ```json
  {
    "targets": [
      ".el",
      { "inject": "node" },
      { "inject": "node", "querySelectorAll": ".scrollerInner__059a5 > *" }
    ]
  }
  ```

- You can use `anime.stagger` and `anime.timeline` using corresponding [injects](Injects.md#animestagger).

#### Example:
```json
{
  "anime": [
    {
      "targets": [".el", { "inject": "node" }],
      "delay": {
        "inject": "anime.stagger",
        "value": 80
      },
      "duration": { "inject": "duration" }, // Injects duration set by user in settings
      "easing": { "inject": "easing" }, // Injects easing set by user in settings
      "translateY": ["100%", 0]
    }
  ]
}
```
