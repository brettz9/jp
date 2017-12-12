(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.JSONP = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/* eslint-env node */
var ns = 'JSONP';
var prefix = '__JSONP__';

function getQuery() {
    var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callbackName = arguments[2];
    var callbackVal = arguments[3];

    var query = baseUrl.includes('?') ? '&' : '?';
    Object.entries(params).forEach(function (_ref) {
        var _ref2 = slicedToArray(_ref, 2),
            key = _ref2[0],
            param = _ref2[1];

        query += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '&';
    });
    return baseUrl + query + (callbackName ? callbackName + '=' + callbackVal : '');
}

var id = 0;
function JSONP(url, options, params, callback) {
    if (Array.isArray(url)) {
        return Promise.all(url.map(function (u) {
            return JSONP(u, options, params, callback);
        }));
    }
    if (arguments.length === 1 && url && (typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
        var _url = url;
        url = _url.url;
        options = _url.options;
        params = _url.params;
        callback = _url.callback;
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
    var error = function error(err, reject) {
        return reject(new Error('Script loading error.'));
    }; // eslint-disable-line handle-callback-err

    var _options = options,
        appendTo = _options.appendTo,
        _options$attrs = _options.attrs,
        attrs = _options$attrs === undefined ? {} : _options$attrs,
        _options$callbackName = _options.callbackName,
        callbackName = _options$callbackName === undefined ? ns + '.' + prefix + id++ : _options$callbackName,
        _options$callbackPara = _options.callbackParam,
        callbackParam = _options$callbackPara === undefined ? 'callback' : _options$callbackPara,
        callbackParent = _options.callbackParent,
        _options$errorHandler = _options.errorHandler,
        errorHandler = _options$errorHandler === undefined ? error : _options$errorHandler,
        _options$removeCallBa = _options.removeCallBack,
        removeCallBack = _options$removeCallBa === undefined ? true : _options$removeCallBa,
        _options$removeScript = _options.removeScript,
        removeScript = _options$removeScript === undefined ? true : _options$removeScript,
        timeout = _options.timeout;


    var where = appendTo ? document.querySelector(appendTo) : document.body || document.head;
    if (!where) {
        throw new Error('No DOM element onto which one may append the script');
    }

    var script = document.createElement('script');
    script.async = true;
    Object.entries(attrs).forEach(function (_ref3) {
        var _ref4 = slicedToArray(_ref3, 2),
            attr = _ref4[0],
            attrValue = _ref4[1];

        script.setAttribute(attr, attrValue);
    });

    return new Promise(function (resolve, reject) {
        var timer = void 0;
        if (timeout) {
            timer = setTimeout(function () {
                reject(new Error('JSONP request timed out.'));
            }, timeout);
        }
        script.addEventListener('error', function (err) {
            errorHandler(err, reject);
        });

        if (callbackName) {
            // If falsy value given, JSONP script is expected to call an existing function
            var _JSONP$findParentAndC = JSONP.findParentAndChildOfMethod(callbackName, callbackParent),
                _JSONP$findParentAndC2 = slicedToArray(_JSONP$findParentAndC, 2),
                parent = _JSONP$findParentAndC2[0],
                methodName = _JSONP$findParentAndC2[1];

            var JSONPResponse = function JSONPResponse(resp) {
                if (removeCallBack) {
                    try {
                        delete parent[methodName];
                    } catch (e) {
                        parent[methodName] = null;
                    }
                }
                if (removeScript) where.removeChild(script);

                clearTimeout(timer);

                if (callback) callback(resp, resolve, reject);else resolve(resp);
            };
            parent[methodName] = JSONPResponse;
        }

        JSONP.srcs.push(callbackName);
        where.appendChild(script).src = getQuery(url, params, callbackParam, callbackName);
    });
}

JSONP.srcs = [];

JSONP.findParentAndChildOfMethod = function (callbackName) {
    var baseObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : global;

    var props = callbackName.split('.');
    var methodName = props.pop();
    var parent = props.reduce(function (par, prop) {
        return par[prop];
    }, baseObject);
    return [parent, methodName];
};

JSONP.executeCallback = function (obj) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { callbackParam: 'callback' },
        callbackParam = _ref5.callbackParam,
        baseObject = _ref5.baseObject;

    var callbackName = JSONP.srcs.shift();
    if (callbackName.trim() === 'JSONP.executeCallback') {
        throw new TypeError('JSONP.executeCallback cannot be supplied itself');
    }

    var _JSONP$findParentAndC3 = JSONP.findParentAndChildOfMethod(callbackName, baseObject),
        _JSONP$findParentAndC4 = slicedToArray(_JSONP$findParentAndC3, 2),
        parent = _JSONP$findParentAndC4[0],
        child = _JSONP$findParentAndC4[1];

    return parent[child](obj);
};

return JSONP;

})));
