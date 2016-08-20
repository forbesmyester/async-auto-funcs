import * as async from 'async';

/**
 * Returns an array of the items in `ob` whose keys are in `ar`.
 */
export function objectParamsToParams(ar: string[], ob) {
    return ar.map(
        function(te) { return ob ? ob[te] : undefined; }
    );
}

/**
 * Wraps a function in the form:
 *
 *     function(a, b, next)
 *
 * so it is in a function that takes the form:
 *
 *     function({a: 1, b:2, c: 'unused'}, next)
 *
 * This is suitable for the function of an async.auto task.
 */
export function makeAsyncAutoTaskFunc(toExtract, func) {
    return function(paramObj, next?) {
        let params = objectParamsToParams(toExtract, paramObj).concat([next]);
        return func.apply(this, params);
    };
}

/**
 * Returns an array with `toExtract` at the front and a wrapped (by 
 * `makeAsyncAutoTaskSpec()`) version of `func` at the rear. This makes it
 * valid a value within the key/value pairs passed as the first parameter to
 * `async.auto`.
 */
export function makeAsyncAutoTaskSpec(toExtract, func) {
    return toExtract.concat(makeAsyncAutoTaskFunc(toExtract, func));
}

/**
 * Similar to `makeAsyncAutoTaskSpec()` except that it should be used with a
 * promise returning `promiseFunc` (which will be converted to a callback).
 */
export function makeAsyncAutoTaskSpecP(toExtract, promiseFunc) {
    return makeAsyncAutoTaskSpec(toExtract, promiseToCallback(promiseFunc));
}

/**
 * Converts a function `f` that would usually return a `Promise` into a function
 * that instead will use a callback
 */
export function promiseToCallback(f) {
    return function(...ar: any[]) {
        let next = <(err: Error, result?: any) => void>ar[ar.length - 1];

        let r = f.apply(this, ar);
        if (r && r.then && r.catch) {
            return r.then(
                function(a) { next(null, a); },
                function(err: Error) { next(err); }
            );
        }

        next(null, r);
    };
}

/**
 * This is similar to `makeAsyncAutoTaskFunc` but is for the callback at the
 * end of `async.auto`.
 */
export function makeAsyncAutoHandlerFunc(toExtract, func) {
    return function(err, paramObj) {
        func.apply(
            this,
            [err].concat(objectParamsToParams(toExtract, paramObj))
        );
    };
}

function extractKey(ob, korf: string|number|((ob: any) => any)): any {
    if (typeof korf == 'function') {
        let f = <(ob: any) => any>korf;
        return f(ob);
    }
    return ob[<string|number>korf];
}

/**
 * Converts the whole of `async.auto` so that it returns a `Promise`.
 *
 * The `concurency` argument is optional.
 *
 * The `desiredTaskResult` can be either a string, which is the task that you
 * want to return of in the `Promise` or it can be a function that will receive
 * all task function returns (and it is your job to calculate the return of the 
 * `Promise`).
 */
export function asyncAutoPromise(autoStruct, concurrency: number|string|((ob: any) => any), desiredTaskResult?: string|((ob: any) => any)) {
    return new Promise((resolve, reject) => {
        async.auto(
            autoStruct,
            <number>(desiredTaskResult ? concurrency : 9),
            (err, results) => {
                if (err) { return reject(err); }
                let k = desiredTaskResult ? desiredTaskResult : concurrency;
                resolve(extractKey(results, k));
            }
        );
    });
}
