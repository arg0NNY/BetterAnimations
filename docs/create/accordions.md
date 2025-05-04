<script setup>
import { Vue3Lottie } from 'vue3-lottie'
import internalImplemented from '../assets/lottie/accordions-internal-implemented.json'
import topBottom from '../assets/lottie/accordions-margin-top-bottom.json'
import leftRight from '../assets/lottie/accordions-margin-left-right.json'
</script>

# Accordions

**Accordions** is a technical naming of [Expand/Collapse Animations](/usage/basics#expand-collapse-animations).

## Internal vs. Implemented

_BetterAnimations_ provides internal Accordions users can enable for any of the Animations,
which will be executed **before and after the animation itself**. See [Lifecycle Diagram](./lifecycle#lifecycle-diagram).

However, you may implement Accordion into your Animation for it to be executed **simultaneously**
with the rest of your Animation.

<ClientOnly>
    <Vue3Lottie :animation-data="internalImplemented" />
</ClientOnly>

## Implementing Accordions

Accordions can be implemented by applying animations to the layout properties ([`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin), [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width), [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height), etc.)
of a [Container](./layout#container). You can implement them yourself or [use the premade Accordion animations](#using-premade-accordions) provided by _BetterAnimations_.

However, in both cases, you'll need to explicitly disable the internal Accordion animations first by passing `false`
to the [`accordion`](/reference/meta#accordion) property of the Animation's [Meta](/reference/meta):
```json
{
  "key": "fade",
  "name": "Fade",
  "meta": { // [!code ++:3]
    "accordion": false
  },
  "animate": {
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

> [!WARNING]
> Make sure to apply Accordions only for the Modules in which they have an effect:
> [_Messages_](/usage/modules#messages), [_Channel List_](/usage/modules#channel-list), [_Members Sidebar_](/usage/modules#members-sidebar), [_Thread Sidebar_](/usage/modules#thread-sidebar).

## Using premade Accordions

_BetterAnimations_ provides inject [`accordion`](/reference/injects/accordions#accordion), which returns the premade **raw** [Animate](/reference/animate) definition of the Accordion animation,
which you can pass to the [`extends`](/reference/animate#extends) property of your Animation. See [Extending Animations](./extending-animations).

```json
{
  "key": "fade",
  "name": "Fade",
  "meta": {
    "accordion": false
  },
  "animate": {
    "extends": { "inject": "accordion" }, // [!code ++]
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

Inject [`accordion`](/reference/injects/accordions#accordion) provides 4 types of Accordion animations: `marginTop`, `marginBottom`, `marginLeft`, `marginRight`.
All of these leverage the negative values of the [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) properties to offset the neighboring elements.

For example, Accordion of type `marginTop` will animate the [`margin-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top) property of the [Container](./layout#container) from `{-1 * (offsetHeight + marginBottom)}px`
to `{marginTop}px`, where `marginTop` and `marginBottom` are the corresponding original [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) values of the [Container](./layout#container)
and `offsetHeight` is the [`offsetHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight) value of the [Element](./layout#element). See the [full definition](/reference/injects/accordions#accordion-returns).

<ClientOnly>
    <Vue3Lottie :animation-data="topBottom" />
    <Vue3Lottie :animation-data="leftRight" />
</ClientOnly>

> [!NOTE]
> Why not use [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) and [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height) instead?
> The main advantage of using negative [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) values is that they don't affect the size
> of the [Container](./layout#container), which would be the case if we used `width` and `height` properties.
> It may introduce unnecessary complications for the rest of the Animation since the [Container](./layout#container) is expected to always be the same size as the [Element](./layout#element).
> See [Layout](./layout).

Inject [`accordion`](/reference/injects/accordions#accordion) uses the following types of Accordions by default:
- For [_Messages_](/usage/modules#messages) animations of type `enter` — `marginBottom`
- For [_Members Sidebar_](/usage/modules#members-sidebar) and [_Thread Sidebar_](/usage/modules#thread-sidebar) — `marginRight`

[Meta](/reference/meta) provides an overridable preset [`accordion`](/reference/meta#presets-accordion) for the default Accordion types (see [Reference](/reference/meta#presets-accordion)):
```json
{
  "key": "fade",
  "name": "Fade",
  "meta": {
    "accordion": false, // [!code --]
    "override": { "preset": "accordion" } // [!code ++]
  },
  "animate": {
    "extends": { "inject": "accordion" },
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

You can override the default Accordion type by passing the [`type`](/reference/injects/accordions#accordion-parameters-type) parameter:
```json
{
  "key": "fade",
  "name": "Fade",
  "meta": {
    "accordion": false
  },
  "animate": {
    "extends": {
      "inject": "accordion",
      "type": { // [!code ++:9]
        "inject": "switch",
        "value": { "inject": "module" },
        "case": {
          "membersSidebar": "marginLeft",
          "threadSidebar": "marginLeft"
        },
        "default": { "inject": "undefined" }
      }
    },
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```

> [!WARNING]
> Using **implemented** Accordions for the [_Messages_](/usage/modules#messages) animations of type `exit` is not recommended,
> since the deleted message, unlike the new one, may not be the bottom-most message in the list and therefore, Accordion
> animation executed simultaneously with the rest of the Animation instead of after it can make the message overlap the neighboring messages,
> which will make the animation look unpleasant.
>
> The same applies for the [_Channel List_](/usage/modules#channel-list) animations.
