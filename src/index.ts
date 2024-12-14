type Func = (...args: any[]) => any;
type Modifier = (fn: (...args: any[]) => void) => (...args: any[]) => void;
interface Callable {
    <F extends Func>(fn: F, ...modifiers: Modifier[]): (...args: Parameters<F>) => ReturnType<F>,

    /**
     * For cases where you want to use the same `callable` with the `once` event modifier for each iteration of an `{#each}` loop\
     * The returned wrapper function takes in a unique key of type `string | number`, ideally the current index or unique key of your loop
     * 
     * ```svelte
     * <script>
     *     const buttons = ['1', '2', '3'];
     * 
     *     const handler = callable.forEach(name => {
     *         console.log(`clicked button number ${name}!`);
     *     }, once);
     * </script>
     * 
     * {#each buttons as buttonName, index}
     *     <button onclick={() => handler(index)(buttonName)}>
     *         <span>click me!</span>
     *     </button>
     * {/each}
     * ```
     * 
     * @param fn Callback function
     * @param modifiers Event modifiers
     * @returns A function that wraps the callback function
     */
    forEach<F extends Func>(fn: F, ...modifiers: Modifier[]): (key: string | number) => (...args: Parameters<F>) => ReturnType<F>
}

export function trusted<F extends Func>(fn: F): (...args: Parameters<F>) => any {
    return function (...args) {
        var event = args[0] as Event;
        if (event.isTrusted) {
            // @ts-ignore
            fn?.apply(this, args);
        }
    };
}

export function self<F extends Func>(fn: F): (...args: Parameters<F>) => any {
    return function (...args) {
        var event = args[0] as Event;
        if (event.target === event.currentTarget) {
            // @ts-ignore
            fn?.apply(this, args);
        }
    };
}

export function stopPropagation<F extends Func>(fn: F): (...args: Parameters<F>) => any {
    return function (...args) {
        var event = args[0] as Event;
        event.stopPropagation();
        // @ts-ignore
        return fn?.apply(this, args);
    };
}

export function once<F extends Func>(fn: F): (...args: Parameters<F>) => any {
    var ran = false;

    return function (...args) {
        if (ran) return;
        ran = true;
        // @ts-ignore
        return fn?.apply(this, args);
    };
}

export function stopImmediatePropagation<F extends Func>(fn: F): (...args: Parameters<F>) => any {
    return function (...args) {
        var event = args[0] as Event;
        event.stopImmediatePropagation();
        // @ts-ignore
        return fn?.apply(this, args);
    };
}

export function preventDefault<F extends Func>(fn: F): (...args: Parameters<F>) => any {
    return function (...args) {
        var event = args[0] as Event;
        event.preventDefault();
        // @ts-ignore
        return fn?.apply(this, args);
    };
}

/**
 * Creates a callable function with event modifiers
 * 
 * ```svelte
 * <script>
 *     const onclick = callable(() => {
 *         console.log('clicked!');
 *     }, preventDefault);
 * </script>
 * 
 * <a href="/meow" {onclick}>
 *     <span>i won't redirect you!</span>
 * </a>
 * ```
 * 
 * @param fn Callback function
 * @param modifiers Event modifiers
 * @returns The callback function
 */
const callable: Callable = <F extends Func>(fn: F, ...modifiers: Modifier[]): (...args: Parameters<F>) => ReturnType<F> => {
    let acc: (...args: Parameters<F>) => any = fn;

    let arr = modifiers;

    const onceIndex = modifiers.indexOf(once);
    if (onceIndex !== -1) {
        arr.unshift(arr.splice(onceIndex, 1)[0]);
    }

    return arr.reduce((current, modifier) => modifier(current), acc);
}

callable.forEach = function <F extends Func>(fn: F, ...modifiers: Modifier[]): (key: string | number) => (...args: Parameters<F>) => ReturnType<F> {
    const handlers: Record<string | number, (...args: Parameters<F>) => ReturnType<F>> = {};

    return function (key) {
        if (!handlers[key]) {
            handlers[key] = callable(fn, ...modifiers);
        }

        return handlers[key];
    };
};

export default callable;
