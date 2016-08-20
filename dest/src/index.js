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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVksS0FBSyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBRS9COztHQUVHO0FBQ0gsOEJBQXFDLEVBQVksRUFBRSxFQUFFO0lBQ2pELE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUNULFVBQVMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FDbkQsQ0FBQztBQUNOLENBQUM7QUFKZSw0QkFBb0IsdUJBSW5DLENBQUE7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsK0JBQXNDLFNBQVMsRUFBRSxJQUFJO0lBQ2pELE1BQU0sQ0FBQyxVQUFTLFFBQVEsRUFBRSxJQUFLO1FBQzNCLElBQUksTUFBTSxHQUFHLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBTGUsNkJBQXFCLHdCQUtwQyxDQUFBO0FBRUQ7Ozs7O0dBS0c7QUFDSCwrQkFBc0MsU0FBUyxFQUFFLElBQUk7SUFDakQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQUZlLDZCQUFxQix3QkFFcEMsQ0FBQTtBQUVEOzs7R0FHRztBQUNILGdDQUF1QyxTQUFTLEVBQUUsV0FBVztJQUN6RCxNQUFNLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztB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