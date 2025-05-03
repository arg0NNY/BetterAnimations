# Snippets

_BetterAnimations_ provides an ability to create reusable definitions — **Snippets**.

## Definition

To create a snippet, define it in the [`snippets`](/reference/pack#snippets) property of a [Pack](/reference/pack)
with a unique identifier ([`key`](/reference/snippet#key)) and the contents of the snippet ([`value`](/reference/snippet#value)):
```json
{
  "name": "My Pack",
  "version": "0.0.0",
  "author": "arg0NNY",
  
  "snippets": [ // [!code focus:14]
    { // [!code highlight:12]
      "key": "opacity",
      "value": {
        "inject": "type",
        "enter": {
          "inject": "isIntersected",
          "true": 1,
          "false": [0, 1]
        },
        "exit": 0
      }
    }
  ],
  
  "animations": [
    /* ... */
  ]
}
```

## Usage

To use a snippet, use inject [`snippet`](/reference/injects/snippets#snippet) and provide the `key` of a snippet you want to use:
```json
{
  "key": "fade",
  "name": "Fade",
  "animate": {
    "anime": { // [!code focus:12]
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": { // [!code highlight:4]
          "inject": "snippet",
          "key": "opacity"
        }
      }
    }
  }
}
```

When parsed, inject [`snippet`](/reference/injects/snippets#snippet) will return the **parsed** contents of the snippet.

The definition above essentially is equivalent to:
```json
{
  "key": "fade",
  "name": "Fade",
  "animate": {
    "anime": { // [!code focus:17]
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": { // [!code highlight:9]
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

Snippets can be used at any place inside _injectables_.

## Parameters

Snippets can accept parameters. To pass the parameters to the snippet, use the `params` property of inject [`snippet`](/reference/injects/snippets#snippet):
```json
{
  "key": "fade",
  "name": "Fade",
  "animate": {
    "anime": { // [!code focus:16]
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "inOutSine",
        "opacity": {
          "inject": "snippet",
          "key": "opacity",
          "params": { // [!code ++:4]
            "from": 0,
            "to": 1
          }
        }
      }
    }
  }
}
```

To use the parameters inside a snippet, use inject [`snippet.params`](/reference/injects/snippets#snippet-params)
with the `name` of a parameter you want to get the value of:
```json
{
  "name": "My Pack",
  "version": "0.0.0",
  "author": "arg0NNY",
  
  "snippets": [ // [!code focus:20]
    {
      "key": "opacity",
      "value": {
        "inject": "type",
        "enter": {
          "inject": "isIntersected",
          "true": 1, // [!code --]
          "true": { "inject": "snippet.params", "name": "to" }, // [!code ++]
          "false": [0, 1], // [!code --]
          "false": [ // [!code ++:4]
            { "inject": "snippet.params", "name": "from" },
            { "inject": "snippet.params", "name": "to" }
          ]
        },
        "exit": 0, // [!code --]
        "exit": { "inject": "snippet.params", "name": "from" } // [!code ++]
      }
    }
  ],
  
  "animations": [
    /* ... */
  ]
}
```

You may also define the default values for the parameters of a snippet
using the [`params`](/reference/snippet#params) property of a [Snippet](/reference/snippet):
```json
{
  "name": "My Pack",
  "version": "0.0.0",
  "author": "arg0NNY",
  
  "snippets": [ // [!code focus:21]
    {
      "key": "opacity",
      "params": { // [!code ++:4]
        "from": 0,
        "to": 1
      },
      "value": {
        "inject": "type",
        "enter": {
          "inject": "isIntersected",
          "true": { "inject": "snippet.params", "name": "to" },
          "false": [
            { "inject": "snippet.params", "name": "from" },
            { "inject": "snippet.params", "name": "to" }
          ]
        },
        "exit": { "inject": "snippet.params", "name": "from" }
      }
    }
  ],
  
  "animations": [
    /* ... */
  ]
}
```
