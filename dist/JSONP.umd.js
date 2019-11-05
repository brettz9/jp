(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.JSONP = factory());
}(this, (function () { 'use strict';

  function _await(value, then, direct) {
    if (direct) {
      return then ? then(value) : value;
    }

    if (!value || !value.then) {
      value = Promise.resolve(value);
    }

    return then ? value.then(then) : value;
  }

  const JSONP = _async(function (url, options, params, callback) {
    let _exit = false;
    const _arguments = arguments;
    return _invoke(function () {
      if (Array.isArray(url)) {
        const results = [];
        return _await(url.reduce(function (p, u) {
          return _await(p, function () {
            return _await(JSONP(u, options, params, callback), function (result) {
              results.push(result);
            });
          });
        }, Promise.resolve()), function () {
          _exit = true;
          return results;
        });
      }
    }, function (_result) {
      if (_exit) return _result;

      if (_arguments.length === 1 && url && typeof url === 'object') {
        ({
          url,
          options,
          params,
          callback
        } = url);
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

      const error = (err, reject) => reject(new Error('Script loading error.')); // eslint-disable-line handle-callback-err


      const {
        appendTo,
        attrs = {},
        callbackName = ns + '.' + prefix + id++,
        callbackParam = 'callback',
        callbackParent,
        errorHandler = error,
        removeCallBack = true,
        removeScript = true,
        timeout
      } = options;
      const where = isNode ? null : appendTo ? document.querySelector(appendTo) : document.body || document.head;

      if (!isNode && !where) {
        throw new Error('No DOM element onto which one may append the script');
      }

      let script;

      if (!isNode) {
        script = document.createElement('script');
        script.async = true;
        Object.entries(attrs).forEach(([attr, attrValue]) => {
          script.setAttribute(attr, attrValue);
        });
      }

      return new Promise((resolve, reject) => {
        let timer;

        if (timeout) {
          timer = setTimeout(() => {
            reject(new Error('JSONP request timed out.'));
          }, timeout);
        }

        if (!isNode) {
          script.addEventListener('error', err => {
            errorHandler(err, reject);
          });
        }

        if (callbackName) {
          // If falsy value given, JSONP script is expected to call an existing function
          const [parent, methodName] = JSONP.findParentAndChildOfMethod(callbackName, callbackParent);

          const JSONPResponse = resp => {
            if (removeCallBack) {
              try {
                delete parent[methodName];
              } catch (e) {
                parent[methodName] = null;
              }
            }

            if (where && removeScript) where.removeChild(script);
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
          const options = {
            url,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
            }
          };
          request(options, function (err, res, body) {
            if (err) throw err;else if (res.statusCode === 200) {
              const cb = new Function(body); // eslint-disable-line no-new-func
              // eslint-disable-next-line callback-return

              cb();
            }
          });
        } else {
          // eslint-disable-next-line unicorn/prefer-node-append
          where.appendChild(script).src = url;
        }
      });
    });
  });

  function _invoke(body, then) {
    var result = body();

    if (result && result.then) {
      return result.then(then);
    }

    return then(result);
  }

  /* eslint-env node */
  const ns = 'JSONP';

  function _async(f) {
    return function () {
      for (var args = [], i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      try {
        return Promise.resolve(f.apply(this, args));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  const prefix = '__JSONP__';
  const isNode = typeof module !== 'undefined';
  let request;

  if (isNode) {
    // eslint-disable-next-line global-require
    request = require('request');
  }

  function getQuery(callbackName, callbackVal, baseUrl = '', params = {}) {
    let query = baseUrl.includes('?') ? '&' : '?';
    Object.entries(params).forEach(([key, param]) => {
      query += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '&';
    });
    return baseUrl + query + (callbackName ? callbackName + '=' + callbackVal : '');
  }

  let id = 0;
  JSONP.srcs = [];

  JSONP.findParentAndChildOfMethod = function (callbackName, baseObject = typeof window === 'undefined' ? global : window) {
    const props = callbackName.split('.');
    const methodName = props.pop();
    const parent = props.reduce((par, prop) => par[prop], baseObject);
    return [parent, methodName];
  };

  JSONP.executeCallback = function (obj, {
    callbackParam,
    baseObject
  } = {
    callbackParam: 'callback'
  }) {
    const callbackName = JSONP.srcs.shift();

    if (callbackName.trim() === 'JSONP.executeCallback') {
      throw new TypeError('JSONP.executeCallback cannot be supplied itself');
    }

    const [parent, child] = JSONP.findParentAndChildOfMethod(callbackName, baseObject);
    return parent[child](obj);
  };

  return JSONP;

})));
//# sourceMappingURL=JSONP.umd.js.map
