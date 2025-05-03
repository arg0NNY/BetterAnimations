# Accordions

See [Accordions](/create/accordions).

## `accordion`

Provides premade [Accordion](/create/accordions) [Animate](../animate) definition. See [Accordions](/create/accordions).

### Parameters {#accordion-parameters}

#### `type` <Badge type="info" text="optional" /> {#accordion-parameters-type}
Any of: `"marginTop"`, `"marginBottom"`, `"marginLeft"`, `"marginRight"`, `null`.

Defaults to:
- For [_Messages_](/usage/modules#messages) animations of type `enter` — `"marginTop"`
- For [_Members Sidebar_](/usage/modules#members-sidebar) and [_Thread Sidebar_](/usage/modules#thread-sidebar) — `"marginRight"`
- For the rest: `null`

#### `duration` <Badge type="info" text="optional" /> {#accordion-parameters-duration}

The duration of the Accordion animation in milliseconds.

Defaults to the current value of the [Duration](/create/settings#duration) setting if it is defined, otherwise this parameter becomes required.

#### `easing` <Badge type="info" text="optional" /> {#accordion-parameters-easing}

[Easing](../easing) to be applied to the Accordion animation.

Defaults to the current value of the [Easing](/create/settings#easing) setting if it is defined, otherwise this parameter becomes required.

### Returns {#accordion-returns}

The return value depends on the value of the [`type`](#accordion-parameters-type) parameter:

#### `"marginTop"` {#accordion-returns-margintop}
```json
{
  "onBeforeCreate": {
    "inject": "var.set",
    "name": "__accordion_marginTop__value",
    "value": {
      "inject": "*",
      "a": -1,
      "b": {
        "inject": "+",
        "a": {
          "inject": "utils.get",
          "target": { "inject": "element" },
          "property": "offsetHeight",
          "unit": false
        },
        "b": {
          "inject": "utils.get",
          "target": { "inject": "container" },
          "property": "marginBottom",
          "unit": false
        }
      }
    }
  },
  "anime": {
    "targets": { "inject": "container" },
    "parameters": {
      "duration": duration,
      "ease": {
        "inject": "easing",
        "easing": easing
      },
      "marginTop": {
        "inject": "type",
        "enter": {
          "inject": "isIntersected",
          "true": 0,
          "false": {
            "from": {
              "inject": "var.get",
              "name": "__accordion_marginTop__value"
            }
          }
        },
        "exit": {
          "inject": "var.get",
          "name": "__accordion_marginTop__value"
        }
      }
    }
  }
}
```

#### `"marginBottom"` {#accordion-returns-marginbottom}
```json
{
  "onBeforeCreate": {
    "inject": "var.set",
    "name": "__accordion_marginBottom__value",
    "value": {
      "inject": "*",
      "a": -1,
      "b": {
        "inject": "+",
        "a": {
          "inject": "utils.get",
          "target": { "inject": "element" },
          "property": "offsetHeight",
          "unit": false
        },
        "b": {
          "inject": "utils.get",
          "target": { "inject": "container" },
          "property": "marginTop",
          "unit": false
        }
      }
    }
  },
  "anime": {
    "targets": { "inject": "container" },
    "parameters": {
      "duration": duration,
      "ease": {
        "inject": "easing",
        "easing": easing
      },
      "marginBottom": {
        "inject": "type",
        "enter": {
          "inject": "isIntersected",
          "true": 0,
          "false": {
            "from": {
              "inject": "var.get",
              "name": "__accordion_marginBottom__value"
            }
          }
        },
        "exit": {
          "inject": "var.get",
          "name": "__accordion_marginBottom__value"
        }
      }
    }
  }
}
```

#### `"marginLeft"` {#accordion-returns-marginleft}
```json
{
  "onBeforeCreate": {
    "inject": "var.set",
    "name": "__accordion_marginLeft__value",
    "value": {
      "inject": "*",
      "a": -1,
      "b": {
        "inject": "+",
        "a": {
          "inject": "utils.get",
          "target": { "inject": "element" },
          "property": "offsetWidth",
          "unit": false
        },
        "b": {
          "inject": "utils.get",
          "target": { "inject": "container" },
          "property": "marginRight",
          "unit": false
        }
      }
    }
  },
  "anime": {
    "targets": { "inject": "container" },
    "parameters": {
      "duration": duration,
      "ease": {
        "inject": "easing",
        "easing": easing
      },
      "marginLeft": {
        "inject": "type",
        "enter": {
          "inject": "isIntersected",
          "true": 0,
          "false": {
            "from": {
              "inject": "var.get",
              "name": "__accordion_marginLeft__value"
            }
          }
        },
        "exit": {
          "inject": "var.get",
          "name": "__accordion_marginLeft__value"
        }
      }
    }
  }
}
```

#### `"marginRight"` {#accordion-returns-marginright}
```json
{
  "onBeforeCreate": {
    "inject": "var.set",
    "name": "__accordion_marginRight__value",
    "value": {
      "inject": "*",
      "a": -1,
      "b": {
        "inject": "+",
        "a": {
          "inject": "utils.get",
          "target": { "inject": "element" },
          "property": "offsetWidth",
          "unit": false
        },
        "b": {
          "inject": "utils.get",
          "target": { "inject": "container" },
          "property": "marginLeft",
          "unit": false
        }
      }
    }
  },
  "anime": {
    "targets": { "inject": "container" },
    "parameters": {
      "duration": duration,
      "ease": {
        "inject": "easing",
        "easing": easing
      },
      "marginRight": {
        "inject": "type",
        "enter": {
          "inject": "isIntersected",
          "true": 0,
          "false": {
            "from": {
              "inject": "var.get",
              "name": "__accordion_marginRight__value"
            }
          }
        },
        "exit": {
          "inject": "var.get",
          "name": "__accordion_marginRight__value"
        }
      }
    }
  }
}
```

#### `null` {#accordion-returns-null}
Returns `null`.

### Example usage {#accordion-example}

```json
{
  "key": "fade",
  "name": "Fade",
  "meta": {
    "accordion": false
  },
  "animate": {
    "extends": { "inject": "accordion" }, // [!code highlight]
    "anime": {
      "targets": { "inject": "element" },
      "parameters": { /* ... */ }
    }
  }
}
```
