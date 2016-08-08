/// <reference path="../typings/main.d.ts" />
"use strict";
var async = require('async');
/**
 * Returns an array of the items in `ob` whose keys are in `ar`.
 */
function objectParamsToParams(ar, ob) {
    return ar.map(function (te) { return ob ? ob[te] : undefined; });
}
exports.objectParamsToParams = objectParamsToParams;
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
function makeAsyncAutoTaskFunc(toExtract, func) {
    return function (paramObj, next) {
        var params = objectParamsToParams(toExtract, paramObj).concat([next]);
        return func.apply(this, params);
    };
}
exports.makeAsyncAutoTaskFunc = makeAsyncAutoTaskFunc;
/**
 * Returns an array with `toExtract` at the front and a wrapped (by
 * `makeAsyncAutoTaskSpec()`) version of `func` at the rear. This makes it
 * valid a value within the key/value pairs passed as the first parameter to
 * `async.auto`.
 */
function makeAsyncAutoTaskSpec(toExtract, func) {
    return toExtract.concat(makeAsyncAutoTaskFunc(toExtract, func));
}
exports.makeAsyncAutoTaskSpec = makeAsyncAutoTaskSpec;
/**
 * Similar to `makeAsyncAutoTaskSpec()` except that it should be used with a
 * promise returning `promiseFunc` (which will be converted to a callback).
 */
function makeAsyncAutoTaskSpecP(toExtract, promiseFunc) {
    return makeAsyncAutoTaskSpec(toExtract, promiseToCallback(promiseFunc));
}
exports.makeAsyncAutoTaskSpecP = makeAsyncAutoTaskSpecP;
/**
 * Converts a function `f` that would usually return a `Promise` into a function
 * that instead will use a callback
 */
function promiseToCallback(f) {
    return function () {
        var ar = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ar[_i - 0] = arguments[_i];
        }
        var next = ar[ar.length - 1];
        var r = f.apply(this, ar);
        if (r && r.then && r.catch) {
            return r.then(function (a) { next(null, a); }, function (err) { next(err); });
        }
        next(null, r);
    };
}
exports.promiseToCallback = promiseToCallback;
/**
 * This is similar to `makeAsyncAutoTaskFunc` but is for the callback at the
 * end of `async.auto`.
 */
function makeAsyncAutoHandlerFunc(toExtract, func) {
    return function (err, paramObj) {
        func.apply(this, [err].concat(objectParamsToParams(toExtract, paramObj)));
    };
}
exports.makeAsyncAutoHandlerFunc = makeAsyncAutoHandlerFunc;
function extractKey(ob, korf) {
    if (typeof korf == 'function') {
        var f = korf;
        return f(ob);
    }
    return ob[korf];
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
function asyncAutoPromise(autoStruct, concurrency, desiredTaskResult) {
    return new Promise(function (resolve, reject) {
        async.auto(autoStruct, (desiredTaskResult ? concurrency : 9), function (err, results) {
            if (err) {
                return reject(err);
            }
            var k = desiredTaskResult ? desiredTaskResult : concurrency;
            resolve(extractKey(results, k));
        });
    });
}
exports.asyncAutoPromise = asyncAutoPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkNBQTZDOztBQUU3QyxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUUvQjs7R0FFRztBQUNILDhCQUFxQyxFQUFZLEVBQUUsRUFBRTtJQUNqRCxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FDVCxVQUFTLEVBQUUsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQ25ELENBQUM7QUFDTixDQUFDO0FBSmUsNEJBQW9CLHVCQUluQyxDQUFBO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILCtCQUFzQyxTQUFTLEVBQUUsSUFBSTtJQUNqRCxNQUFNLENBQUMsVUFBUyxRQUFRLEVBQUUsSUFBSztRQUMzQixJQUFJLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUxlLDZCQUFxQix3QkFLcEMsQ0FBQTtBQUVEOzs7OztHQUtHO0FBQ0gsK0JBQXNDLFNBQVMsRUFBRSxJQUFJO0lBQ2pELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFGZSw2QkFBcUIsd0JBRXBDLENBQUE7QUFFRDs7O0dBR0c7QUFDSCxnQ0FBdUMsU0FBUyxFQUFFLFdBQVc7SUFDekQsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFD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