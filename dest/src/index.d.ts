/**
 * Returns an array of the items in `ob` whose keys are in `ar`.
 */
export declare function objectParamsToParams(ar: string[], ob: any): any[];
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
export declare function makeAsyncAutoTaskFunc(toExtract: any, func: any): (paramObj: any, next?: any) => any;
/**
 * Returns an array with `toExtract` at the front and a wrapped (by
 * `makeAsyncAutoTaskSpec()`) version of `func` at the rear. This makes it
 * valid a value within the key/value pairs passed as the first parameter to
 * `async.auto`.
 */
export declare function makeAsyncAutoTaskSpec(toExtract: any, func: any): any;
/**
 * Similar to `makeAsyncAutoTaskSpec()` except that it should be used with a
 * promise returning `promiseFunc` (which will be converted to a callback).
 */
export declare function makeAsyncAutoTaskSpecP(toExtract: any, promiseFunc: any): any;
/**
 * Converts a function `f` that would usually return a `Promise` into a function
 * that instead will use a callback
 */
export declare function promiseToCallback(f: any): (...ar: any[]) => any;
/**
 * This is similar to `makeAsyncAutoTaskFunc` but is for the callback at the
 * end of `async.auto`.
 */
export declare function makeAsyncAutoHandlerFunc(toExtract: any, func: any): (err: any, paramObj: any) => void;
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
export declare function asyncAutoPromise(autoStruct: any, concurrency: number | string | ((ob: any) => any), desiredTaskResult?: string | ((ob: any) => any)): Promise<{}>;
