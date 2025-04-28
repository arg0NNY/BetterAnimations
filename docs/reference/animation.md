---
outline: deep
---

# Animation

The definition of an [Animation](/usage/basics#animations).

## Properties

### `key`

A non-empty string containing the identifier of an animation. Must be unique in a scope of a [Pack](./pack).

### `name`

A non-empty string containing the display name of an Animation.

### `modules` <Badge type="info" text="optional" />

An array of or a single string containing the key of a [Module](/usage/modules) that an Animation supports.

**Available values:** `servers`, `channels`, `settings`, `layers`, `tooltips`, `popouts`, `contextMenu`, `messages`,
`channelList`, `modals`, `modalsBackdrop`, `membersSidebar`, `threadSidebar`, `threadSidebarSwitch`.

**Aliases**:
- **`switch`**: `servers`, `channels`, `settings`, `layers`, `threadSidebarSwitch`.
- **`reveal`**: `tooltips`, `popouts`, `contextMenu`, `messages`, `channelList`, `modals`.
- **`sidebars`**: `membersSidebar`, `threadSidebar`.

**Default**:
```json
["switch", "reveal", "sidebars"]
```

### `meta` <Badge type="info" text="optional" />

Animation's [Meta](./meta).

### `settings` <Badge type="info" text="optional" />

Animation's [Settings](./settings).

### `debug` <Badge type="info" text="optional" />

A boolean indicating whether Debug Mode is enabled. See [Debug Mode](/create/debug-mode).

Also accepts `"enter"` and `"exit"` to enable Debug Mode only for a specific animation type.

## Execution definition

Execution definition of an Animation must be defined inside [`animate`](./animation#animate) property,
describing the execution for both `enter` and `exit` animation types,
or inside [`enter`](./animation#enter) and [`exit`](./animation#exit) properties,
describing execution for animation types separately.

### `enter` <Badge type="info" text="optional" />

[Animate](./animate).

### `exit` <Badge type="info" text="optional" />

[Animate](./animate).

### `animate` <Badge type="info" text="optional" />

[Animate](./animate).

> [!TIP]
> Use inject [`type`](./injects/general#type) to determine the current animation type inside `animate`.

## Example

```json
{
  "key": "fade",
  "name": "Fade",
  "modules": ["reveal", "sidebars"],
  "meta": {
    "override": { "preset": "accordion" }
  },
  "settings": {
    "duration": true,
    "easing": true,

    "defaults": {
      "duration": 200,
      "easing": { "type": "ease" },

      "override": [
        {
          "for": {
            "module": ["switch", "messages", "sidebars"]
          },
          "easing": {
            "type": "ease",
            "style": "quart"
          }
        },
        {
          "for": {
            "module": ["switch", "sidebars"]
          },
          "duration": 400
        }
      ]
    }
  },
  "animate": {
    "extends": { "inject": "accordion" },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": { "inject": "easing" },
        "opacity": {
          "inject": "type",
          "enter": {
            "inject": "isIntersected",
            "true": 1,
            "false": [0, 1]
          },
          "exit": 0
        }
      }
    }
  }
}
```