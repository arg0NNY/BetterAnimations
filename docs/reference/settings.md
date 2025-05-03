---
outline: deep
---

# Settings

The definition of the settings of an [Animation](./animation).

Defined inside the [`settings`](./animation#settings) property of an [Animation](./animation).

## Properties

### `duration` <Badge type="info" text="optional" />

Activates the [Duration](/usage/animation-settings#duration) setting for an Animation when defined.

Accepts `true` or an object containing the following properties:
- **`from`** — A minimal duration of an animation in milliseconds. Must be greater than or equal to `100` and multiple of `100`.
- **`to`** — A maximal duration of an animation in milliseconds. Must be lesser than or equal to `5000` and multiple of `100`.

`to` must be greater than `from`.

`true` is an alias for:
```json
{ "from": 100, "to": 2000 }
```

> [!TIP]
> Use inject [`duration`](./injects/settings#duration) to get the current value of this setting.

### `easing` <Badge type="info" text="optional" />

Activates the [Easing](/usage/advanced-animation-settings#easing) setting for an Animation when defined.

Accepts `true`.

> [!TIP]
> Use inject [`easing`](./injects/settings#easing) to get the current value of this setting.

### `variant` <Badge type="info" text="optional" />

Activates the [Variant](/usage/animation-settings#variant) setting for an Animation when defined.

Accepts a non-empty array of objects containing the following properties:
- **`key`** — A string containing the unique key of a variant.
- **`name`** — A string containing the display name of a variant.

> [!TIP]
> Use inject [`variant`](./injects/settings#variant) to get the current value of this setting.

### `position` <Badge type="info" text="optional" />

Activates the [Position](/usage/animation-settings#position) setting for an Animation when defined.

Accepts `true`, `"precise"`, `"enum"`, `"simple"` or a non-empty array of values:
`"top left"`, `"top"`, `"top right"`, `"left"`, `"center"`, `"right"`,
`"bottom left"`, `"bottom"`, `"bottom right"`.

`true` is an alias for: `"precise"`. Refer to [Create](/create/settings#position) to learn about [_Precise_ mode](/create/settings#position-precise).

`"enum"` is an alias for:
```json
["top left", "top", "top right", "left", "center", "right", "bottom left", "bottom", "bottom right"]
```

`"simple"` is an alias for:
```json
["top", "bottom", "left", "right", "center"]
```

> [!TIP]
> Use inject [`position`](./injects/settings#position) to get the current value of this setting.

### `direction` <Badge type="info" text="optional" />

Activates the [Direction](/usage/animation-settings#direction) setting for an Animation when defined.

Accepts `true` or a non-empty array of values: `"upwards"`, `"downwards"`, `"leftwards"`, `"rightwards"`,
`"forwards"`, `"backwards"`.

`true` is an alias for:
```json
["upwards", "downwards", "leftwards", "rightwards"]
```

> [!TIP]
> Use inject [`direction`](./injects/settings#direction) to get the current value of this setting.

### `overflow` <Badge type="info" text="optional" />

A boolean indicating whether the [Overflow](/usage/advanced-animation-settings#overflow) setting
is configurable when an Animation is selected. See [Settings](/create/settings#overflow).

### `defaults`

An [Overridable](/create/overridables) containing the default values for Animation's settings.
Must specify a value for all the defined settings of an Animation.

#### `duration` {#defaults-duration}

An integer in the range specified in [`duration`](#duration).

#### `easing` {#defaults-easing}

[Easing](./easing).

#### `variant` {#defaults-variant}

A string containing the unique key of a variant defined in [`variant`](#variant).

#### `position` {#defaults-position}

If [`position`](#position) is set to `"precise"`, any of:
`"top left"`, `"top"`, `"top right"`, `"left"`, `"center"`, `"right"`,
`"bottom left"`, `"bottom"`, `"bottom right"`.

Otherwise, any of the values specified in [`position`](#position).

#### `positionPreserve` <Badge type="info" text="optional" /> {#defaults-positionpreserve}

A boolean. Specify to override the default value for _Preserve_ option of [Auto-Position](/usage/animation-settings#position-auto).

[`position`](#position) must be defined to use this property.

#### `direction` {#defaults-direction}

Any of the values specified in [`direction`](#direction).

#### `directionAxis` <Badge type="info" text="optional" /> {#defaults-directionaxis}

Any of:
- `"x"` — if [`direction`](#direction) defines `"rightwards"` and `"leftwards"`.
- `"y"` — if [`direction`](#direction) defines `"downwards"` and `"upwards"`.
- `"z"` — if [`direction`](#direction) defines `"backwards"` and `"forwards"`.

Specify to override the default value for _Axis_ option of [Auto-Direction](/usage/animation-settings#direction-auto).

[`direction`](#direction) must be defined to use this property.

#### `directionReverse` <Badge type="info" text="optional" /> {#defaults-directionreverse}

A boolean. Specify to override the default value for _Reverse_ option of [Auto-Direction](/usage/animation-settings#direction-auto).

[`direction`](#direction) must be defined to use this property.

#### `directionTowards` <Badge type="info" text="optional" /> {#defaults-directiontowards}

A boolean. Specify to override the default value for _Towards_ option of [Auto-Direction](/usage/animation-settings#direction-auto).

[`direction`](#direction) must be defined to use this property.

#### `overflow` {#defaults-overflow}

A boolean.

## Example

```json
{
  "duration": true,
  "easing": true,
  "position": true,
  "direction": ["forwards", "backwards"],

  "defaults": {
    "duration": 200,
    "easing": { "type": "back" },
    "position": "center",
    "direction": "backwards",

    "override": [
      {
        "for": {
          "type": "exit",
          "module.type": "reveal"
        },
        "direction": "forwards"
      },
      {
        "for": {
          "module.type": "switch"
        },
        "easing": {
          "type": "ease",
          "style": "cubic"
        }
      },
      {
        "for": {
          "module": ["messages", "channelList"]
        },
        "position": "left"
      }
    ]
  }
}
```
