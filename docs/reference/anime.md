# Anime

A definition of [Anime instance](/create/anime).

Can be of 4 different types: `timer`, `animation` (default), `waapi` and `timeline`.

## `timer`

An object containing the following properties:
- `type` — A literal string `timer`.
- `parameters` — Timer parameters. Refer to [Anime Documentation](https://animejs.com/documentation/timer).

**Example:**
```json
{
  "type": "timer",
  "parameters": {
    "duration": 200
  }
}
```

## `animation`

An object containing the following properties:
- `type` <Badge type="info" text="optional" /> — A literal string `animation`. Can be omitted as it is considered default.
- `targets` — [Targets](/create/anime#targets).
- `parameters` — Animation parameters. Refer to [Anime Documentation](https://animejs.com/documentation/animation).

**Example:**
```json
{
  "targets": { "inject": "element" },
  "parameters": {
    "duration": 200,
    "ease": "inOutSine",
    "opacity": {
      "from": 0,
      "to": 1
    }
  }
}
```

## `waapi`

An object containing the following properties:
- `type` — A literal string `waapi`.
- `targets` — [Targets](/create/anime#targets).
- `parameters` — WAAPI parameters. Refer to [Anime Documentation](https://animejs.com/documentation/web-animation-api).

**Example:**
```json
{
  "type": "waapi",
  "targets": { "inject": "element" },
  "parameters": {
    "duration": 200,
    "ease": "inOutSine",
    "opacity": {
      "from": 0,
      "to": 1
    }
  }
}
```

## `timeline`

An object containing the following properties:
- `type` — A literal string `timeline`.
- `parameters` <Badge type="info" text="optional" /> — Timeline parameters. Refer to [Anime Documentation](https://animejs.com/documentation/timeline).
- `children` — A non-empty array of [Timeline children](#timeline-child).

**Example:**
```json
{
  "type": "timeline",
  "parameters": {
    "defaults": {
      "duration": 750
    }
  },
  "children": [
    {
      "type": "label",
      "name": "start"
    },
    {
      "targets": ".square",
      "parameters": {
        "x": "15rem"
      },
      "position": 500
    },
    {
      "targets": ".circle",
      "parameters": {
        "x": "15rem"
      },
      "position": "start"
    },
    {
      "targets": ".triangle",
      "parameters": {
        "x": "15rem",
        "rotate": "1turn"
      },
      "position": "<-=500"
    }
  ]
}
```

### Timeline child

A definition of Anime Timeline child.

Can be of 4 different types: `add` (default), `set`, `label` and `call`.

#### `add`

An object containing the following properties:
- `type` <Badge type="info" text="optional" /> — A literal string `add`. Can be omitted as it is considered default.
- `targets` <Badge type="info" text="optional" /> — [Targets](/create/anime#targets). Omit to create a [`Timer`](https://animejs.com/documentation/timer).
- `parameters` — Parameters. Refer to [Anime Documentation](https://animejs.com/documentation/timeline/timeline-methods/add).
- `position` <Badge type="info" text="optional" /> — Time position. Refer to [Anime Documentation](https://animejs.com/documentation/timeline/time-position).

**Example:**
```json
{
  "targets": ".square",
  "parameters": {
    "x": "15rem"
  },
  "position": 500
}
```

#### `set`

An object containing the following properties:
- `type` — A literal string `set`.
- `targets` — [Targets](/create/anime#targets).
- `parameters` — Parameters. Refer to [Anime Documentation](https://animejs.com/documentation/timeline/timeline-methods/set).
- `position` <Badge type="info" text="optional" /> — Time position. Refer to [Anime Documentation](https://animejs.com/documentation/timeline/time-position).

**Example:**
```json
{
  "type": "set",
  "targets": ".square",
  "parameters": {
    "x": "15rem"
  },
  "position": 500
}
```

#### `label`

An object containing the following properties:
- `type` — A literal string `label`.
- `name` — A string containing the name of a label.
- `position` <Badge type="info" text="optional" /> — Time position. Refer to [Anime Documentation](https://animejs.com/documentation/timeline/time-position).

**Example:**
```json
{
  "type": "label",
  "name": "labelName",
  "position": "-=200"
}
```

#### `call`

An object containing the following properties:
- `type` — A literal string `call`.
- `callback` — A function.
- `position` <Badge type="info" text="optional" /> — Time position. Refer to [Anime Documentation](https://animejs.com/documentation/timeline/time-position).

**Example:**
```json
{
  "type": "call",
  "callback": {
    "inject": "var.set",
    "name": "isTimelineChildCalled",
    "value": true
  },
  "position": 500
}
```
