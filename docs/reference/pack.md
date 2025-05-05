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

A non-empty string representing the description of a pack. Displayed in [Catalog & Library](/usage/packs#catalog-library).

### `invite` <Badge type="info" text="optional" />

A string representing the Discord Server Invite ID.

For example, an ID of a Discord Server Invite https://discord.gg/M8DBtcZjXD is `M8DBtcZjXD`.

It will be used to display an invitation in [Catalog & Library](/usage/packs#catalog-library) and Error Inspector.

### `authorLink` <Badge type="info" text="optional" />

A string representing a URL to author's socials.

### `donate` <Badge type="info" text="optional" />

A string representing a URL to author's donation service.

### `patreon` <Badge type="info" text="optional" />

A string representing a URL to author's Patreon.

### `website` <Badge type="info" text="optional" />

A string representing a URL to author's website.

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
