# 0.2.1

-   Fix: Avoid accidental assignment of options
-   Linting: Add ESLint routine (and gitignore)

# 0.2.0

-   Breaking change: Move from bower to npm
-   Breaking change: Requires ES6 (and `Object.entries`)
-   Breaking change: No longer executes callback with `this` as the JSONP child object (just executes the callback)
-   Breaking enhancement: Supports specification of insertion point for scripts (`appendTo`) and otherwise defaults to `document.body` if available and `document.head` otherwise
-   Enhancement: CommonJS support (assumes globals available)
-   Enhancement: Supports ES6 promises, including `Promise.all` functionality when an array of URLs are given
-   Enhancement: Support options and parameters
-   Enhancement: Supports addition of attributes to script tag (with default of `async: true`)
-   Enhancement: Supports `timeout` which causes promise rejection if supplied and surpassed
-   Enhancement: Supports indication of `errorHandler` to override default rejection behavior upon script loading error
-   Enhancement: Supports `removeCallback` and `removeScript` (both default to true)
-   Enhancement: Supports `callbackName` and `callbackParent` for manually specificying function name and `callbackParam` for renaming the method; avoids adding any if `callbackName` is falsy

# 0.1.0
-   initial commit
