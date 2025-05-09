# Overridables

**Overridables** are object definitions properties of which can be overridden based on the set of provided conditions.

Available _Overridables_:
- [Meta](/reference/meta).
- [`defaults`](/reference/settings#defaults) property of [Settings](/reference/settings).

## Defining an override

To define an override, provide an object to `override` property of an _Overridable_
with a set of conditions inside `for` property and the list of properties to override **if all the provided conditions are met**.

```json
{
  "duration": 200,
  "easing": { "type": "back" },
  "direction": "upwards",

  "override": {
    "for": {
      "module.type": "reveal",
      "type": "exit"
    },
    "direction": "downwards"
  }
}
```

In the example above, the `direction` property will be overridden
only when the [Module](/usage/modules) is of type [_Reveal_](/usage/basics#reveal) **and** the animation is of type `exit`.

See [Conditions](#conditions) to see the full list of available conditions.

You can define multiple overrides by providing an array of overrides as such:
```json
{
  "duration": 200,
  "easing": { "type": "back" },
  "direction": "upwards",

  "override": [
    {
      "for": {
        "module.type": "reveal",
        "type": "exit"
      },
      "direction": "downwards",
      "directionTowards": true
    },
    {
      "for": {
        "module": ["switch", "modals"]
      },
      "easing": {
        "type": "ease",
        "style": "quart"
      }
    },
    {
      "for": {
        "module": "channelList"
      },
      "direction": "downwards"
    },
    {
      "for": {
        "module": "channelList",
        "type": "exit"
      },
      "direction": "upwards"
    }
  ]
}
```

Overrides are applied in the same order they are defined.

## Conditions

### `type`
Accepts a string `"enter"` or `"exit"`.

Checks if the current animation's type is equal to the specified value.

### `module.type`
Accepts a string `"reveal"` or `"switch"`.

Checks if the current [Module](/usage/modules)'s type is equal to the specified value.

### `module`
An array of or a single string representing the key of a [Module](/usage/modules). See [`modules`](/reference/animation#modules).

Checks if the specified list contains the current [Module](/usage/modules)'s key.

## Presets

Specific _Overridables_ can provide **override presets**. Refer to the [Reference](/reference/pack) of a specific _Overridable_ to see the list of presets it provides.

Example usage of a preset [`accordion`](/reference/meta#presets-accordion) for the [Meta](/reference/meta):
```json
{
  "meta": {
    "override": [
      { "preset": "accordion" }, // [!code highlight]
      {
        "for": {
          "type": "enter"
        },
        "intersect": false
      }
    ]
  }
}
```

This definition is the equivalent of:
```json
{
  "meta": {
    "override": [
      { // [!code highlight:13]
        "for": {
          "module": ["messages", "membersSidebar", "threadSidebar"]
        },
        "accordion": false
      },
      {
        "for": {
          "module": "messages",
          "type": "exit"
        },
        "accordion": true
      },
      {
        "for": {
          "type": "enter"
        },
        "intersect": false
      }
    ]
  }
}
```
