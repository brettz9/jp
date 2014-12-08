// Adds one JSONP global
var JSONP = (function (global) {
    // (C) WebReflection Essential - Mit Style
    // cleaned up by Brett Zamir for JSLint and avoiding additional globals and need for conventional [?&]callback= in URL)
    'use strict';
    var id = 0,
        ns = 'JSONP',
        prefix = '__JSONP__',
        document = global.document,
        documentElement = document.documentElement;
    return function (uri, callback) {
        var src = prefix + id++,
            script = document.createElement('script'),
            JSONPResponse = function () {
                try { delete global[ns][src]; } catch(e) { global[ns][src] = null; }
                documentElement.removeChild(script);
                callback.apply(this, arguments);
            };
        global[ns][src] = JSONPResponse;
        documentElement.insertBefore(
            script,
            documentElement.lastChild
        ).src = uri + (uri.indexOf('?') > -1 ? '&' : '?') + 'callback=' + ns + '.' + src;
    };
}(this));
