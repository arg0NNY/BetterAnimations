# Injects: Settings

[Injects](/create/injects) for [Settings](/create/settings) implementation.

## `duration`

Returns the current value of the [Duration](/create/settings#duration) setting.

> [!WARNING]
> Can only be used if the [Duration](/create/settings#duration) setting is activated.

### Parameters {#duration-parameters}

Doesn't accept any parameters.

### Returns {#duration-returns}

The duration in milliseconds.

### Example usage {#duration-example}

```json
{ "inject": "duration" }
```

## `easing`

Returns an easing function of the specified <InjectRef inject="easing" parameter="easing" />.

### Parameters {#easing-parameters}

#### `easing` <Badge type="info" text="optional" /> {#easing-parameters-easing}

[Easing](../easing). Defaults to the current value of the [Easing](/create/settings#easing) setting if it is defined, otherwise this parameter becomes required.

#### `raw` <Badge type="info" text="optional" /> {#easing-parameters-raw}

A boolean indicating whether to return the raw <InjectRef inject="easing" parameter="easing" /> value. `false` by default.

### Returns {#easing-returns}

Easing function of the specified <InjectRef inject="easing" parameter="easing" /> if `raw` is `false`.

Raw definition ([Easing](../easing)) of the specified <InjectRef inject="easing" parameter="easing" /> if `raw` is `true`.

### Example usage {#easing-example}

```json
{
  "inject": "easing",
  "easing": {
    "type": "ease",
    "style": "quad"
  }
}
```

## `position`

The API of the inject [`position`](#position) differs based on the activated mode of the [Position](/create/settings#position) setting.

> [!WARNING]
> Can only be used if the [Position](/create/settings#position) setting is activated.

### [Enum mode](/create/settings#position-enum) {#position-enum}

Returns the current value of the [Position](/create/settings#position) setting or a value passed to the [parameter](#position-enum-parameters) corresponding to the current value of the [Position](/create/settings#position) setting.

#### Parameters {#position-enum-parameters}

Accepts any value for the subset of the following parameters corresponding to the values defined for the [Position](/create/settings#position) setting:
`top left`, `top`, `top right`, `left`, `center`, `right`, `bottom left`, `bottom`, `bottom right`.

Define the parameters for all the defined [Position](/create/settings#position) values to activate the **switch mode**, or define none to get the current value of the [Position](/create/settings#position) setting.

#### Returns {#position-enum-returns}

The value passed to the [parameter](#position-enum-parameters) corresponding to the current value of the [Position](/create/settings#position) setting in **switch mode**.

Otherwise, any of: `"top left"`, `"top"`, `"top right"`, `"left"`, `"center"`, `"right"`,
`"bottom left"`, `"bottom"`, `"bottom right"`.

#### Example usage {#position-enum-example}

```json
{ "inject": "position" }
```
```json
{
  "inject": "position",
  "top left": /* ... */,
  "top": /* ... */,
  "top right": /* ... */,
  "left": /* ... */,
  "center": /* ... */,
  "right": /* ... */,
  "bottom left": /* ... */,
  "bottom": /* ... */,
  "bottom right": /* ... */
}
```

### [Precise mode](/create/settings#position-precise) {#position-precise}

Returns the position of the _anchor point_ relative to the original position of the [Container](/create/layout#container).

#### Parameters {#position-precise-parameters}

#### `value` <Badge type="info" text="optional" /> {#position-precise-parameters-value}

Any of: `"x"`, `"y"`.

#### `unit` <Badge type="info" text="optional" /> {#position-precise-parameters-unit}

Any of: `"px"` (default), `"%"`.

#### `clip` <Badge type="info" text="optional" /> {#position-precise-parameters-clip}

A boolean indicating whether to clip the values to fit them into the bounds of the [Container](/create/layout#container). `true` by default.

For example, if the `x` position of the _anchor point_ is `153px`, but the width of the [Container](/create/layout#container)
is only `120px`, the latter value will be used when this option is enabled.

#### Returns {#position-precise-returns}

The specified coordinate (<InjectRef inject="position" parameter="value" target="precise-parameters-value" />) of the position of the _anchor point_
in the requested <InjectRef inject="position" parameter="unit" target="precise-parameters-unit" />.

If the coordinate (<InjectRef inject="position" parameter="value" target="precise-parameters-value" />) is not specified — a string representing the [`<length-percentage> <length-percentage>`](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) CSS value in the requested <InjectRef inject="position" parameter="unit" target="precise-parameters-unit" />.

#### Example usage {#position-precise-example}

```json
{
  "inject": "position",
  "value": "x",
  "unit": "%",
  "clip": false
}
```

## `direction`

Returns the current value of the [Direction](/create/settings#direction) setting or a value passed to the [parameter](#direction-parameters) corresponding to the current value of the [Direction](/create/settings#direction) setting.

> [!WARNING]
> Can only be used if the [Direction](/create/settings#direction) setting is activated.

### Parameters {#direction-parameters}

Accepts any value for the subset of the following parameters corresponding to the values defined for the [Direction](/create/settings#direction) setting:
`upwards`, `downwards`, `leftwards`, `rightwards`, `forwards`, `backwards`.

Define the parameters for all the defined [Direction](/create/settings#direction) values to activate the **switch mode**, or define none to get the current value of the [Direction](/create/settings#direction) setting.

### Returns {#direction-returns}

The value passed to the [parameter](#direction-parameters) corresponding to the current value of the [Direction](/create/settings#direction) setting in **switch mode**.

Otherwise, any of: `"upwards"`, `"downwards"`, `"leftwards"`, `"rightwards"`, `"forwards"`, `"backwards"`.

### Example usage {#direction-example}

```json
{ "inject": "direction" }
```
```json
{
  "inject": "direction",
  "upwards": /* ... */,
  "downwards": /* ... */,
  "leftwards": /* ... */,
  "rightwards": /* ... */,
  "forwards": /* ... */,
  "backwards": /* ... */
}
```

## `variant`

Returns the `key` of the selected option of the [Variant](/create/settings#variant) setting or a value passed to the [parameter](#variant-parameters) corresponding to the `key` of the selected option of the [Variant](/create/settings#variant) setting.

> [!WARNING]
> Can only be used if the [Variant](/create/settings#variant) setting is activated.

### Parameters {#variant-parameters}

Accepts any value for the parameters named as the `key` of the options defined for the [Variant](/create/settings#variant) setting.

Define the parameters for all the defined [Variant](/create/settings#variant) options to activate the **switch mode**, or define none to get the `key` of the selected option of the [Variant](/create/settings#variant) setting.

### Returns {#variant-returns}

The value passed to the [parameter](#variant-parameters) corresponding to the `key` of the selected option of the [Variant](/create/settings#variant) setting in **switch mode**.

Otherwise, the `key` of the selected option of the [Variant](/create/settings#variant) setting.

### Example usage {#variant-example}

```json
{ "inject": "variant" }
```
```json
{
  "inject": "variant",
  "variantKey1": /* ... */,
  "variantKey2": /* ... */,
  "variantKey3": /* ... */
}
```
