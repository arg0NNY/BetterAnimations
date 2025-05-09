# Introduction

_BetterAnimations_ is both a Client Mod and a Framework. This dual nature means you can not only enjoy enhanced animations within Discord but also create and share your own custom animations with the community.

Creating custom animations for _BetterAnimations_ allows you to:

- Personalize your Discord experience with unique visual effects
- Share your creativity with other _BetterAnimations_ users
- Build a reputation as a contributor to the BetterDiscord ecosystem

> [!WARNING]
> Everything described further assumes you are familiar with all the [Usage](/usage/basics) sections of this documentation
> and have a decent understanding of how to use _BetterAnimations_.
> 
> If you are not, please get familiar with _BetterAnimations_ as a regular user and read all the [Usage](/usage/basics) sections
> before authoring animations.

## Prerequisites

Creating Animations for _BetterAnimations_ requires a basic understanding of the main technologies
used for web development:
- [JavaScript](https://javascript.info/)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) & [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JSON](https://www.json.org/)

If you have no experience with any of these technologies, please read the linked resources and try to understand the basics before proceeding.

## Create a Pack

[Packs](/usage/packs) are defined as plain JSON definitions and are stored as `.pack.json` files in the [Pack Directory](/usage/pack-directory).

To create a Pack, create a file named `{slug}.pack.json` inside the [Pack Directory](/usage/pack-directory),
where `{slug}` is the unique identifier of your pack, for example, `myPack.pack.json`.

> [!NOTE]
> Make sure not to use the _slug_ that is already taken if you're planning to [publish your pack to the Catalog](./publish).

Open it in your favorite code editor with JSON support and start with this basic template:
```json
{
  "name": "My Pack",
  "author": "username",
  "version": "1.0.0",
  
  "animations": [
    
  ]
}
```

See [Reference](/reference/pack) to view other available properties you can define in your pack.

## Define an Animation

Add the first basic _Fade_ animation to your newly created pack:
```json
{
  "name": "My Pack",
  "author": "username",
  "version": "1.0.0",
  
  "animations": [

    { // [!code ++:22]
      "key": "fade",
      "name": "Fade",
      "animate": {
        "anime": {
          "type": "waapi",
          "targets": { "inject": "element" },
          "parameters": {
            "duration": 200,
            "ease": "inOutSine",
            "opacity": {
              "inject": "type",
              "enter": {
                "from": 0,
                "to": 1
              },
              "exit": 0
            }
          }
        }
      }
    }
    
  ]
}
```

[`key`](/reference/animation#key) and [`name`](/reference/animation#name) are required properties that every Animation must have. You may edit them to your liking.
See [Reference](/reference/animation) to learn more.

Animation supports all the modules with an exception to [Modals -> Backdrop](/usage/modules#modals-backdrop) by default.
To override this behavior, define [`modules`](/reference/animation#modules) property with the list of modules you want this Animation to support (see [Reference](/reference/animation#modules)):
```json
{
  "name": "My Pack",
  "author": "username",
  "version": "1.0.0",
  
  "animations": [

    {
      "key": "fade",
      "name": "Fade",
      "modules": "reveal", // [!code ++]
      "animate": {
        "anime": {
          "type": "waapi",
          "targets": { "inject": "element" },
          "parameters": {
            "duration": 200,
            "ease": "inOutSine",
            "opacity": {
              "inject": "type",
              "enter": {
                "from": 0,
                "to": 1
              },
              "exit": 0
            }
          }
        }
      }
    }
    
  ]
}
```

In the example above, we used [`animate`](/reference/animation#animate) to define the [Execution definition](/reference/animation#execution-definition) of an Animation. However, you can
also define it separately for Enter and Exit animations by using [`enter`](/reference/animation#enter) and [`exit`](/reference/animation#exit) properties.
See [Reference](/reference/animation#execution-definition) to learn more.

Now you can save the file and try selecting the newly added _Fade_ animation for any of the supported [Modules](/usage/modules) inside _BetterAnimations Settings_.

## Next Steps

Start learning the essentials of the animation creation by reading the [Anime](./anime) section of this documentation
and then proceed to further sections step-by-step: [Injects](./injects), [Layout](./layout), [Settings](./settings), [Lifecycle](./lifecycle), etc.

Throughout the learning, you may use the following packs as a reference:
- [Preinstalled Pack](https://github.com/arg0NNY/BetterAnimations/blob/main/src/packs/preinstalled.pack.json) — Pack of Animations that come preinstalled with _BetterAnimations_.
- [Example Packs](https://github.com/arg0NNY/BetterAnimations/tree/main/examples) — Packs with various examples of Animations.

## Publishing

When you're ready to share your pack with the community, you can publish it to the [Catalog](/usage/packs#catalog-library)
to make it available for everyone to download and use. See [Publishing to Catalog](./publish).
