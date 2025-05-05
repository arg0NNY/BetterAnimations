# Injects: Array

[Injects](/create/injects) for [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) manipulation.

## `includes`

Determines whether an array (<InjectRef inject="includes" parameter="target" />) includes a certain <InjectRef inject="includes" parameter="value" /> among its entries.
See [`Array.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes).

### Parameters {#includes-parameters}

#### `target` {#includes-parameters-target}

An array.

#### `value` {#includes-parameters-value}

The value to search for.

### Returns {#includes-returns}

A boolean value indicating whether the <InjectRef inject="includes" parameter="value" /> is found within the array (<InjectRef inject="includes" parameter="target" />).

### Example usage {#includes-example}

```json
{
  "inject": "includes",
  "target": ["foo", "bar", "baz"],
  "value": "bar"
}
```
