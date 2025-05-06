# Injects: Anime

[Injects](/create/injects) of [Anime JavaScript Animation Engine](https://animejs.com) utility functions.

## `stagger`

See [Stagger](https://animejs.com/documentation/stagger).

### Parameters {#stagger-parameters}

#### `value` {#stagger-parameters-value}

[Stagger value](https://animejs.com/documentation/stagger/stagger-value-types).

#### `parameters` <Badge type="info" text="optional" /> {#stagger-parameters-parameters}

[Stagger parameters](https://animejs.com/documentation/stagger/stagger-parameters).

### Returns {#stagger-returns}

[Function-based value](https://animejs.com/documentation/animation/tween-value-types/function-based).

### Example usage {#stagger-example}

```json
{
  "inject": "stagger",
  "value": 80
}
```

## `utils.random`

See [`utils.random()`](https://animejs.com/documentation/utilities/random).

### Parameters {#utils-random-parameters}

#### `min` {#utils-random-parameters-min}

A number.

#### `max` {#utils-random-parameters-max}

A number.

#### `decimalLength` <Badge type="info" text="optional" /> {#utils-random-parameters-decimallength}

A number.

### Returns {#utils-random-returns}

A number.

### Example usage {#utils-random-example}

```json
{
  "inject": "utils.random",
  "min": 2,
  "max": 18,
  "decimalLength": 2
}
```

## `utils.get`

See [`utils.get()`](https://animejs.com/documentation/utilities/get).

### Parameters {#utils-get-parameters}

#### `target` <Badge type="info" text="optional" /> {#utils-get-parameters-target}

A single [Target](/create/anime#targets). An [Element](/create/layout#element) by default.

#### `property` {#utils-get-parameters-property}

A string.

#### `unit` <Badge type="info" text="optional" /> {#utils-get-parameters-unit}

A string or a boolean.

### Returns {#utils-get-returns}

See [`utils.get()`](https://animejs.com/documentation/utilities/get).

### Example usage {#utils-get-example}

```json
{
  "inject": "utils.get",
  "target": ".some-class",
  "property": "x",
  "unit": false
}
```

## `utils.set` <Badge type="tip" text="lazy" />

See [`utils.set()`](https://animejs.com/documentation/utilities/set).

### Parameters {#utils-set-parameters}

#### `targets` <Badge type="info" text="optional" /> {#utils-set-parameters-targets}

[Targets](/create/anime#targets). An [Element](/create/layout#element) by default.

#### `properties` {#utils-set-parameters-properties}

An object.

### Returns {#utils-set-returns}

[`revert()`](https://animejs.com/documentation/animation/animation-methods/revert)

### Example usage {#utils-set-example}

```json
{
  "inject": "utils.set",
  "targets": ".some-class",
  "properties": {
    "x": 10,
    "y": 20
  }
}
```

## `svg.morphTo`

See [`svg.morphTo()`](https://animejs.com/documentation/svg/morphto).

### Parameters {#svg-morphto-parameters}

#### `target` {#svg-morphto-parameters-target}

A single [Target](/create/anime#targets).

#### `precision` <Badge type="info" text="optional" /> {#svg-morphto-parameters-precision}

A number between `0` and `1`.

### Returns {#svg-morphto-returns}

See [`svg.morphTo()`](https://animejs.com/documentation/svg/morphto).

### Example usage {#svg-morphto-example}

```json
{
  "inject": "svg.morphTo",
  "target": ".some-class",
  "precision": 0.5
}
```

## `svg.createDrawable`

See [`svg.createDrawable()`](https://animejs.com/documentation/svg/createdrawable).

### Parameters {#svg-createdrawable-parameters}

#### `targets` {#svg-createdrawable-parameters-targets}

[Targets](/create/anime#targets).

### Returns {#svg-createdrawable-returns}

See [`svg.createDrawable()`](https://animejs.com/documentation/svg/createdrawable).

### Example usage {#svg-createdrawable-example}

```json
{
  "inject": "svg.createDrawable",
  "targets": ".some-class"
}
```

## `svg.createMotionPath`

See [`svg.createMotionPath()`](https://animejs.com/documentation/svg/createmotionpath).

### Parameters {#svg-createmotionpath-parameters}

#### `target` {#svg-createmotionpath-parameters-target}

A single [Target](/create/anime#targets).

### Returns {#svg-createmotionpath-returns}

An object containing the following properties:
- `translateX` — [Function-based value](https://animejs.com/documentation/animation/tween-value-types/function-based).
- `translateY` — [Function-based value](https://animejs.com/documentation/animation/tween-value-types/function-based).
- `rotate` — [Function-based value](https://animejs.com/documentation/animation/tween-value-types/function-based).

### Example usage {#svg-createmotionpath-example}

```json
{
  "inject": "svg.createMotionPath",
  "target": ".some-class"
}
```
