Minor package with async helper functions.

I'm releasing this package for my own convenience since sometimes I have to work
with code without promises/streams/events... and this is much smaller than any other
library.

Feel free to use, but...


```javascript
allo.series([
    // First call this function
    function (next) {
        // the function receives a `next` function as argument
        // call the `next` function to iterate to the next function
        next('a')
    },
    // Then call this function
    function (letter, next) {
        next(2)
    },
    function (letter, number, next) {
        // all previous functions called the `next` function meanining
        // they have completed their tasks.
        next()
    }
]);
```

```javascript
// call all the given functions at the same time
allo.parallel([
    function (done) {
        done('a');
    },
    function (done) {
        done(2);
    },
    {
        fn: function (done) {
            done(['hello', 'world']);
        },
        // Call this function when the `fn:` function says it's done
        // the `cancel` argument is a function that will cancel the call to
        // all future callbacks
        cb: function (cancel, arr) {
            // do something with `arr
        }
    },
    function (done) {
        done({foo:'bar'})
    }
], function (letter, number, array, object) {

})
```

---

Don't forget to check the [License](./License)
