# Parsing In-depth

By this point you should already have all the knowledge essential for building your own Animations,
as it has been covered throughout the previous pages of this documentation.

However, there are a couple of things about the parsing that were deliberately missed that you may want to get familiar with.

## Initialize stage

[Lifecycle Diagram](./lifecycle#lifecycle-diagram) states that the parsing begins only when the animation is triggered. However, that's not quite true.
There is one more additional parsing stage called **Initialize&nbsp;stage**, which is triggered when:
- Pack loads/unloads
- Selected Animation changes
- Module Settings changes

The purpose of this stage is to:
- Validate the inject references and their usage scopes.
- Parse the injects that can be parsed with a limited context — [**immediate injects**](#immediate-injects) — in advance,
  to relieve the workload of the parsing that happens when the animation triggers.
- Transform all the [lazy inject](./injects#lazy-injects) definitions into functions.

_Initialize&nbsp;stage_ is executed for all the properties of [Animate](/reference/animate), and the result of it will be used as a starting point for the parsing stages
described in [Lifecycle](./lifecycle).

That is why when you use [Debug Mode](./debug-mode), you might notice some of the injects parse only once before any of the animations trigger when the events listed above occur.

## Immediate injects

Immediate injects are injects parsed in advance to the parsing that happens when the animation triggers. See [Initialize stage](#initialize-stage).

Here is the list of all the _immediate injects_ available in _BetterAnimations_:
- <InjectRef inject="anchor" />
- <InjectRef inject="container" />
- <InjectRef inject="isIntersected" />
- <InjectRef inject="module" />
- <InjectRef inject="module.type" />
- <InjectRef inject="type" />
- <InjectRef inject="undefined" />
- <InjectRef inject="direction" />
- <InjectRef inject="duration" />
- <InjectRef inject="variant" />
- <InjectRef inject="math.E" />
- <InjectRef inject="math.LN10" />
- <InjectRef inject="math.LN2" />
- <InjectRef inject="math.LOG10E" />
- <InjectRef inject="math.LOG2E" />
- <InjectRef inject="math.PI" />
- <InjectRef inject="math.SQRT1_2" />
- <InjectRef inject="math.SQRT2" />

## Trusted functions

As a safety precaution, _BetterAnimations_ allows manipulation only with **trusted functions**:
- [Lazy injects](./injects#lazy-injects)
- Functions returned by injects, such as <InjectRef inject="stagger" /> or <InjectRef inject="utils.set" />

If an untrusted function is detected during the parsing, _BetterAnimations_ will throw an error: `Untrusted function` or `Illegal value`.
