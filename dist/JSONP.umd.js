(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.JSONP = factory());
}(this, (function () { 'use strict';

  /* eslint-env node */
  var ns = 'JSONP';
  var prefix = '__JSONP__';

  var isNode = typeof module !== 'undefined';
  var request;
  if (isNode) {
    // eslint-disable-next-line global-require
    request = require('request');
  }

  function getQuery (callbackName, callbackVal, baseUrl, params) {
    if ( baseUrl === void 0 ) baseUrl = '';
    if ( params === void 0 ) params = {};

    var query = baseUrl.includes('?') ? '&' : '?';
    Object.entries(params).forEach(function (ref) {
      var key = ref[0];
      var param = ref[1];

      query += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '&';
    });
    return baseUrl + query + (callbackName ? callbackName + '=' + callbackVal : '');
  }

  var id = 0;
  function JSONP (url, options, params, callback) {
    var assign;

    if (Array.isArray(url)) {
      return Promise.all(
        url.map(function (u) { return JSONP(u, options, params, callback); })
      );
    }
    if (arguments.length === 1 && url && typeof url === 'object') {
      ((assign = url, url = assign.url, options = assign.options, params = assign.params, callback = assign.callback));
    }
    if (typeof params === 'function') {
      callback = params;
      params = null;
    } else if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (!options) {
      options = {};
    }
    params = options.params || params;
    var error = function (err, reject) { return reject(new Error('Script loading error.')); }; // eslint-disable-line handle-callback-err

    var appendTo = options.appendTo;
    var attrs = options.attrs; if ( attrs === void 0 ) attrs = {};
    var callbackName = options.callbackName; if ( callbackName === void 0 ) callbackName = ns + '.' + prefix + id++;
    var callbackParam = options.callbackParam; if ( callbackParam === void 0 ) callbackParam = 'callback';
    var callbackParent = options.callbackParent;
    var errorHandler = options.errorHandler; if ( errorHandler === void 0 ) errorHandler = error;
    var removeCallBack = options.removeCallBack; if ( removeCallBack === void 0 ) removeCallBack = true;
    var removeScript = options.removeScript; if ( removeScript === void 0 ) removeScript = true;
    var timeout = options.timeout;

    var where = isNode
      ? null
      : appendTo
        ? document.querySelector(appendTo)
        : (document.body || document.head);
    if (!isNode && !where) {
      throw new Error('No DOM element onto which one may append the script');
    }

    var script;
    if (!isNode) {
      script = document.createElement('script');
      script.async = true;
      Object.entries(attrs).forEach(function (ref) {
        var attr = ref[0];
        var attrValue = ref[1];

        script.setAttribute(attr, attrValue);
      });
    }

    return new Promise(function (resolve, reject) {
      var timer;
      if (timeout) {
        timer = setTimeout(function () {
          reject(new Error('JSONP request timed out.'));
        }, timeout);
      }
      if (!isNode) {
        script.addEventListener('error', function (err) {
          errorHandler(err, reject);
        });
      }

      if (callbackName) { // If falsy value given, JSONP script is expected to call an existing function
        var ref = JSONP.findParentAndChildOfMethod(callbackName, callbackParent);
        var parent = ref[0];
        var methodName = ref[1];

        var JSONPResponse = function (resp) {
          if (removeCallBack) {
            try {
              delete parent[methodName];
            } catch (e) {
              parent[methodName] = null;
            }
          }
          if (where && removeScript) { where.removeChild(script); }

          clearTimeout(timer);

          if (callback) {
            callback(resp, resolve, reject);
            return;
          }
          resolve(resp);
        };
        parent[methodName] = JSONPResponse;
      }

      JSONP.srcs.push(callbackName);
      url = getQuery(callbackParam, callbackName, url, params);
      if (isNode) {
        var options = {
          url: url,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
          }
        };
        request(options, function (err, res, body) {
          if (err) { throw err; }
          else if (res.statusCode === 200) {
            var cb = new Function(body); // eslint-disable-line no-new-func
            // eslint-disable-next-line callback-return
            cb();
          }
        });
      } else {
        // eslint-disable-next-line unicorn/prefer-node-append
        where.appendChild(script).src = url;
      }
    });
  }

  JSONP.srcs = [];

  JSONP.findParentAndChildOfMethod = function (callbackName, baseObject) {
    if ( baseObject === void 0 ) baseObject = typeof window === 'undefined' ? global : window;

    var props = callbackName.split('.');
    var methodName = props.pop();
    var parent = props.reduce(function (par, prop) { return par[prop]; }, baseObject);
    return [parent, methodName];
  };

  JSONP.executeCallback = function (obj, ref) {
    if ( ref === void 0 ) ref = {callbackParam: 'callback'};
    var callbackParam = ref.callbackParam;
    var baseObject = ref.baseObject;

    var callbackName = JSONP.srcs.shift();
    if (callbackName.trim() === 'JSONP.executeCallback') {
      throw new TypeError('JSONP.executeCallback cannot be supplied itself');
    }
    var ref$1 = JSONP.findParentAndChildOfMethod(callbackName, baseObject);
    var parent = ref$1[0];
    var child = ref$1[1];
    return parent[child](obj);
  };

  return JSONP;

})));
//# sourceMappingURL=JSONP.umd.js.map
