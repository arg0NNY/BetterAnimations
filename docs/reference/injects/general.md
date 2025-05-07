# Injects: General

[Injects](/create/injects) of general purpose.

## `element`

Returns a reference to an [Element](/create/layout#element) or the elements inside it matching the specified <InjectRef inject="element" parameter="selector" />.

### Parameters {#element-parameters}

#### `selector` <Badge type="info" text="optional" /> {#element-parameters-selector}

A string representing a valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) to target the elements inside an [Element](/create/layout#element).

#### `multiple` <Badge type="info" text="optional" /> {#element-parameters-multiple}

A boolean indicating whether to return all elements matching the specified <InjectRef inject="element" parameter="selector" />.
`false` by default.

### Returns {#element-returns}

[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) matching the specified <InjectRef inject="element" parameter="selector" /> or `null`
if <InjectRef inject="element" parameter="multiple" /> is `false`.

An array of [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) matching the specified <InjectRef inject="element" parameter="selector" />
if <InjectRef inject="element" parameter="multiple" /> is `true`.

If <InjectRef inject="element" parameter="selector" /> is not specified — a reference to an [Element](/create/layout#element).

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

> [!TIP]
> You can pass the [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) directly to the `target` and `targets` parameters
> of the injects and [Anime](../anime) definition to target the custom elements.

### Parameters {#hast-parameters}

#### `selector` {#hast-parameters-selector}

A string representing a valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) to target the elements.

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
  "inject": "module.type",
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
{ "inject": "type" }
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

A string representing the template for string interpolation. Use _placeholders_ `${value}`, where `value` is an index or a name of the <InjectRef inject="string.template" parameter="values" text="value" />
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

An array of or a single string representing the property name to be removed.

### Returns {#style-removeproperty-returns}

None (`undefined`).

### Example usage {#style-removeproperty-example}

```json
{
  "inject": "style.removeProperty",
  "targets": ".some-class",
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

An array of or a single [trusted function](/create/parsing#trusted-functions).
Functions receive the arguments passed to the inject itself and execute in the same order they are defined.

#### `return` <Badge type="info" text="optional" /> {#function-parameters-return}

A value to return.

> [!WARNING]
> Keep in mind that the value inside `return` is parsed **before** the <InjectRef inject="function" parameter="functions" />
> are executed.
>
> This example won't work as you might have expected:
> ```json
> {
>   "inject": "function",
>   "functions": [
>     { "inject": "var.set", "name": "someValue", "value": 10 }
>   ],
>   "return": { "inject": "var.get", "name": "someValue" } // Will return `undefined`
> }
> ```
>
> To parse the return value **after** the <InjectRef inject="function" parameter="functions" /> are executed,
> wrap the return value definition with another inject <InjectRef inject="function" /> and place it after all the other <InjectRef inject="function" parameter="functions" />:
> ```json
> {
>   "inject": "function",
>   "functions": [
>     { "inject": "var.set", "name": "someValue", "value": 10 },
>     { // [!code ++:4]
>       "inject": "function",
>       "return": { "inject": "var.get", "name": "someValue" }
>     }
>   ],
>   "return": { "inject": "var.get", "name": "someValue" } // [!code --]
> }
> ```

### Returns {#function-returns}

A value specified in <InjectRef inject="function" parameter="return" />.

If <InjectRef inject="function" parameter="return" /> is not specified — the return value of the last function passed in <InjectRef inject="function" parameter="functions" />.

If <InjectRef inject="function" parameter="return" /> is not specified and no <InjectRef inject="function" parameter="functions" /> are passed — `undefined`.

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

### Parameters {#arguments-parameters}

#### `index` <Badge type="info" text="optional" /> {#arguments-parameters-index}

An index of the argument.

### Returns {#arguments-returns}

A value of the argument under the specified <InjectRef inject="arguments" parameter="index" />.

If <InjectRef inject="arguments" parameter="index" /> is not specified — an array of argument values.

If used outside the [lazy inject](/create/injects#lazy-injects) — `undefined`.

### Example usage {#arguments-example}

```json
{
  "inject": "arguments",
  "index": 0
}
```

## `debug` <Badge type="tip" text="lazy" />

Debugs the specified <InjectRef inject="debug" parameter="data" /> into the Console. See [DevTools](https://docs.betterdiscord.app/developers/devtools#chromium-devtools).

> [!WARNING]
> All the <InjectRef inject="debug" /> injects must be removed for all the Animations before [publishing your Pack to Catalog](/create/publish).
> Use it only for debugging purposes.

### Parameters {#debug-parameters}

#### `debug` {#data-parameters-debug}

Data to debug.

### Returns {#debug-returns}

None (`undefined`).

### Example usage {#debug-example}

```json
{
  "inject": "debug",
  "data": {
    "foo": "bar"
  }
}
```

## `var.set` <Badge type="tip" text="lazy" />

Sets the <InjectRef inject="var.set" parameter="value" /> to the variable under the specified <InjectRef inject="var.set" parameter="name" />.

Variables are stored throughout the whole [Lifecycle](/create/lifecycle) of the Animation instance.

> [!TIP]
> Use inject <InjectRef inject="var.get" /> to get the value.

### Parameters {#var-set-parameters}

#### `name` {#var-set-parameters-name}

The name of a variable.

#### `value` {#var-set-parameters-value}

Value to store.

### Returns {#var-set-returns}

None (`undefined`).

### Example usage {#var-set-example}

```json
{
  "inject": "var.set",
  "name": "variableName",
  "value": {
    "foo": "bar"
  }
}
```

## `var.get`

Returns the stored value of the variable under the specified <InjectRef inject="var.get" parameter="name" />.

> [!TIP]
> Use inject <InjectRef inject="var.set" /> to store the value.

### Parameters {#var-get-parameters}

#### `name` {#var-get-parameters-name}

The name of a variable.

### Returns {#var-get-returns}

The stored value of the variable under the specified <InjectRef inject="var.get" parameter="name" />.

If the variable has not been stored — `undefined`.

### Example usage {#var-get-example}

```json
{
  "inject": "var.get",
  "name": "variableName"
}
```

## `call`

Calls the provided <InjectRef inject="call" parameter="function" /> with the specified <InjectRef inject="call" parameter="arguments" />.

### Parameters {#call-parameters}

#### `function` {#call-parameters-function}

A [trusted function](/create/parsing#trusted-functions) to call.

#### `arguments` <Badge type="info" text="optional" /> {#call-parameters-arguments}

An array of or a single argument to pass to the <InjectRef inject="call" parameter="function" />.

### Returns {#call-returns}

The value returned by the <InjectRef inject="call" parameter="function" />.

### Example usage {#call-example}

```json
{
  "inject": "call",
  "function": {
    "inject": "var.set",
    "name": "variableName",
    "value": 10
  }
}
```

## `rect`

Returns a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) object providing information about the size of an element and its position relative to the viewport.
See [`Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

### Parameters {#rect-parameters}

#### `target` <Badge type="info" text="optional" /> {#rect-parameters-target}

A single [Target](/create/anime#targets). Uses the original [Container](/create/layout#container) position by default.

#### `value` <Badge type="info" text="optional" /> {#rect-parameters-value}

Any of: `"x"`, `"y"`, `"top"`, `"left"`, `"right"`, `"bottom"`, `"width"`, `"height"`.

### Returns {#rect-returns}

The specified <InjectRef inject="rect" parameter="value" /> of a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect).

If <InjectRef inject="rect" parameter="value" /> is not specified — [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect).

### Example usage {#rect-example}

```json
{
  "inject": "rect",
  "target": { "inject": "element" },
  "value": "x"
}
```

## `window`

Returns the size of the window.

### Parameters {#window-parameters}

#### `value` {#window-parameters-value}

Any of: `"width"`, `"height"`.

### Returns {#window-returns}

The value of [`window.innerWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth) if <InjectRef inject="window" parameter="value" /> is `"width"`.

The value of [`window.innerHeight`](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight) if <InjectRef inject="window" parameter="value" /> is `"height"`.

### Example usage {#window-example}

```json
{
  "inject": "window",
  "value": "width"
}
```

## `mouse`

Returns the current mouse position relative to the original position of the [Container](/create/layout#container).

### Parameters {#mouse-parameters}

#### `value` <Badge type="info" text="optional" /> {#mouse-parameters-value}

Any of: `"x"`, `"y"`.

#### `absolute` <Badge type="info" text="optional" /> {#mouse-parameters-absolute}

A boolean indicating whether to return the mouse position relative to the viewport. `false` by default.

### Returns {#mouse-returns}

The specified coordinate (<InjectRef inject="mouse" parameter="value" />) of a current mouse position in pixels.

If the coordinate (<InjectRef inject="mouse" parameter="value" />) is not specified — a string representing the [`<length> <length>`](https://developer.mozilla.org/en-US/docs/Web/CSS/length) CSS value of the current mouse position.

### Example usage {#mouse-example}

```json
{
  "inject": "mouse",
  "value": "x",
  "absolute": true
}
```

## `isIntersected`

Returns a boolean indicating whether an Animation instance has been intersected or a value passed
to the [parameter](#isintersected-parameters) corresponding to the current value of this boolean.

See [Intersection](/create/intersection).

### Parameters {#isintersected-parameters}

Accepts any value for the following parameters: `true`, `false`.

Define all the listed parameters to activate the **switch mode**, or define none
to get a boolean indicating whether an Animation instance has been intersected.

### Returns {#isintersected-returns}

The value passed to the [parameter](#isintersected-parameters) corresponding
to the current value of a boolean indicating whether an Animation instance has been intersected in **switch mode**.

Otherwise, a boolean.

### Example usage {#isintersected-example}

```json
{ "inject": "isIntersected" }
```
```json
{
  "inject": "isIntersected",
  "true": /* ... */,
  "false": /* ... */
}
```

## `get`

Returns the value under the specified <InjectRef inject="get" parameter="key" /> or <InjectRef inject="get" parameter="path" />
of an object or an array (<InjectRef inject="get" parameter="target" />).

### Parameters {#get-parameters}

#### `target` {#get-parameters-target}

Target object or an array.

#### `key` <Badge type="info" text="optional" /> {#get-parameters-key}

A string or a number representing a key of the <InjectRef inject="get" parameter="target" />.

#### `path` <Badge type="info" text="optional" /> {#get-parameters-path}

[JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901).

### Returns {#get-returns}

A value under the specified <InjectRef inject="get" parameter="key" /> of a <InjectRef inject="get" parameter="target" />.

If <InjectRef inject="get" parameter="key" /> is not specified — a value under the specified <InjectRef inject="get" parameter="path" /> of a <InjectRef inject="get" parameter="target" />
or `undefined` if the path is invalid.

If <InjectRef inject="get" parameter="key" /> and <InjectRef inject="get" parameter="path" /> are not specified — a <InjectRef inject="get" parameter="target" /> itself.

### Example usage {#get-example}

```json
{
  "inject": "get",
  "target": {
    "foo": 0
  },
  "key": "foo"
}
```
```json
{
  "inject": "get",
  "target": {
    "foo": [
      {
        "bar": {
          "baz": 1
        }
      }
    ]
  },
  "key": "/foo/0/bar/baz"
}
```

## `if`

[`if...else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) statement implementation.

### Parameters {#if-parameters}

#### `value` {#if-parameters-value}

A value that is considered to be either [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) or [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).

#### `then` {#if-parameters-then}

A value to return if a specified <InjectRef inject="if" parameter="value" /> is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

#### `else` <Badge type="info" text="optional" /> {#if-parameters-else}

A value to return if a specified <InjectRef inject="if" parameter="value" /> is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).

### Returns {#if-returns}

A value specified in <InjectRef inject="if" parameter="then" /> if <InjectRef inject="if" parameter="value" /> is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

A value specified in <InjectRef inject="if" parameter="else" /> if <InjectRef inject="if" parameter="value" /> is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).

### Example usage {#if-example}

```json
{
  "inject": "if",
  "value": true,
  "then": { "foo": "bar" },
  "else": { "bar": "baz" }
}
```

## `switch`

[`switch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement implementation.

### Parameters {#switch-parameters}

#### `value` {#switch-parameters-value}

A value that is matched against <InjectRef inject="switch" parameter="case" /> clauses.

#### `case` {#switch-parameters-case}

A `{ [key]: value }` object or an array of `[key, value]` tuples, where:
- `key` — value to match against the <InjectRef inject="switch" parameter="value" />.
- `value` — value to return if the corresponding `key` matches the <InjectRef inject="switch" parameter="value" />.

#### `default` <Badge type="info" text="optional" /> {#switch-parameters-default}

A default value.

### Returns {#switch-returns}

A `value` of the matching <InjectRef inject="switch" parameter="case" /> clause.

If none of the <InjectRef inject="switch" parameter="case" /> clauses matches the <InjectRef inject="switch" parameter="value" /> — a <InjectRef inject="switch" parameter="default" /> value.

### Example usage {#switch-example}

```json
{
  "inject": "switch",
  "value": "bar",
  "case": {
    "foo": 0,
    "bar": "baz"
  },
  "default": 1
}
```
```json
{
  "inject": "switch",
  "value": 0,
  "case": [
    ["foo", "bar"],
    [0, "baz"]
  ],
  "default": 1
}
```

## `load`

Returns **raw** [Animate](../animate) definition of the specified <InjectRef inject="load" parameter="animation" />
in a scope of a current [Pack](../pack).

See [Extending Animations](/create/extending-animations#building-composite-animations).

### Parameters {#load-parameters}

#### `animation` {#load-parameters-animation}

A valid [`key`](../animation#key) of the [Animation](../animation).

#### `type` <Badge type="info" text="optional" /> {#load-parameters-type}

Type of the [Animate](../animate) definition to return. Any of: `"enter"`, `"exit"`.

Uses current animation's type by default.

### Returns {#load-returns}

[Animate](../animate).

### Example usage {#load-example}

```json
{
  "inject": "load",
  "animation": "animationKey"
}
```

## `raw`

Prevents the parser from going into the contents of the <InjectRef inject="raw" parameter="value" />
and returns the specified <InjectRef inject="raw" parameter="value" /> as-is.

### Parameters {#raw-parameters}

#### `value` {#raw-parameters-value}

A value to return.

### Returns {#raw-returns}

The value specified in <InjectRef inject="raw" parameter="value" />.

### Example usage {#raw-example}

```json
{
  "inject": "raw",
  "value": { "inject": "element" }
}
```
