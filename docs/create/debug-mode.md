# Debug Mode

**Debug Mode** enables detailed logging throughout Animation's [Lifecycle](./lifecycle)
to help you debug your Animations.

## Enabling Debug Mode

To enable **Debug Mode**, pass `true` to the [`debug`](/reference/animation#debug) property of the Animation:
```json
{
  "key": "my-animation",
  "name": "My Animation",
  "debug": true, // [!code ++]
  "animate": {
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

Alternatively, you may pass strings `"enter"` or `"exit"` to enable Debug Mode for a specific type of animation:
```json
{
  "key": "my-animation",
  "name": "My Animation",
  "debug": true, // [!code --]
  "debug": "enter", // [!code ++]
  "animate": {
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

> [!WARNING]
> Debug Mode should be disabled for all the Animations before publishing your Pack to Catalog.
> Activate it only for debugging purposes.

## Logs

Debug Mode logs are written to the Console. To view the Console, open the DevTools and switch to the `Console` tab.
See [BetterDiscord Documentation](https://docs.betterdiscord.app/developers/devtools#chromium-devtools) for more info.

**Types of logs:**
- **Parsing started/completed** — Marks the start and end of parsing stages:
  - **Initialize:** General parsing with limited context. Parses [the limited set of injects](./parsing#immediate-injects) and transforms [lazy inject](./injects#lazy-injects) definitions into functions. See [Parsing In-depth](./parsing#initialize-stage).
  - **BeforeExtend:** Parses [`onBeforeExtend`](/reference/animate#onbeforeextend).
  - **Extend:** Parses [`extends`](/reference/animate#extends).
  - **BeforeLayout:** Parses [`onBeforeLayout`](/reference/animate#onbeforelayout).
  - **Layout:** Parses [`hast`](/reference/animate#hast) and [`css`](/reference/animate#css).
  - **BeforeCreate:** Parses [`onBeforeCreate`](/reference/animate#onbeforecreate).
  - **Anime:** Parses [`anime`](/reference/animate#anime).
  - **Created:** Parses [`onCreated`](/reference/animate#oncreated).
  - **BeforeBegin:** Parses [`onBeforeBegin`](/reference/animate#onbeforebegin).
  - **Completed:** Parses [`onCompleted`](/reference/animate#oncompleted).
  - **BeforeDestroy:** Parses [`onBeforeDestroy`](/reference/animate#onbeforedestroy).
  - **Destroyed:** Parses [`onDestroyed`](/reference/animate#ondestroyed).
- **Hook triggered** — Marks the point right before the parsing of a [Lifecycle Hook](./lifecycle#lifecycle-hooks).
- **Lazy inject called** — Marks the point right before the parsing of a [Lazy Inject](./injects#lazy-injects) after it got called.
- **Inject parsed** — Provides detailed information about the parsing of each [Inject](./injects).
