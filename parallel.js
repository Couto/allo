(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory;
    } else {
        // Browser globals (root is window)
        root.allo = root.allo || {};
        root.allo.parallel = factory();
    }
}(this, function () {
    'use strict';

    var slice = Array.prototype.slice;

    /**
     * parallel
     *
     * Given an array of functions, it will call every function,
     * in parallel.
     * Every function will have a trigger function as its last argument,
     * that should be called when the function is done.
     * If arguments are given to this trigger function, those will be passed
     * to the callback function.
     * The callback function will have as many arguments as those you passed to the
     * next function, by order.
     *
     * @example
     *     parallel([
     *         function doSomething(next) {
     *             //when it's done
     *             next(argument1, arguments2)
     *         },
     *         function doSomethingElse(arg1, arg2, next) {
     *             // do something with the arguments,
     *             // and when it's done:
     *             next();
     *         },
     *         {
     *             fn: function doAnotherThing(next) {
     *                 // because we didn't give arguments to this function
     *                 // only the 'next' is available
     *                 // when done.
     *                 next(arguments4);
     *             },
     *             // Call this function only when doAnotherThing has ended
     *             cb: function (cancel, args4) {
     *                 // It's possible to cancel all future callbacks by calling
     *                 // the 'cancel' function
     *             }
     *        }
     *     ], function (args1, args2, args4) {
     *         // All tasks were done.
     *         // and we get the argument1 and argument2 from the first
     *         // function and args4 from the third function.
     *     });
     *
     * @param   {Array}     fns      Array of functions
     * @param   {Function}  callback Function to run when every function is complete
     */
    return function (tasks, callback) {

        var counter = 0,
            results = {},
            // Flag to know if it should run callbacks
            enabled = true,
            // Setter to disable callbacks
            cancel = function () { enabled = false; },
            // function that will be given to each task, so that each task can
            // notify when it's ready.
            next = function (id) {
                // Collect the given arguments given by the task
                var args = slice.call(arguments, 1);
                // Save them in a final object
                results[id.idx] = (args.length) ? args : undefined;
                // Increment counter.
                counter += 1;
                // If the current task has an individual callback, call it,
                // passing the arguments given by the task to the next function
                // and the cancel function to give the option to disable future callbacks
                if (id.cb && enabled) { id.cb.apply(this, [cancel].concat(args));  }
                // If the counter reached the total number of tasks, call the
                // 'done' function to parse the arguments for the final callback
                if (counter === tasks.length && enabled) { done(); }
            },
            // function that will parse all the arguments from the tasks, and
            // it will call the callback arguments function given.
            done = function () {
                var finalArgs = [];
                // Sort the arguments to be in the same order that the tasks
                // given, and merge them into a single array
                Object.keys(results)
                    .sort()
                    .forEach(function (val) {
                        finalArgs = finalArgs.concat(results[val]);
                    });
                // If a callback function was given, call it, passing the
                // arguments
                if (callback) {
                    callback.apply(this, finalArgs);
                }
            };

        tasks.forEach(function (task, index) {
            // for each task in the array, check if has a property 'fn'
            // if has, run that property, otherwise the task should be
            // a function.
            // curry an object giving the current index of the task and
            // the individual callback if exists
            (task.fn || task)(next.bind(this, {
                idx: index,
                cb: task.cb
            }));
        });
    };

}));
