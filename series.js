(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.allo = root.allo || {};
        root.allo.series = factory();
    }
}(this, function () {

    'use strict';

    var slice = Array.prototype.slice;

    /**
     * series
     *
     * Given an array of functions, it will call every function,
     * once at a time, sequentially.
     * Every function will have a trigger function as its last argument,
     * that should be called when the function is done.
     * If arguments are given to this trigger function, those will be passed
     * to the next function.
     *
     * @example
     *     series([
     *         function doSomething(next) {
     *             //when it's done
     *             next(argument1, arguments2)
     *         },
     *         function doSomethingElse(arg1, arg2, next) {
     *             // do something with the arguments,
     *             // and when it's done:
     *             next();
     *         },
     *         function doAnotherThing(next) {
     *             // because we didn't give arguments to this function
     *             // only the 'next' is available
     *             // when done.
     *             next();
     *         }
     *     ]);
     *
     *
     * @param   {Array} fns Array of functions
     */
    return function (fns) {
        (function next() {
            var args = slice.call(arguments, 0);
            fns.length && fns.shift().apply(this, args.concat(next));
        }());
    };

}));
