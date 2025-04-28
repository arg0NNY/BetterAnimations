# Easing

A definition of an Easing function. Refer to [Anime Documentation](https://animejs.com/documentation/animation/tween-parameters/ease).

Can be of 5 different types: `linear`, `ease`, `back`, `elastic` and `steps`.

## `linear`

An object containing the following properties:
- `type` — A literal string `linear`.

**Example:**
```json
{
  "type": "linear"
}
```

## `ease`

An object containing the following properties:
- `type` — A literal string `ease`.
- `bezier` <Badge type="info" text="optional" /> — Any of: `in`, `out`, `inOut` (default).
- `style` <Badge type="info" text="optional" /> — Any of: `sine` (default), `quad`, `cubic`, `quart`, `quint`, `circ`, `expo`, `bounce`.

**Example:**
```json
{
  "type": "ease",
  "bezier": "out",
  "style": "quart"
}
```

## `back`

An object containing the following properties:
- `type` — A literal string `back`.
- `bezier` <Badge type="info" text="optional" /> — Any of: `in`, `out` (default), `inOut`.
- `overshoot` <Badge type="info" text="optional" /> — A number from `1` to `10`. `1.7` by default.

**Example:**
```json
{
  "type": "back",
  "bezier": "inOut",
  "overshoot": 2
}
```

## `elastic`

An object containing the following properties:
- `type` — A literal string `elastic`.
- `bezier` <Badge type="info" text="optional" /> — Any of: `in`, `out` (default), `inOut`.
- `amplitude` <Badge type="info" text="optional" /> — A number from `1` to `10`. `1` by default.
- `period` <Badge type="info" text="optional" /> — A number from `0.1` to `2`. `0.5` by default.

**Example:**
```json
{
  "type": "elastic",
  "bezier": "inOut",
  "amplitude": 2,
  "period": 1.3
}
```

## `steps`

An object containing the following properties:
- `type` — A literal string `steps`.
- `amount` — An integer from `1` to `100`.

**Example:**
```json
{
  "type": "steps",
  "amount": 5
}
```