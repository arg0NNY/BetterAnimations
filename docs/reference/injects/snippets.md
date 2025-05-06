# Injects: Snippets

[Injects](/create/injects) for [Snippet](/create/snippets) manipulation.

## `snippet`

Returns the **parsed** contents of a [Snippet](../snippet) under the specified <InjectRef inject="snippet" parameter="key" />.
See [Snippets](/create/snippets).

### Parameters {#snippet-parameters}

#### `key` {#snippet-parameters-key}

A valid [`key`](../snippet#key) of a [Snippet](../snippet).

#### `params` <Badge type="info" text="optional" /> {#snippet-parameters-params}

An object representing the parameters to pass to the snippet. See [Snippets](/create/snippets#parameters).

#### `raw` <Badge type="info" text="optional" /> {#snippet-parameters-raw}

A boolean indicating whether to return the **raw** contents of a [Snippet](../snippet). `false` by default.

### Returns {#snippet-returns}

The contents ([`value`](../snippet#value)) of a [Snippet](../snippet) under the specified <InjectRef inject="snippet" parameter="key" />.

### Example usage {#snippet-example}

```json
{
  "inject": "snippet",
  "key": "mySnippet",
  "params": {
    "parameter1": "foo",
    "parameter2": 0
  }
}
```

## `snippet.params`

Returns the value of a [Snippet](../snippet) parameter under the specified <InjectRef inject="snippet.params" parameter="name" />.
See [Snippets](/create/snippets#parameters).

> [!WARNING]
> Can only be used inside a [Snippet](../snippet).

### Parameters {#snippet-params-parameters}

#### `name` {#snippet-params-parameters-name}

A string representing the name of a parameter.

### Returns {#snippet-params-returns}

The value of a parameter under the specified <InjectRef inject="snippet.params" parameter="name" />
or `undefined` if the parameter is not defined.

### Example usage {#snippet-params-example}

```json
{
  "inject": "snippet.params",
  "name": "parameter1"
}
```
