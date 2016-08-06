import { objectParamsToParams, makeAsyncAutoTaskFunc, makeAsyncAutoTaskFuncP, makeAsyncAutoHandlerFunc, promiseToCallback, asyncAutoPromise } from '../src/index';
import * as async from 'async';
import test from 'ava';

function promiseErr(err) {
    return new Promise(function(resolve, reject) {
        reject(err);
    });
}

function promiseValue(v) {
    return new Promise(function(resolve) {
        resolve(v);
    });
}

test('objectParamsToParams wont break', function(t) {
    t.deepEqual(objectParamsToParams(['a'], null), [undefined]);
    t.deepEqual(objectParamsToParams(['a'], undefined), [undefined]);
    t.deepEqual(objectParamsToParams(['a'], 'abc'), [undefined]);
    t.deepEqual(objectParamsToParams(['a'], 1), [undefined]);
});

test('objectParamsToParams can flatten an object', function(t) {
    t.deepEqual(
        objectParamsToParams(['a', 'b'], {a: 1, b: 2}),
        [1, 2]
    );
});

test.cb('makeAsyncAutoTaskFunc returns function for async.auto', (t) => {
    let ar = makeAsyncAutoTaskFunc(
        ['a', 'b'],
        function readFiles(aFile, bFile, next) {
            t.is(aFile, 'x');
            t.is(bFile, 'y');
            next(1, 2);
        }
    );
    t.is(ar[0], 'a');
    t.is(ar[1], 'b');
    let func = ar[2];
    func({ a: 'x', b: 'y'}, function(a, b) {
        t.is(a, 1);
        t.is(b, 2);
        t.end();
    });
});

test.cb('promiseToCallback converts a promise returner to callback', (t) => {

    function promiseFunc(a: number, b: number) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(a + b);
            }, 5);
        });
    }

    let cbFunc = promiseToCallback(promiseFunc);

    cbFunc(1, 2, function(err, result) {
        t.is(err, null);
        t.is(result, 3);
        t.end();
    });

});


test.cb('promiseToCallback converts a promise returner to callback', (t) => {

    function promiseFunc(a) {
        return promiseErr(a + 1);
    }

    let cbFunc = promiseToCallback(promiseFunc);
    cbFunc(1, function(err, result) {
        t.is(err, 2);
        t.is(arguments.length, 1);
        t.end();
    });
});

test.cb('promiseToCallback passes through a non-promise', (t) => {

    function normalFunc(a) {
        return a + 1;
    }

    let cbFunc = promiseToCallback(normalFunc);
    cbFunc(1, function(err, result) {
        t.is(err, null);
        t.is(arguments.length, 2);
        t.end();
    });
});

test.cb('makeAsyncAutoHandlerFunc also converts to params', (t) => {

    let func = makeAsyncAutoHandlerFunc(
        ['a', 'b'],
        function readFiles(err, aFile, bFile) {
            t.is(err, null);
            t.is(aFile, 'x');
            t.is(bFile, 'y');
            t.end();
        }
    );
    func(null, { a: 'x', b: 'y'});

});

test.cb('async.auto full test', (t) => {
    async.auto(
        {
            a: (next) => { next(null, 1); },
            b: makeAsyncAutoTaskFunc(['a'], (a, next) => {
                next(null, a + 1);
            }),
            c: makeAsyncAutoTaskFunc(['b'], promiseToCallback((b) => {
                return new Promise((resolve) => {
                    resolve(b + 2);
                });
            })),
            d: makeAsyncAutoTaskFunc(['c'], promiseToCallback((c) => {
                return c + 4;
            })),
            e: makeAsyncAutoTaskFuncP(['c', 'd'], (c, d) => {
                return c + d;
            })
        },
        9,
        makeAsyncAutoHandlerFunc(['c', 'd', 'e'], function(err, c, d, e) {
            t.is(err, null);
            t.is(c, 4);
            t.is(d, 8);
            t.is(e, 12);
            t.end();
        })
    );
});

test('asyncAutoPromise full success test', (t) => {

    let autoStruct = {
            a: (next) => { next(null, 1); },
            b: makeAsyncAutoTaskFunc(['a'], (a, next) => {
                next(null, a + 1);
            }),
            c: makeAsyncAutoTaskFunc(['b'], promiseToCallback((b) => {
                return new Promise((resolve) => {
                    resolve(b + 2);
                });
            })),
            d: makeAsyncAutoTaskFunc(['c'], promiseToCallback((c) => {
                return c + 4;
            })),
            e: makeAsyncAutoTaskFuncP(['c', 'd'], (c, d) => {
                return c + d;
            })
        };
    return Promise.all([
        asyncAutoPromise(autoStruct, 9, 'e')
            .then(function(e) {
                t.is(e, 12);
            }).catch((e) => {
                t.fail();
            }),
        asyncAutoPromise(autoStruct, 'e')
            .then(function(e) {
                t.is(e, 12);
            }).catch((e) => {
                t.fail();
            }),
    ]).then((ar) => { }); // bit wierd the final `.then()` needing to be here...
});

test('asyncAutoPromise failure test', (t) => {

    return asyncAutoPromise(
        { a: (next) => { next(new Error('A Fail')); }, },
        9,
        'a'
    ).then(function(e) {
        t.fail();
    }).catch((e: Error) => {
        t.is(e.message, 'A Fail');
    });

});
