---
outline: deep
---

# Pack

The definition of a [Pack](/usage/packs).

Must be at the root of a Pack file (`{slug}.pack.json`).

## Properties

### `name`

A non-empty string representing the display name of a pack.

### `author`

A non-empty string representing the username of the pack author.

### `version`

A string representing the version of the pack in [SemVer](https://semver.org/) format. See [RegExp](https://regex101.com/r/vkijKf/1/).

### `description` <Badge type="info" text="optional" />

A non-empty string representing the description of a pack.

### `changelog` <Badge type="info" text="optional" />

Displays changelog modal when the pack updates to the current [`version`](#version).

Accepts an `options` object passed to [`BdApi.UI.showChangelogModal()`](https://docs.betterdiscord.app/api/ui#showchangelogmodal).
`title` and `subtitle` are managed automatically and will be ignored if specified.
If the pack is published to the Catalog, `banner` will default to the pack's published thumbnail URL.

### `invite` <Badge type="info" text="optional" />

A string representing the Discord Server Invite ID.

For example, an ID of a Discord Server Invite https://discord.gg/M8DBtcZjXD is `M8DBtcZjXD`.

It will be used to display an invitation in [Catalog & Library](/usage/packs#catalog-library) and Error Inspector.

### `authorLink` <Badge type="info" text="optional" />

A string representing a URL to author's socials.

### `donate` <Badge type="info" text="optional" />

A string representing a URL to the author's donation service.

### `snippets` <Badge type="info" text="optional" />

An array of [Snippets](./snippet).

### `animations`

An array of [Animations](./animation).

## Example

```json
{
  "name": "My Pack",
  "author": "arg0NNY",
  "version": "1.0.0",
  "description": "This is my first pack.",
  
  "animations": [
    /* ... */
  ]
}
```
