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
