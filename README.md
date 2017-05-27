# jsonpadding

Light JSONP wrapper for Node and the browser.

## Features

-   ES6-Promise-based (though conventional last-argument callback can be supplied)
-   Built-in `Promise.all`-type functionality
-   CommonJS/Node support (assuming global `document` or options includes `document`)
-   Produces only one global, `JSONP`. Any auto-generated callback names are (temporarily) added to it rather than to the global scope.
-   Avoids need for manually specifying conventional `[?&]callback=` in JSONP URLs though also allows manual specification of the name (e.g., for when the JSONP script does not accept a dynamic `callback` parameter) optionally resolved to a parent object and optionally renaming the parameter name itself from the conventional `"callback"` parameter name.
-   Allows specifying a map of parameters to encode.
-   Allows fine-tuned tweaking of the placement, attributes, and removal of the generated `script` tag and auto-generated callbacks.
-   Allows specification of `timeout` limits to cause a Promise rejection upon unsuccessful expirations as well as an `errorHandler` to override the default passing of a generic error object to Promise rejections.

## Full signature

```js
JSONP(urlStringOrArrayOfURLs, [options], [params], [callback]).then((result) => {});
```

One may omit any but the first argument:


```js
JSONP('//example.com/url1').then(response1 => {
    // Do something with response1
});
```

## Example usage

One may also supply the URLs as an array to get a `Promise.all` concurrency
behavior.

```js
JSONP([
    '//example.com/url1',
    '//example.com/url2'
]).then(([response1, response2]) => {
    // Do something with responses
});
```

One may alternatively supply a callback for the traditional callback style:

```js
JSONP(url, function (data, resolve, reject) {
    // Do something with "data" and optionally call resolve or reject to continue the promise chain
});
```

## Options

The most likely options for the user to desire any alteration are `errorHandler`, `timeout`, and possibly `callbackName` in case one needs to manually specify the callback name (i.e., instead of relying on the internally-used auto-generated callback name and its supplying of the response to the `then` function).

-   `appendTo` - A string selector indicator the element to which one will append script tags. Defaults to `document.body` if available or `document.head` otherwise. To force the head or body, just set this to `head` or `body`.
-   `attrs` - Map of attributes to set on the inserted `script` element. Note that `async` is set to `true` by default. Defaults to `null`.
-   `callbackName` - Dot-separated string indicating path relative to `callbackParent` (or global) object. Defaults to the string `"JSONP.__JSONP__<id>"` where `id` is an auto-incrementing ID starting at 0.
-   `callbackParam` - String to be appended to URL for (dynamic) JSON-P to indicate a callback name will follow. If set to the empty string, the entire callback key-value pair will be omitted. Defaults to `"callback"`.
-   `callbackParent` - Object on which to resolve `callbackName`. Defaults to the global scope (e.g., `window`, `self`, or `this`).
-   `document` - DOM Document object on which to run queries and create elements. Defaults to global `document`.
-   `errorHandler` - Callback if there are any errors loading the `script` element. Passed error object and `reject`. Defaults to a callback that rejects with a generic error message.
-   `params` - Alternative to and takes precedence over any `params` argument.
-   `removeCallBack` - Boolean on whether to remove any auto-generated callbacks. Defaults to `true`.
-   `removeScript` - Boolean on whether to remove the script tag when executed. Defaults to `true`.
-   `timeout` - If a number is given, the time after which to err. Defaults to `false`

## Installation

```
npm install jsonpadding
```

## Credits

-   Original code adapted from [WebReflection](http://webreflection.blogspot.com/2011/02/all-you-need-for-jsonp.html)
-   Subsequent inspiration from [simple-load-script](https://github.com/tomek-f/simple-load-script)
    and [jsonp-es6](https://github.com/franzose/jsonp-es6)
