# svelte-5-event-modifiers

## About

A small module that re-adds the event modifier system to Svelte 5

## Installation

```text
npm i -D svelte-5-event-modifiers
```

## Usage

### callable

The `callable` function takes in your function as its first parameter, then all event modifiers as rest parameters

```html
<script>
    import callable, { preventDefault, self, once } from 'svelte-5-event-modifiers';

    const onclick = callable(() => {}, preventDefault, self, once);
</script>
```

### callable.forEach

For cases where you want to use the same `callable` with the `once` event modifier for each iteration of an `{#each}` loop\
The returned wrapper function takes in a unique key of type `string | number`, ideally the current index or unique key of your loop

```html
<script>
    const buttons = ['1', '2', '3'];

    const handler = callable.forEach(name => {
        console.log(`clicked button number ${name}!`);
    }, once);
</script>

{#each buttons as buttonName, index}
    <button onclick={() => handler(index)(buttonName)}>
        <span>click me!</span>
    </button>
{/each}
```

### Modifiers

Documentation for event modifiers can be found at [svelte/legacy](https://svelte.dev/docs/svelte/svelte-legacy)

## Credits and license

Event modifier code is sourced from [sveltejs/svelte](https://github.com/sveltejs/svelte) ([event-modifiers.js](https://github.com/sveltejs/svelte/tree/main/packages/svelte/src/internal/client/dom/legacy/event-modifiers.js))

<details>
    <summary>sveltejs/svelte license</summary>

```markdown
Copyright (c) 2016-2025 [Svelte Contributors](https://github.com/sveltejs/svelte/graphs/contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

</details>

License: [MIT license](LICENSE)
