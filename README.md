# jp

JSONP function with light API and which only produces one global, "JSONP".

```javascript
JSONP(url, function (data) {
    // Do something with "data"
});
```

# Credits

- Original code from [WebReflection](http://webreflection.blogspot.com/2011/02/all-you-need-for-jsonp.html).

# Todo
- Support third argument for serializing an object into the GET params.
- Support alternative to "callback" parameter
