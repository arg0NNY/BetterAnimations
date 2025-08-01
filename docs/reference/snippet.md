---
outline: deep
---

# Snippet

The definition of a [Snippet](/create/snippets).

## Properties

### `key`

A string representing the identifier of the snippet.

### `params`

An object containing the default values for the parameters of the snippet. See [Snippets](/create/snippets#parameters).

### `value`

_Injectable_ Snippet contents. See [Injects](/create/injects).

> [!TIP]
> Use inject <InjectRef inject="snippet.params" /> to get the value of a parameter.

## Example

```json
{
  "key": "directionalTranslate",
  "params": {
    "value": 5,
    "negativeValue": -5
  },
  "value": {
    "inject": "vector",
    "values": {
      "inject": "type",
      "enter": {
        "inject": "isIntersected",
        "true": {
          "inject": "direction",
          "upwards": { "y": 0 },
          "downwards": { "y": 0 },
          "leftwards": { "x": 0 },
          "rightwards": { "x": 0 }
        },
        "false": {
          "inject": "direction",
          "upwards": { "y": [{ "inject": "snippet.params", "name": "value" }, 0] },
          "downwards": { "y": [{ "inject": "snippet.params", "name": "negativeValue" }, 0] },
          "leftwards": { "x": [{ "inject": "snippet.params", "name": "value" }, 0] },
          "rightwards": { "x": [{ "inject": "snippet.params", "name": "negativeValue" }, 0] }
        }
      },
      "exit": {
        "inject": "direction",
        "upwards": { "y": { "inject": "snippet.params", "name": "negativeValue" } },
        "downwards": { "y": { "inject": "snippet.params", "name": "value" } },
        "leftwards": { "x": { "inject": "snippet.params", "name": "negativeValue" } },
        "rightwards": { "x": { "inject": "snippet.params", "name": "value" } }
      }
    }
  }
}
```
