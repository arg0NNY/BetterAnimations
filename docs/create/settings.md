---
outline: deep
---

# Settings

Unlock the full potential of customization provided by _BetterAnimations_ by defining the settings for your Animation.

## Duration

Declare property [`duration`](/reference/settings#duration) with `true` inside [`settings`](/reference/settings)
and set the default value for it inside [`defaults`](/reference/settings#defaults):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": { // [!code ++:7]
    "duration": true,

    "defaults": {
      "duration": 200
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center"
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "outBack",
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

This will activate the [**Duration**](/usage/animation-settings#duration) setting for your Animation
with a range from 100 milliseconds to 2 seconds.

To modify the range pass an object with properties `from` and `to` instead:
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true, // [!code --]
    "duration": { // [!code ++:4]
      "from": 100,
      "to": 5000
    },

    "defaults": {
      "duration": 200
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center"
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200,
        "ease": "outBack",
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

To use the current value of this setting use inject [`duration`](/reference/injects/settings#duration):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true,

    "defaults": {
      "duration": 200
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center"
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": 200, // [!code --]
        "duration": { "inject": "duration" }, // [!code ++]
        "ease": "outBack",
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

## Easing

Declare property [`easing`](/reference/settings#easing) with `true` inside [`settings`](/reference/settings)
and set the default value for it inside [`defaults`](/reference/settings#defaults):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true,
    "easing": true, // [!code ++]

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" } // [!code ++]
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center"
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": "outBack",
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

This will activate the [**Easing**](/usage/advanced-animation-settings#easing) setting for your Animation.

To use the current value of this setting use inject [`easing`](/reference/injects/settings#easing):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true,
    "easing": true,

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" }
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center"
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": "outBack", // [!code --]
        "ease": { "inject": "easing" }, // [!code ++]
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

## Position

[**Position**](/usage/animation-settings#position) setting may be activated in two modes: **Enum** and **Precise**.

### Enum {#position-enum}

In **Enum** mode this setting can only be one of 9 values:
`"top left"`, `"top"`, `"top right"`, `"left"`, `"center"`, `"right"`,
`"bottom left"`, `"bottom"`, `"bottom right"`.

To activate this setting in **Enum** mode declare property [`position`](/reference/settings#position)
with an array of allowed values inside [`settings`](/reference/settings)
and set the default value for it inside [`defaults`](/reference/settings#defaults):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true,
    "easing": true,
    "position": [ // [!code ++:11]
      "top left",
      "top",
      "top right",
      "left",
      "center",
      "right",
      "bottom left",
      "bottom",
      "bottom right"
    ],

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" },
      "position": "center" // [!code ++]
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center"
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": { "inject": "easing" },
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

Or use aliases `"enum"` or `"simple"` (see [Reference](/reference/settings#position)):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true,
    "easing": true,
    "position": [ // [!code --:11]
      "top left",
      "top",
      "top right",
      "left",
      "center",
      "right",
      "bottom left",
      "bottom",
      "bottom right"
    ],
    "position": "enum", // [!code ++]

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" },
      "position": "center"
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center"
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": { "inject": "easing" },
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

To use the current value of this setting use inject [`position`](/reference/injects/settings#position):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true,
    "easing": true,
    "position": "enum",

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" },
      "position": "center"
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": "center", // [!code --]
        "transform-origin": { "inject": "position" } // [!code ++]
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": { "inject": "easing" },
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

### Precise {#position-precise}

In **Precise** mode this setting _precisely_ anchors to some _anchor point_.

_Anchor point_ may be simply one of the Enum values transformed into a coordinate or some specific point in the layout,
such as the location of the center of the anchor element. See possible anchor points at [Animation Settings](/usage/animation-settings#position-auto).

However, how the anchor point is determined won't change how it would be handled inside an Animation.

> [!IMPORTANT]
> Prefer using **Precise** mode over **Enum** mode when possible.

To activate this setting in **Precise** mode declare property [`position`](/reference/settings#position)
with `true` or `"precise"` inside [`settings`](/reference/settings)
and set the default value for it inside [`defaults`](/reference/settings#defaults):
```json
{
  "key": "scale",
  "name": "Scale",
  "settings": {
    "duration": true,
    "easing": true,
    "position": "enum", // [!code --]
    "position": true, // [!code ++]

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" },
      "position": "center" // [!code highlight]
    }
  },
  "animate": {
    "css": {
      "{element}": {
        "transform-origin": { "inject": "position" } // [!code highlight]
      }
    },
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": { "inject": "easing" },
        "opacity": {
          "inject": "type",
          "enter": {
            "from": 0,
            "to": 1
          },
          "exit": 0
        },
        "scale": {
          "inject": "type",
          "enter": {
            "from": 0.9,
            "to": 1
          },
          "exit": 0.9
        }
      }
    }
  }
}
```

In **Precise** mode inject [`position`](/reference/injects/settings#position) will return [`<length-percentage> <length-percentage>`](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) CSS value
based on the requested `unit`, which is `px` by default, relative to the Container:
```json
{
  "css": {
    "{element}": {
      "transform-origin": { "inject": "position" } // Example result: "124px 93px"
    }
  }
}
```
```json
{
  "css": {
    "{element}": {
      "transform-origin": { "inject": "position", "unit": "%" } // Example result: "100% 64%"
    }
  }
}
```

Inject [`position`](/reference/injects/settings#position) clips the values to fit inside the Container bounds,
use the parameter `clip` to disable the clipping and get the original values:
```json
{
  "css": {
    "{element}": {
      "transform-origin": { "inject": "position", "clip": false } // Example result: "231px 93px"
    }
  }
}
```
```json
{
  "css": {
    "{element}": {
      "transform-origin": { "inject": "position", "unit": "%", "clip": false } // Example result: "186% 64%"
    }
  }
}
```

You can also get `x` and `y` values separately using by passing the parameter `value`:
```json
{
  "css": {
    "{element}": {
      "transform-origin": {
        "inject": "string.template",
        "template": "${x}px ${y}px",
        "values": {
          "x": { "inject": "position", "value": "x" }, // Example result: 124
          "y": { "inject": "position", "value": "y" } // Example result: 93
        }
      }
    }
  }
}
```

See [Reference](/reference/injects/settings#position) to learn more about inject [`position`](/reference/injects/settings#position) usage in **Precise** mode.

## Direction

Declare property [`direction`](/reference/settings#direction) with an array of allowed values inside [`settings`](/reference/settings)
and set the default value for it inside [`defaults`](/reference/settings#defaults):
```json
{
  "key": "slip",
  "name": "Slip",
  "settings": {
    "duration": true,
    "easing": true,
    "direction": ["upwards", "downwards", "leftwards", "rightwards"], // [!code ++]

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" },
      "direction": "upwards" // [!code ++]
    }
  },
  "animate": {
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "inject": "assign",
        "target": {
          "duration": { "inject": "duration" },
          "ease": { "inject": "easing" }
        },
        "source": {
          "inject": "type",
          "enter": { "y": [5, 0] },
          "exit": { "y": -5 }
        }
      }
    }
  }
}
```

Or use an alias `true` (see [Reference](/reference/settings#direction)):
```json
{
  "key": "slip",
  "name": "Slip",
  "settings": {
    "duration": true,
    "easing": true,
    "direction": ["upwards", "downwards", "leftwards", "rightwards"], // [!code --]
    "direction": true, // [!code ++]

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" },
      "direction": "upwards"
    }
  },
  "animate": {
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "inject": "assign",
        "target": {
          "duration": { "inject": "duration" },
          "ease": { "inject": "easing" }
        },
        "source": {
          "inject": "type",
          "enter": { "y": [5, 0] },
          "exit": { "y": -5 }
        }
      }
    }
  }
}
```

This will activate the [**Direction**](/usage/animation-settings#direction) setting for your Animation.

To use the current value of this setting use inject [`direction`](/reference/injects/settings#direction):
```json
{
  "key": "slip",
  "name": "Slip",
  "settings": {
    "duration": true,
    "easing": true,
    "direction": true,

    "defaults": {
      "duration": 200,
      "easing": { "type": "back" },
      "direction": "upwards"
    }
  },
  "animate": {
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "inject": "assign",
        "target": {
          "duration": { "inject": "duration" },
          "ease": { "inject": "easing" }
        },
        "source": {
          "inject": "type",
          "enter": { "y": [5, 0] }, // [!code --]
          "enter": { // [!code ++:7]
            "inject": "direction",
            "upwards": { "y": [5, 0] },
            "downwards": { "y": [-5, 0] },
            "leftwards": { "x": [5, 0] },
            "rightwards": { "x": [-5, 0] }
          },
          "exit": { "y": -5 }, // [!code --]
          "exit": { // [!code ++:7]
            "inject": "direction",
            "upwards": { "y": -5 },
            "downwards": { "y": 5 },
            "leftwards": { "x": -5 },
            "rightwards": { "x": 5 }
          }
        }
      }
    }
  }
}
```

## Variant

Declare property [`variant`](/reference/settings#variant) with an array of `key`-`name` values inside [`settings`](/reference/settings)
and set the default value for it inside [`defaults`](/reference/settings#defaults):
```json
{
  "key": "backdrop-solid",
  "name": "Solid",
  "modules": "modalsBackdrop",
  "settings": {
    "duration": true,
    "easing": true,
    "variant": [ // [!code ++:4]
      { "key": "dark", "name": "Dark" },
      { "key": "light", "name": "Light" }
    ],

    "defaults": {
      "duration": 200,
      "easing": {
        "type": "ease",
        "style": "quart"
      },
      "variant": "dark" // [!code ++]
    }
  },
  "animate": {
    "onBeforeCreate": [
      {
        "inject": "var.set",
        "name": "hidden",
        "value": "rgba(0, 0, 0, 0)"
      },
      {
        "inject": "var.set",
        "name": "visible",
        "value": "rgba(0, 0, 0, .7)"
      }
    ],
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": { "inject": "easing" },
        "background": {
          "inject": "type",
          "enter": [
            { "inject": "var.get", "name": "hidden" },
            { "inject": "var.get", "name": "visible" }
          ],
          "exit": { "inject": "var.get", "name": "hidden" }
        }
      }
    }
  }
}
```

This will activate the [**Variant**](/usage/animation-settings#variant) setting for your Animation
with the options you provided.

To use the current value of this setting use inject [`variant`](/reference/injects/settings#variant):
```json
{
  "key": "backdrop-solid",
  "name": "Solid",
  "modules": "modalsBackdrop",
  "settings": {
    "duration": true,
    "easing": true,
    "variant": [
      { "key": "dark", "name": "Dark" },
      { "key": "light", "name": "Light" }
    ],

    "defaults": {
      "duration": 200,
      "easing": {
        "type": "ease",
        "style": "quart"
      },
      "variant": "dark"
    }
  },
  "animate": {
    "onBeforeCreate": [
      {
        "inject": "var.set",
        "name": "hidden",
        "value": "rgba(0, 0, 0, 0)", // [!code --]
        "value": { // [!code ++:5]
          "inject": "variant",
          "dark": "rgba(0, 0, 0, 0)",
          "light": "rgba(255, 255, 255, 0)"
        }
      },
      {
        "inject": "var.set",
        "name": "visible",
        "value": "rgba(0, 0, 0, .7)", // [!code --]
        "value": { // [!code ++:5]
          "inject": "variant",
          "dark": "rgba(0, 0, 0, .7)",
          "light": "rgba(255, 255, 255, .7)"
        }
      }
    ],
    "anime": {
      "type": "waapi",
      "targets": { "inject": "element" },
      "parameters": {
        "duration": { "inject": "duration" },
        "ease": { "inject": "easing" },
        "background": {
          "inject": "type",
          "enter": [
            { "inject": "var.get", "name": "hidden" },
            { "inject": "var.get", "name": "visible" }
          ],
          "exit": { "inject": "var.get", "name": "hidden" }
        }
      }
    }
  }
}
```

## Overflow

Every Animation has an [Overflow](/usage/advanced-animation-settings#overflow) setting.

The value of this setting can't be used by Animation,
as _BetterAnimations_ will automatically set [`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) CSS property
to [`clip`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#clip) for the Container if this setting is enabled.

However, you can override the default value of this setting
by declaring property [`overflow`](/reference/settings#overflow) with `true` inside [`settings`](/reference/settings)
and setting the default value for it inside [`defaults`](/reference/settings#defaults):
```json
{
  "settings": {
    "overflow": true, // [!code highlight]
    
    "defaults": {
      "overflow": false // [!code highlight]
    }
  }
}
```

To force the default value you declared, pass `false`:
```json
{
  "settings": {
    "overflow": true, // [!code --]
    "overflow": false, // [!code ++]
    
    "defaults": {
      "overflow": false
    }
  }
}
```

> [!WARNING]
> Force [Overflow](/usage/advanced-animation-settings#overflow) default value **only if** your animation is only meant to be used either with or without overflow.
> 
> Forcing it as a personal preference is considered bad practice.
