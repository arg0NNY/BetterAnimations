<script setup>
import { data as config } from '../data/config.data'
</script>

# Pack Directory

Installed [Packs](./packs) are stored locally on your machine inside a **Pack Directory**.

## Location

**Pack Directory** is named `{{ config.name }}` and is located inside a _BetterDiscord Plugins Folder_, which location differs depending on your OS.
To open it, go to the _BetterDiscord Settings_ -> _Plugins_ -> _Open Plugins Folder_.

Alternatively, use the following paths:
- On **Windows**: `%appdata%\BetterDiscord\plugins\{{ config.name }}`
- On **macOS**: `~/Library/Application Support/BetterDiscord/plugins/{{ config.name }}`
- On **Linux**: `~/.config/BetterDiscord/plugins/{{ config.name }}`

> [!WARNING]
> The **Pack Directory** will only be created after you install and enable _BetterAnimations_.

## Structure

The **Pack Directory** contains all the downloaded [Packs](./packs) and their [configuration files](#configuration-files).

Example structure:
```md-vue
{{ config.name }}
├── myPack.pack.json
├── myPack.config.json
├── someOtherPack.pack.json
└── someOtherPack.config.json
```

## Manual Pack Management

[Packs](./packs) are stored as plain JSON files at the root of the **Pack Directory** under the `.pack.json` extension.

To manually install a Pack, put the `.pack.json` file to the **Pack Directory**.
It will be automatically loaded by _BetterAnimations_ and displayed in your [Library](./packs#catalog-library), and its animations will be available
to use in the [Module](./modules) Settings.

## Configuration Files

Each Pack has a configuration file with the `.config.json` extension, which _BetterAnimations_ uses
to store your settings for the animations of the Pack.

Configuration files are created and managed automatically by the plugin, you don't need to create or download them manually.
However, if you want to migrate the installed packs whilst saving your settings, make sure to also transfer the configuration files.

> [!NOTE]
> The settings of a preinstalled pack are stored inside the main configuration file of _BetterAnimations_
> located inside the _Plugins Folder_: `{{ config.name }}.config.json`
