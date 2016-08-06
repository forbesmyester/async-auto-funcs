/// <reference path="../typings/main.d.ts" />
"use strict";
var async = require('async');
function objectParamsToParams(ar, ob) {
    return ar.map(function (te) { return ob ? ob[te] : undefined; });
}
exports.objectParamsToParams = objectParamsToParams;
function makeAsyncAutoTaskFunc(toExtract, func) {
    return toExtract.concat(function (paramObj, next) {
        func.apply(this, objectParamsToParams(toExtract, paramObj).concat(next));
    });
}
exports.makeAsyncAutoTaskFunc = makeAsyncAutoTaskFunc;
function makeAsyncAutoTaskFuncP(toExtract, promiseFunc) {
    return makeAsyncAutoTaskFunc(toExtract, promiseToCallback(promiseFunc));
}
exports.makeAsyncAutoTaskFuncP = makeAsyncAutoTaskFuncP;
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
function makeAsyncAutoHandlerFunc(toExtract, func) {
    return function (err, paramObj) {
        func.apply(this, [err].concat(objectParamsToParams(toExtract, paramObj)));
    };
}
exports.makeAsyncAutoHandlerFunc = makeAsyncAutoHandlerFunc;
function asyncAutoPromise(autoStruct, concurrency, desiredTaskResult) {
    return new Promise(function (resolve, reject) {
        async.auto(autoStruct, (desiredTaskResult ? concurrency : 9), function (err, results) {
            if (err) {
                return reject(err);
            }
            var k = desiredTaskResult ? desiredTaskResult : concurrency;
            resolve(results[k]);
        });
    });
}
exports.asyncAutoPromise = asyncAutoPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkNBQTZDOztBQUU3QyxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUUvQiw4QkFBcUMsRUFBWSxFQUFFLEVBQUU7SUFDakQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQ1QsVUFBUyxFQUFFLElBQUksTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUNuRCxDQUFDO0FBQ04sQ0FBQztBQUplLDRCQUFvQix1QkFJbkMsQ0FBQTtBQUVELCtCQUFzQyxTQUFTLEVBQUUsSUFBSTtJQUNqRCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDbkIsVUFBUyxRQUFRLEVBQUUsSUFBSTtRQUNuQixJQUFJLENBQUMsS0FBSyxDQUNOLElBQUksRUFDSixvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUN6RCxDQUFDO0lBQ04sQ0FBQyxDQUNKLENBQUM7QUFDTixDQUFDO0FBVGUsNkJBQXFCLHdCQVNwQyxDQUFBO0FBRUQsZ0NBQXVDLFNBQVMsRUFBRSxXQUFXO0lBQ3pELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRmUsOEJBQXNCLHlCQUVyQyxDQUFBO0FBRUQsMkJBQWtDLENBQUM7SUFDL0IsTUFBTSxDQUFDO1FBQVMsWUFBWTthQUFaLFdBQVksQ0FBWixzQkFBWSxDQUFaLElBQVk7WUFBWiwyQkFBWTs7UUFDeEIsSUFBSSxJQUFJLEdBQXVDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWpFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNULFVBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzlCLFVBQVMsR0FBVSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDdEMsQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQztBQUNOLENBQUM7QUFkZSx5QkFBaUIsb0JBY2hDLENBQUE7QUFFRCxrQ0FBeUMsU0FBUyxFQUFFLElBQUk7SUFDcEQsTUFBTSxDQUFDLFVBQVMsR0FBRyxFQUFFLFFBQVE7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FDTixJQUFJLEVBQ0osQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQzFELENBQUM7SUFDTixDQUFDLENBQUM7QUFDTixDQUFDO0FBUGUsZ0NBQXdCLDJCQU92QyxDQUFBO0FBRUQsMEJBQWlDLFVBQVUsRUFBRSxXQUEwQixFQUFFLGlCQUEwQjtJQUMvRixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtRQUMvQixLQUFLLENBQUMsSUFBSSxDQUNOLFVBQVUsRUFDRixDQUFDLGlCQUFpQixHQUFHLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFDN0MsVUFBQyxHQUFHLEVBQUUsT0FBTztZQUNULEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLEdBQUcsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsV0FBVyxDQUFDO1lBQzVELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQ0osQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVplLHdCQUFnQixtQkFZL0IsQ0FBQSJ9