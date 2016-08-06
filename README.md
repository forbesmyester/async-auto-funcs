# AsyncAutoPromise: Helper functions and one wrapper for the awesome `async.auto`.

## Caolan's `async.auto` is Awesome!

When you think about asynchronous code you realise that the code you're writing is full of little sub tasks and those sub tasks sometimes have some dependencies on other little sub tasks. Eventually you will come to the conclusion that your code could, and perhaps should be, represented as a graph.

Often when looking at asynchronous code I see that things either do not happen in parallel which should, or that parameters come into a function for the sole purpose of being passed out of the function.

I've thought about it this way for a while but I've found I lacked the tools to express my code in that way, efficiently.

I recently discovered [async.auto](http://caolan.github.io/async/docs.html#.auto). If you've not seen this you should look at it, because it enables the writing of code as a series of functions that have named dependencies on other functions, which is in effect a graph. Writing code using `async.auto` can have trasformational effect on your code quality.

## If `async.auto` is so amazing, what is the purpose of the code here?

Looking through the docs for `async.auto` I was immediately struck by the power and awesomeness of it but there were details I disliked...

The first thing that struck me was that it forced my task functions to take an object parameter with many async results in it. The official example looks a bit like this:

```javascript
async.auto({
    get_data: function(callback) { ... },
    make_folder: function(callback) { ... },
    write_file: ['get_data', 'make_folder', function(results, callback) {
        var filename = results.make_folder + '/filename';
        fs.writeFile(results.get_data, filename, function(err) {
            callback(null, filename);
        });
    }],
    email_link: ['write_file', function(results, callback) {
        console.log('in email_link', JSON.stringify(results));
        // once the file is written let's email a link to it...
        // results.write_file contains the filename returned by write_file.
        callback(null, {'file':results.write_file, 'email':'user@example.com'});
    }]
}, function(err, results) {
    console.log('err = ', err);
    console.log('results = ', results);
})
```

This is all well and good and also, absolutely amazing but looking at the function signature of `write_file` which is `function(results, callback)` it seems to me to not promote code reuse too well. If I was writing this function without thinking about `async.auto` I would want this function to have one of the following two signatures:

```javascript
function(filename, data, callback) // returning void
```

```javascript
function(filename, data) // returning a Promise
```

Why are these better? Because either of those functions are general functions which you can use throughout your code base, you might even find [one already exists](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback). If we can write our code like this, we will write far less code but it will also be far more readable and of a higher quality.

## How does this code help?

This repository contains a few functions to compliment `async.auto` as well as one wrapper function which makes it return a Promise instead of using a callback. These are documented below.

### makeAsyncAutoTaskFunc / makeAsyncAutoTaskFuncP

The function `makeAsyncAutoTaskFunc` and it's Promise powered variant `makeAsyncAutoTaskFuncP` wrap the task functions in `async.auto` for the purpose of working with normal parameters.

You can now write:

```javascript
var makeAsyncAutoTaskFunc = require('async-auto-funcs').makeAsyncAutoTaskFunc;

async.auto({
    ...
    write_file: makeAsyncAutoTaskFunc(
        ['get_data', 'make_folder'],
        function(data, folder, callback) {
            var fs = require('fs'),
                filename = folder + '/index.txt';

            fs.writeFile(filename, data, function(err) {
                callback(null, filename);
            });
        }
    ),
    ...
})
```

or:

```javascript
var makeAsyncAutoTaskFuncP = require('async-auto-funcs').makeAsyncAutoTaskFuncP;

async.auto({
    ...
    write_file: makeAsyncAutoTaskFuncP(
        ['get_data', 'make_folder'],
        function(data, folder) {
            var fsp = require('fs-promise'),
                filename = folder + '/filename';

            fsp.writeFile(filename, data)
                .then(function() {
                    return filename;
                })
    ),
    ...
})
```
### makeAsyncAutoHandlerFunc

This is similar to `makeAsyncAutoTaskFunc` but is for the callback at the end of `async.auto`. It works like to this:

```javascript
var makeAsyncAutoHandlerFunc = require('async-auto-funcs').makeAsyncAutoHandlerFunc;

async.auto(
    {
        ...
        write_file: makeAsyncAutoTaskFunc(['get_data', 'make_folder'], () => { ... }),
        email_link: makeAsyncAutoTaskFunc(['write_file'], () => { ... }),
        ...
    },
    makeAsyncAutoHandlerFunc(['email_link'], function(err, email) {
        console.log("Email sent to '" + email + "'");
    })
)
```

### asyncAutoPromise

If you are:

 * writing Promise based code in general.
 * Your `async.auto` tasks use the `makeAsyncAutoTaskFuncP` which are Promise based too.
 * You find it a bit inconsistent that `async.auto` uses a final callback, which kind of breaks your happy Promise based world.

The existance of `asyncAutoPromise` converts `async.auto` into a Promise returning function so it can be used like the following:

```javascript
var asyncAutoPromise = require('async-auto-funcs').asyncAutoPromise;

asyncAutoPromise(
    {
        ...
        write_file: makeAsyncAutoTaskFunc(['get_data', 'make_folder'], () => {}),
        email_link: makeAsyncAutoTaskFunc(['write_file'], () => {}),
        ...
    },
    'email_link'
).then((email) => {
    console.log("Email sent to '" + email + "'");
});
```
