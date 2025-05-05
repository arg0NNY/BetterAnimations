# Injects: Math

[Injects](/create/injects) for a simple math expression evaluation
and of JavaScript [`Math`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) static properties and methods.

## `math`

Evaluates a simple math expression.

> [!TIP]
> Useful in conjunction with inject <InjectRef inject="string.template" />:
> ```json
> {
>   "inject": "math",
>   "expression": {
>     "inject": "string.template",
>     "template": "${0} * (${1} + ${2})",
>     "values": [2, -3, 5]
>   }
> }
> ```

> [!TIP]
> Prefer using [Operators](./operators) for single-operation math expressions.

### Parameters {#math-parameters}

#### `expression` {#math-parameters-expression}

A string representing a math expression.

Supported operators: `+`, `-`, `*`, `/`, `\`, `(`, `)`, `.`.

### Returns {#math-returns}

A number representing the evaluation result.

### Example usage {#math-example}

```json
{
  "inject": "math",
  "expression": "2 * (-3 + 5)"
}
```

## `math.abs`

See [`Math.abs()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs).

### Parameters {#math-abs-parameters}

#### `value` {#math-abs-parameters-value}

A number.

### Returns {#math-abs-returns}

See [`Math.abs()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs#return_value).

### Example usage {#math-abs-example}

```json
{
  "inject": "math.abs",
  "value": 1
}
```

## `math.acos`

See [`Math.acos()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos).

### Parameters {#math-acos-parameters}

#### `value` {#math-acos-parameters-value}

A number.

### Returns {#math-acos-returns}

See [`Math.acos()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos#return_value).

### Example usage {#math-acos-example}

```json
{
  "inject": "math.acos",
  "value": 1
}
```

## `math.acosh`

See [`Math.acosh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh).

### Parameters {#math-acosh-parameters}

#### `value` {#math-acosh-parameters-value}

A number.

### Returns {#math-acosh-returns}

See [`Math.acosh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh#return_value).

### Example usage {#math-acosh-example}

```json
{
  "inject": "math.acosh",
  "value": 1
}
```

## `math.asin`

See [`Math.asin()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin).

### Parameters {#math-asin-parameters}

#### `value` {#math-asin-parameters-value}

A number.

### Returns {#math-asin-returns}

See [`Math.asin()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin#return_value).

### Example usage {#math-asin-example}

```json
{
  "inject": "math.asin",
  "value": 1
}
```

## `math.asinh`

See [`Math.asinh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh).

### Parameters {#math-asinh-parameters}

#### `value` {#math-asinh-parameters-value}

A number.

### Returns {#math-asinh-returns}

See [`Math.asinh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh#return_value).

### Example usage {#math-asinh-example}

```json
{
  "inject": "math.asinh",
  "value": 1
}
```

## `math.atan`

See [`Math.atan()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan).

### Parameters {#math-atan-parameters}

#### `value` {#math-atan-parameters-value}

A number.

### Returns {#math-atan-returns}

See [`Math.atan()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan#return_value).

### Example usage {#math-atan-example}

```json
{
  "inject": "math.atan",
  "value": 1
}
```

## `math.atan2`

See [`Math.atan2()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2).

### Parameters {#math-atan2-parameters}

#### `y` {#math-atan2-parameters-y}

A number.

#### `x` {#math-atan2-parameters-x}

A number.

### Returns {#math-atan2-returns}

See [`Math.atan2()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2#return_value).

### Example usage {#math-atan2-example}

```json
{
  "inject": "math.atan2",
  "y": 1,
  "x": 1
}
```

## `math.atanh`

See [`Math.atanh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh).

### Parameters {#math-atanh-parameters}

#### `value` {#math-atanh-parameters-value}

A number.

### Returns {#math-atanh-returns}

See [`Math.atanh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh#return_value).

### Example usage {#math-atanh-example}

```json
{
  "inject": "math.atanh",
  "value": 1
}
```

## `math.cbrt`

See [`Math.cbrt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt).

### Parameters {#math-cbrt-parameters}

#### `value` {#math-cbrt-parameters-value}

A number.

### Returns {#math-cbrt-returns}

See [`Math.cbrt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt#return_value).

### Example usage {#math-cbrt-example}

```json
{
  "inject": "math.cbrt",
  "value": 1
}
```

## `math.ceil`

See [`Math.ceil()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil).

### Parameters {#math-ceil-parameters}

#### `value` {#math-ceil-parameters-value}

A number.

### Returns {#math-ceil-returns}

See [`Math.ceil()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil#return_value).

### Example usage {#math-ceil-example}

```json
{
  "inject": "math.ceil",
  "value": 1
}
```

## `math.clz32`

See [`Math.clz32()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32).

### Parameters {#math-clz32-parameters}

#### `value` {#math-clz32-parameters-value}

A number.

### Returns {#math-clz32-returns}

See [`Math.clz32()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32#return_value).

### Example usage {#math-clz32-example}

```json
{
  "inject": "math.clz32",
  "value": 1
}
```

## `math.cos`

See [`Math.cos()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos).

### Parameters {#math-cos-parameters}

#### `value` {#math-cos-parameters-value}

A number.

### Returns {#math-cos-returns}

See [`Math.cos()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos#return_value).

### Example usage {#math-cos-example}

```json
{
  "inject": "math.cos",
  "value": 1
}
```

## `math.cosh`

See [`Math.cosh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh).

### Parameters {#math-cosh-parameters}

#### `value` {#math-cosh-parameters-value}

A number.

### Returns {#math-cosh-returns}

See [`Math.cosh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh#return_value).

### Example usage {#math-cosh-example}

```json
{
  "inject": "math.cosh",
  "value": 1
}
```

## `math.exp`

See [`Math.exp()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/exp).

### Parameters {#math-exp-parameters}

#### `value` {#math-exp-parameters-value}

A number.

### Returns {#math-exp-returns}

See [`Math.exp()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/exp#return_value).

### Example usage {#math-exp-example}

```json
{
  "inject": "math.exp",
  "value": 1
}
```

## `math.expm1`

See [`Math.expm1()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1).

### Parameters {#math-expm1-parameters}

#### `value` {#math-expm1-parameters-value}

A number.

### Returns {#math-expm1-returns}

See [`Math.expm1()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1#return_value).

### Example usage {#math-expm1-example}

```json
{
  "inject": "math.expm1",
  "value": 1
}
```

## `math.floor`

See [`Math.floor()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor).

### Parameters {#math-floor-parameters}

#### `value` {#math-floor-parameters-value}

A number.

### Returns {#math-floor-returns}

See [`Math.floor()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor#return_value).

### Example usage {#math-floor-example}

```json
{
  "inject": "math.floor",
  "value": 1
}
```

## `math.fround`

See [`Math.fround()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround).

### Parameters {#math-fround-parameters}

#### `value` {#math-fround-parameters-value}

A number.

### Returns {#math-fround-returns}

See [`Math.fround()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround#return_value).

### Example usage {#math-fround-example}

```json
{
  "inject": "math.fround",
  "value": 1
}
```

## `math.hypot`

See [`Math.hypot()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot).

### Parameters {#math-hypot-parameters}

#### `values` {#math-hypot-parameters-value}

An array of or a single number.

### Returns {#math-hypot-returns}

See [`Math.hypot()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot#return_value).

### Example usage {#math-hypot-example}

```json
{
  "inject": "math.hypot",
  "values": [1, 2, 3]
}
```

## `math.imul`

See [`Math.imul()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul).

### Parameters {#math-imul-parameters}

#### `a` {#math-imul-parameters-a}

A number.

#### `b` {#math-imul-parameters-b}

A number.

### Returns {#math-imul-returns}

See [`Math.imul()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#return_value).

### Example usage {#math-imul-example}

```json
{
  "inject": "math.imul",
  "a": 1,
  "b": 1
}
```

## `math.log`

See [`Math.log()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log).

### Parameters {#math-log-parameters}

#### `value` {#math-log-parameters-value}

A number.

### Returns {#math-log-returns}

See [`Math.log()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log#return_value).

### Example usage {#math-log-example}

```json
{
  "inject": "math.log",
  "value": 1
}
```

## `math.log1p`

See [`Math.log1p()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p).

### Parameters {#math-log1p-parameters}

#### `value` {#math-log1p-parameters-value}

A number.

### Returns {#math-log1p-returns}

See [`Math.log1p()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p#return_value).

### Example usage {#math-log1p-example}

```json
{
  "inject": "math.log1p",
  "value": 1
}
```

## `math.log10`

See [`Math.log10()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10).

### Parameters {#math-log10-parameters}

#### `value` {#math-log10-parameters-value}

A number.

### Returns {#math-log10-returns}

See [`Math.log10()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#return_value).

### Example usage {#math-log10-example}

```json
{
  "inject": "math.log10",
  "value": 1
}
```

## `math.log2`

See [`Math.log2()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2).

### Parameters {#math-log2-parameters}

#### `value` {#math-log2-parameters-value}

A number.

### Returns {#math-log2-returns}

See [`Math.log2()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2#return_value).

### Example usage {#math-log2-example}

```json
{
  "inject": "math.log2",
  "value": 1
}
```

## `math.max`

See [`Math.max()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max).

### Parameters {#math-max-parameters}

#### `values` {#math-max-parameters-value}

An array of or a single number.

### Returns {#math-max-returns}

See [`Math.max()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max#return_value).

### Example usage {#math-max-example}

```json
{
  "inject": "math.max",
  "values": [1, 2, 3]
}
```

## `math.min`

See [`Math.min()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min).

### Parameters {#math-min-parameters}

#### `values` {#math-min-parameters-value}

An array of or a single number.

### Returns {#math-min-returns}

See [`Math.min()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min#return_value).

### Example usage {#math-min-example}

```json
{
  "inject": "math.min",
  "values": [1, 2, 3]
}
```

## `math.pow`

See [`Math.pow()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow).

### Parameters {#math-pow-parameters}

#### `base` {#math-pow-parameters-base}

A number.

#### `exponent` {#math-pow-parameters-exponent}

A number.

### Returns {#math-pow-returns}

See [`Math.pow()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow#return_value).

### Example usage {#math-pow-example}

```json
{
  "inject": "math.pow",
  "base": 1,
  "exponent": 1
}
```

## `math.random`

See [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random).

### Parameters {#math-random-parameters}

Doesn't accept any parameters.

### Returns {#math-random-returns}

See [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#return_value).

### Example usage {#math-random-example}

```json
{ "inject": "math.random" }
```

## `math.round`

See [`Math.round()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round).

### Parameters {#math-round-parameters}

#### `value` {#math-round-parameters-value}

A number.

### Returns {#math-round-returns}

See [`Math.round()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#return_value).

### Example usage {#math-round-example}

```json
{
  "inject": "math.round",
  "value": 1
}
```

## `math.sign`

See [`Math.sign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign).

### Parameters {#math-sign-parameters}

#### `value` {#math-sign-parameters-value}

A number.

### Returns {#math-sign-returns}

See [`Math.sign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign#return_value).

### Example usage {#math-sign-example}

```json
{
  "inject": "math.sign",
  "value": 1
}
```

## `math.sin`

See [`Math.sin()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin).

### Parameters {#math-sin-parameters}

#### `value` {#math-sin-parameters-value}

A number.

### Returns {#math-sin-returns}

See [`Math.sin()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin#return_value).

### Example usage {#math-sin-example}

```json
{
  "inject": "math.sin",
  "value": 1
}
```

## `math.sinh`

See [`Math.sinh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh).

### Parameters {#math-sinh-parameters}

#### `value` {#math-sinh-parameters-value}

A number.

### Returns {#math-sinh-returns}

See [`Math.sinh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh#return_value).

### Example usage {#math-sinh-example}

```json
{
  "inject": "math.sinh",
  "value": 1
}
```

## `math.sqrt`

See [`Math.sqrt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt).

### Parameters {#math-sqrt-parameters}

#### `value` {#math-sqrt-parameters-value}

A number.

### Returns {#math-sqrt-returns}

See [`Math.sqrt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt#return_value).

### Example usage {#math-sqrt-example}

```json
{
  "inject": "math.sqrt",
  "value": 1
}
```

## `math.tan`

See [`Math.tan()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tan).

### Parameters {#math-tan-parameters}

#### `value` {#math-tan-parameters-value}

A number.

### Returns {#math-tan-returns}

See [`Math.tan()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tan#return_value).

### Example usage {#math-tan-example}

```json
{
  "inject": "math.tan",
  "value": 1
}
```

## `math.tanh`

See [`Math.tanh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh).

### Parameters {#math-tanh-parameters}

#### `value` {#math-tanh-parameters-value}

A number.

### Returns {#math-tanh-returns}

See [`Math.tanh()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh#return_value).

### Example usage {#math-tanh-example}

```json
{
  "inject": "math.tanh",
  "value": 1
}
```

## `math.trunc`

See [`Math.trunc()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc).

### Parameters {#math-trunc-parameters}

#### `value` {#math-trunc-parameters-value}

A number.

### Returns {#math-trunc-returns}

See [`Math.trunc()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc#return_value).

### Example usage {#math-trunc-example}

```json
{
  "inject": "math.trunc",
  "value": 1
}
```

## `math.E`

See [`Math.E`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/E).

### Parameters {#math-e-parameters}

Doesn't accept any parameters.

### Returns {#math-e-returns}

See [`Math.E`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/E).

### Example usage {#math-e-example}

```json
{ "inject": "math.E" }
```

## `math.LN10`

See [`Math.LN10`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN10).

### Parameters {#math-ln10-parameters}

Doesn't accept any parameters.

### Returns {#math-ln10-returns}

See [`Math.LN10`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN10).

### Example usage {#math-ln10-example}

```json
{ "inject": "math.LN10" }
```

## `math.LN2`

See [`Math.LN2`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2).

### Parameters {#math-ln2-parameters}

Doesn't accept any parameters.

### Returns {#math-ln2-returns}

See [`Math.LN2`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2).

### Example usage {#math-ln2-example}

```json
{ "inject": "math.LN2" }
```

## `math.LOG10E`

See [`Math.LOG10E`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG10E).

### Parameters {#math-log10e-parameters}

Doesn't accept any parameters.

### Returns {#math-log10e-returns}

See [`Math.LOG10E`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG10E).

### Example usage {#math-log10e-example}

```json
{ "inject": "math.LOG10E" }
```

## `math.LOG2E`

See [`Math.LOG2E`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG2E).

### Parameters {#math-log2e-parameters}

Doesn't accept any parameters.

### Returns {#math-log2e-returns}

See [`Math.LOG2E`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG2E).

### Example usage {#math-log2e-example}

```json
{ "inject": "math.LOG2E" }
```

## `math.PI`

See [`Math.PI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI).

### Parameters {#math-pi-parameters}

Doesn't accept any parameters.

### Returns {#math-pi-returns}

See [`Math.PI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI).

### Example usage {#math-pi-example}

```json
{ "inject": "math.PI" }
```

## `math.SQRT1_2`

See [`Math.SQRT1_2`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT1_2).

### Parameters {#math-sqrt1-2-parameters}

Doesn't accept any parameters.

### Returns {#math-sqrt1-2-returns}

See [`Math.SQRT1_2`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT1_2).

### Example usage {#math-sqrt1-2-example}

```json
{ "inject": "math.SQRT1_2" }
```

## `math.SQRT2`

See [`Math.SQRT2`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT2).

### Parameters {#math-sqrt2-parameters}

Doesn't accept any parameters.

### Returns {#math-sqrt2-returns}

See [`Math.SQRT2`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT2).

### Example usage {#math-sqrt2-example}

```json
{ "inject": "math.SQRT2" }
```
