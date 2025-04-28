---
outline: deep
---

# Meta

An [Overridable](/create/overridables) containing the meta information of an [Animation](./animation).

## Properties

### `intersect` <Badge type="info" text="optional" />

A boolean indicating whether an Animation can be intersected. `true` by default. See [Intersection](/create/intersection).

### `accordion` <Badge type="info" text="optional" />

A boolean indicating whether internal [Expand/Collapse Animation](/usage/basics#expand-collapse-animations) (Accordion) can be enabled when an Animation is selected.
`true` by default. See [Accordions](/create/accordions).

> [!WARNING]
> Pass `false` to this option only when an Animation implements the [Accordion](/create/accordions) animation itself,
> whether custom-made or by using [`accordion`](./injects/accordion#accordion) inject.

### `revert` <Badge type="info" text="optional" />

A boolean indicating whether [Anime](/create/anime) instances should be reverted when an animation ends. `true` by default.

> [!IMPORTANT]
> This property has effect only for the [Backdrop Module](/usage/modules#modals-backdrop).
> Other modules always revert animations they execute.

## Presets

### `accordion` {#presets-accordion}

```json
[
  {
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
  }
]
```

## Example

```json
{
  "intersect": false,
  "override": { "preset": "accordion" }
}
```
