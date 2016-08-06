/// <reference path="../typings/main.d.ts" />

import * as async from 'async';

export function objectParamsToParams(ar: string[], ob) {
    return ar.map(
        function(te) { return ob ? ob[te] : undefined; }
    );
}

export function makeAsyncAutoTaskFunc(toExtract, func) {
    return toExtract.concat(
        function(paramObj, next) {
            func.apply(
                this,
                objectParamsToParams(toExtract, paramObj).concat(next)
            );
        }
    );
}

export function makeAsyncAutoTaskFuncP(toExtract, promiseFunc) {
    return makeAsyncAutoTaskFunc(toExtract, promiseToCallback(promiseFunc));
}

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

export function makeAsyncAutoHandlerFunc(toExtract, func) {
    return function(err, paramObj) {
        func.apply(
            this,
            [err].concat(objectParamsToParams(toExtract, paramObj))
        );
    };
}

export function asyncAutoPromise(autoStruct, concurrency: number|string, desiredTaskResult?: string) {
    return new Promise((resolve, reject) => {
        async.auto(
            autoStruct,
            <number>(desiredTaskResult ? concurrency : 9),
            (err, results) => {
                if (err) { return reject(err); }
                let k = desiredTaskResult ? desiredTaskResult : concurrency;
                resolve(results[k]);
            }
        );
    });
}
