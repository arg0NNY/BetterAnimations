
# Injects

A contextual functions for [`AnimateOptions`](AnimateOptions.md).
Gives useful utilities for developers and allows animations to be customizable.
Gets precompiled before the animation starts.

---

## `node` _(renamed to `element`)_
- **Allowed inside:** [`anime`](AnimateOptions.md#anime)

**Parameters:**

- `querySelector?`: `String`
- `querySelectorAll?`: `String`

Returns the result of executing the `querySelector` or `querySelectorAll` on the animating element,
if such parameters were provided. Otherwise, it returns an animating element itself.

> Providing both `querySelector` and `querySelectorAll` to a single inject will cause an error.

**Returns:** `Array<HTMLElement>` if `querySelectorAll` was provided, otherwise `HTMLElement`

**Example:**
```json
{
  "anime": {
    "targets": [
      ".el",
      { "inject": "node" },
      { "inject": "node", "querySelectorAll": ".scrollerInner__059a5 > *" }
    ],
    /* ... */
  }
}
```

---

## `anime.stagger`
- **Allowed inside:** [`anime`](AnimateOptions.md#anime)

**Parameters:**

- `value`: `Number | String | Array`
- `options?`: `Object`

Gives ability to use `anime.stagger`.

Visit [anime.js documentation](https://animejs.com/documentation/#staggeringBasics) for more info.

**Example:**
```json
{
  "anime": {
    "targets": ".staggering-start-value-demo .el",
    "translateX": 270,
    "delay": {
      "inject": "anime.stagger",
      "value": 100,
      "options": {
        "start": 500
      }
    }
  }
}
```

**Result:**
```js
anime({
  targets: '.staggering-start-value-demo .el',
  translateX: 270,
  delay: anime.stagger(100, { start: 500 })
})
```

---

## `anime.timeline`
- **Allowed inside:** [`anime`](AnimateOptions.md#anime)

**Parameters:**

- `parameters?`: `Object`
- `children?`: `Array`
  - `parameters`: `Object`
  - `offset?`: `String | Number`

Gives ability to use `anime.timeline`.

Visit [anime.js documentation](https://animejs.com/documentation/#timelineBasics) for more info.

**Example:**
```json
{
  "anime": {
    "inject": "anime.timeline",
    "parameters": {
      "easing": "easeOutExpo",
      "duration": 750
    },
    "children": [
      {
        "targets": ".basic-timeline-demo .el.square",
        "translateX": 250
      },
      {
        "targets": ".basic-timeline-demo .el.circle",
        "translateX": 250
      },
      {
        "targets": ".basic-timeline-demo .el.triangle",
        "translateX": 250
      }
    ]
  }
}
```

**Result:**
```js
anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
})
  .add({
    targets: '.basic-timeline-demo .el.square',
    translateX: 250,
  })
  .add({
    targets: '.basic-timeline-demo .el.circle',
    translateX: 250,
  })
  .add({
    targets: '.basic-timeline-demo .el.triangle',
    translateX: 250,
  })
```

---

## `variant`
- **Allowed inside:** [`hast`](AnimateOptions.md#hast), [`css`](AnimateOptions.md#css), [`anime`](AnimateOptions.md#anime)

**Parameters:**

- `variantKey1`: `any`
- `variantKey2`: `any`
- ...and so on for every key declared in the animation settings

Returns a provided value under the specific key which corresponds to the variant selected by user in the settings.

Requires declared `variant` property inside `settings` if used.

Can be used anywhere, but most useful is in pair with [`Object.assign`](#objectassign) inject.

**Example:**
```json
{
  /* ... */
  "settings": {
    "variant": [
      { "key": "up", "name": "Up" },
      { "key": "down", "name": "Down" },
      { "key": "left", "name": "Left" },
      { "key": "right", "name": "Right" }
    ]
    /* ... */
  },
  "enter": {
    "anime": {
      "inject": "Object.assign",
      "target": {
        "targets": ".el",
        "duration": 400
        /* ... */
      },
      "source": {
        "inject": "variant",
        "up": { "translateY": ["100%", 0] },
        "down": { "translateY": ["-100%", 0] },
        "left": { "translateX": ["100%", 0] },
        "right": { "translateX": ["-100%", 0] }
      }
    }
  }
  /* ... */
}
```

---

## `type`
- **Allowed inside:** [`hast`](AnimateOptions.md#hast), [`css`](AnimateOptions.md#css), [`anime`](AnimateOptions.md#anime)

**Parameters:**

- `enter`: `any`
- `exit`: `any`

Returns a provided value under the `enter` or `exit` key which corresponds to the current type of animation.

Useful inject to use inside `animate` to determine what type of animation needed to be executed and to insert
corresponding values.

Can be used anywhere, but most useful is in pair with [`Object.assign`](#objectassign) inject.

> Note that you most probably shouldn't use this inject for animations declared inside `enter` and `exit` properties,
> since the types are already separated that way.

**Example:**
```json
{
  "animate": {
    /* ... */
    "anime": {
      "inject": "Object.assign",
      "target": {
        "targets": ".el",
        "duration": 500
      },
      "source": {
        "inject": "type",
        "enter": { "translateY": ["100%", 0] },
        "exit": { "translateY": [0, "-100%"] }
      }
    }
  }
}
```

**Result:**
```js
// If animation type is `enter`
anime({
  targets: '.el',
  duration: 500,
  translateY: ['100%', 0]
})

// If animation type is `exit`
anime({
  targets: '.el',
  duration: 500,
  translateY: [0, '-100%']
})
```

---

## `Object.assign`
- **Allowed inside:** [`hast`](AnimateOptions.md#hast), [`css`](AnimateOptions.md#css), [`anime`](AnimateOptions.md#anime)

**Parameters:**

- `target`: `Object`
- `source`: `Array | Object`

Acts the same way as a native [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

You can add multiple sources by providing an array to the `source` parameter.

Can be used anywhere, but most useful is in pair with [`variant`](#variant) and [`type`](#type) injects.

**Returns:** `Object`

**Examples:** See [`variant`](#variant) or [`type`](#type).

---

## `duration`

- **Allowed inside:** [`anime`](AnimateOptions.md#anime)

Returns duration in milliseconds set by user in settings.

Requires declared `duration` property inside `settings` if used.

**Returns:** `Number`

**Example:**
```json
{
  "anime": {
    "targets": ".el",
    "duration": { "inject": "duration" },
    "translateY": ["100%", 0]
  }
}
```

---

## `easing`

- **Allowed inside:** [`anime`](AnimateOptions.md#anime)

Returns easing set by user in settings.

Requires declared `easing` property inside `settings` if used.

**Returns:** `String`

**Example:**
```json
{
  "anime": {
    "targets": ".el",
    "easing": { "inject": "easing" },
    "translateY": ["100%", 0]
  }
}
```
