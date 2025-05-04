# Injects: General

[Injects](/create/injects) of general purpose.

## `element`

Returns a reference to an [Element](/create/layout#element) or the elements inside it matching the specified <InjectRef inject="element" parameter="selector" />.

### Parameters {#element-parameters}

#### `selector` <Badge type="info" text="optional" /> {#element-parameters-selector}

A string containing a valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) to target the elements inside an [Element](/create/layout#element).

#### `multiple` <Badge type="info" text="optional" /> {#element-parameters-multiple}

A boolean indicating whether to return all elements matching the specified <InjectRef inject="element" parameter="selector" />.
`false` by default.

### Returns {#element-returns}

[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) matching the specified <InjectRef inject="element" parameter="selector" /> or `null`
if <InjectRef inject="element" parameter="multiple" /> is `false`.

An array of [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) matching the specified <InjectRef inject="element" parameter="selector" />
if <InjectRef inject="element" parameter="multiple" /> is `true`.

If <InjectRef inject="element" parameter="selector" /> is not specified, a reference to an [Element](/create/layout#element).

### Example usage {#element-example}

```json
{
  "inject": "element",
  "selector": ".some-class",
  "multiple": true
}
```

## `container`

Returns a reference to a [Container](/create/layout#container).

### Parameters {#container-parameters}

Doesn't accept any parameters.

### Returns {#container-returns}

[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element).

### Example usage {#container-example}

```json
{ "inject": "container" }
```

## `anchor`

Returns a reference to an anchor element.

### Parameters {#anchor-parameters}

Doesn't accept any parameters.

### Returns {#anchor-returns}

[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) or `undefined`.

### Example usage {#anchor-example}

```json
{ "inject": "anchor" }
```

## `hast`

Returns a reference to the custom elements defined inside [`hast`](../animate#hast) matching the specified <InjectRef inject="hast" parameter="selector" />.
See [Layout](/create/layout#hast).

### Parameters {#hast-parameters}

#### `selector` {#hast-parameters-selector}

A string containing a valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) to target the elements.

#### `multiple` <Badge type="info" text="optional" /> {#hast-parameters-multiple}

A boolean indicating whether to return all elements matching the specified <InjectRef inject="hast" parameter="selector" />.
`false` by default.

### Returns {#hast-returns}

[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) matching the specified <InjectRef inject="hast" parameter="selector" /> or `null`
if <InjectRef inject="hast" parameter="multiple" /> is `false`.

An array of [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) matching the specified <InjectRef inject="hast" parameter="selector" />
if <InjectRef inject="hast" parameter="multiple" /> is `true`.

### Example usage {#hast-example}

```json
{
  "inject": "hast",
  "selector": ".some-class",
  "multiple": true
}
```

## `module`

Returns the current [Module](/usage/modules)'s key or a value passed to the [parameter](#module-parameters) corresponding to the current [Module](/usage/modules)'s key.

### Parameters {#module-parameters}

Accepts any value for the following parameters: `servers`, `channels`, `settings`, `layers`, `tooltips`, `popouts`, `contextMenu`, `messages`,
`channelList`, `modals`, `modalsBackdrop`, `membersSidebar`, `threadSidebar`, `threadSidebarSwitch`.

Define all the listed parameters to activate the **switch mode**, or define none to get the current [Module](/usage/modules)'s key.

### Returns {#module-returns}

The value passed to the [parameter](#module-parameters) corresponding to the current [Module](/usage/modules)'s key in **switch mode**.

Otherwise, any of: `"servers"`, `"channels"`, `"settings"`, `"layers"`, `"tooltips"`, `"popouts"`, `"contextMenu"`, `"messages"`,
`"channelList"`, `"modals"`, `"modalsBackdrop"`, `"membersSidebar"`, `"threadSidebar"`, `"threadSidebarSwitch"`. 

### Example usage {#module-example}

```json
{ "inject": "module" }
```
```json
{
  "inject": "module",
  "servers": /* ... */,
  "channels": /* ... */,
  "settings": /* ... */,
  "layers": /* ... */,
  "tooltips": /* ... */,
  "popouts": /* ... */,
  "contextMenu": /* ... */,
  "messages": /* ... */,
  "channelList": /* ... */,
  "modals": /* ... */,
  "modalsBackdrop": /* ... */,
  "membersSidebar": /* ... */,
  "threadSidebar": /* ... */,
  "threadSidebarSwitch": /* ... */
}
```

## `module.type`

Returns the current [Module](/usage/modules)'s type or a value passed to the [parameter](#module-type-parameters) corresponding to the current [Module](/usage/modules)'s type.
See [Basics](/usage/basics#modules).

### Parameters {#module-type-parameters}

Accepts any value for the following parameters: `switch`, `reveal`.

Define all the listed parameters to activate the **switch mode**, or define none to get the current [Module](/usage/modules)'s type.

### Returns {#module-type-returns}

The value passed to the [parameter](#module-type-parameters) corresponding to the current [Module](/usage/modules)'s type in **switch mode**.

Otherwise, any of: `"switch"`, `"reveal"`.

### Example usage {#module-type-example}

```json
{ "inject": "module.type" }
```
```json
{
  "inject": "module",
  "switch": /* ... */,
  "reveal": /* ... */
}
```

## `type`

Returns the current animation type or a value passed to the [parameter](#type-parameters) corresponding to the current animation type.
See [Basics](/usage/basics#animations).

### Parameters {#type-parameters}

Accepts any value for the following parameters: `enter`, `exit`.

Define all the listed parameters to activate the **switch mode**, or define none to get the current animation type.

### Returns {#type-returns}

The value passed to the [parameter](#type-parameters) corresponding to the current animation type in **switch mode**.

Otherwise, any of: `"enter"`, `"exit"`.

### Example usage {#type-example}

```json
{ "inject": "module.type" }
```
```json
{
  "inject": "type",
  "enter": /* ... */,
  "exit": /* ... */
}
```

## `string.template`

Utility inject for [string interpolation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#string_interpolation).

### Parameters {#string-template-parameters}

#### `template` {#string-template-parameters-template}

A string containing the template for string interpolation. Use _placeholders_ `${value}`, where `value` is an index or a name of the <InjectRef inject="string.template" parameter="values" text="value" />
you want this placeholder to be replaced with.

#### `values` {#string-template-parameters-values}

An object or an array of values to replace the _placeholders_ inside the specified <InjectRef inject="string.template" parameter="template" /> with.
The provided values are [coerced to strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion) when interpolated.

### Returns {#string-template-returns}

An interpolated string.

### Example usage {#string-template-example}

```json
{
  "inject": "string.template",
  "template": "circle(${radius} at ${position})",
  "values": {
    "radius": "20px",
    "position": "center"
  }
}
```
```json
{
  "inject": "string.template",
  "template": "polygon(${0} ${0}, ${0} ${1}, ${1} ${1}, ${1} ${0})",
  "values": ["0%", "100%"]
}
```

## `style.removeProperty` <Badge type="tip" text="lazy" />

See [`CSSStyleDeclaration.removeProperty()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/removeProperty).

### Parameters {#style-removeproperty-parameters}

#### `targets` <Badge type="info" text="optional" /> {#style-removeproperty-parameters-targets}

[Targets](/create/anime#targets). An [Element](/create/layout#element) by default.

#### `property` {#style-removeproperty-parameters-property}

An array of or a single string containing the property name to be removed.

### Returns {#style-removeproperty-returns}

None (`undefined`).

### Example usage {#style-removeproperty-example}

```json
{
  "inject": "style.removeProperty",
  "targets": { "inject": "hast", "selector": ".some-class" },
  "property": ["opacity", "transform"]
}
```

## `undefined`

Returns `undefined`.

### Parameters {#undefined-parameters}

Doesn't accept any parameters.

### Returns {#undefined-returns}

None (`undefined`).

### Example usage {#undefined-example}

```json
{ "inject": "undefined" }
```

## `function` <Badge type="tip" text="lazy" />

Executes provided <InjectRef inject="function" parameter="functions" /> and returns the specified value (<InjectRef inject="function" parameter="return" />).

Useful for [function-based values](https://animejs.com/documentation/animation/tween-value-types/function-based).

> [!TIP]
> Use inject <InjectRef inject="arguments" /> to get the value of the received arguments.

### Parameters {#function-parameters}

#### `functions` <Badge type="info" text="optional" /> {#function-parameters-functions}

An array of or a single function. Functions are executed in the same order they are defined.

#### `return` <Badge type="info" text="optional" /> {#function-parameters-return}

A value to return.

### Returns {#function-returns}

A value specified in <InjectRef inject="function" parameter="return" />.

### Example usage {#function-example}

```json
{
  "inject": "function",
  "functions": [
    { "inject": "var.set", "name": "variableName", "value": 5 },
    { "inject": "debug", "data": "`function` is called!" }
  ],
  "return": {
    "a": { "inject": "arguments", "index": 2 },
    "inject": "-",
    "b": { "inject": "arguments", "index": 1 }
  }
}
```

## `arguments`

Returns the values of the arguments received by [lazy inject](/create/injects#lazy-injects).

> [!WARNING]
> Can be used only inside the [lazy inject](/create/injects#lazy-injects).

### Parameters {#arguments-parameters}

#### `index` <Badge type="info" text="optional" /> {#arguments-parameters-index}

An index of the argument.

### Returns {#arguments-returns}

A value of the argument under the specified <InjectRef inject="arguments" parameter="index" />.

If <InjectRef inject="arguments" parameter="index" /> is not specified, an array of argument values.

### Example usage {#arguments-example}

```json
{
  "inject": "arguments",
  "index": 0
}
```
