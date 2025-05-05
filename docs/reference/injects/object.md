# Injects: Object

[Injects](/create/injects) for object manipulation.

## `assign`

Copies all properties from one or more <InjectRef inject="assign" parameter="source" /> objects to a <InjectRef inject="assign" parameter="target" /> object.
See [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### Parameters {#assign-parameters}

#### `target` {#assign-parameters-target}

A target object.

#### `source` {#assign-parameters-source}

An array of or a single source object.

### Returns {#assign-returns}

A modified <InjectRef inject="assign" parameter="target" /> object.

### Example usage {#assign-example}

```json
{
  "inject": "assign",
  "target": {
    "foo": "bar"
  },
  "source": {
    "foo": "baz",
    "bar": "baz"
  }
}
```

## `pick`

Returns an object containing the picked <InjectRef inject="pick" parameter="target" /> object properties.

### Parameters {#pick-parameters}

#### `target` {#pick-parameters-target}

A target object.

#### `keys` {#pick-parameters-keys}

An array of or a single string representing a key of the <InjectRef inject="pick" parameter="target" /> object to pick.

### Returns {#pick-returns}

An object containing the picked <InjectRef inject="pick" parameter="target" /> object properties.

### Example usage {#pick-example}

```json
{
  "inject": "pick",
  "target": {
    "foo": 0,
    "bar": 1,
    "baz": 2
  },
  "keys": ["bar", "baz"]
}
```

## `omit`

Returns an object containing the properties of the <InjectRef inject="omit" parameter="target" /> object that are not omitted.

The opposite of <InjectRef inject="pick" />.

### Parameters {#omit-parameters}

#### `target` {#omit-parameters-target}

A target object.

#### `keys` {#omit-parameters-keys}

An array of or a single string representing a key of the <InjectRef inject="pick" parameter="target" /> object to omit.

### Returns {#omit-returns}

An object containing the properties of the <InjectRef inject="omit" parameter="target" /> object that are not omitted.

### Example usage {#omit-example}

```json
{
  "inject": "omit",
  "target": {
    "foo": 0,
    "bar": 1,
    "baz": 2
  },
  "keys": ["foo", "bar"]
}
```
