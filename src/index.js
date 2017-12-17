/* eslint-env node */
const ns = 'JSONP';
const prefix = '__JSONP__';

const isNode = typeof module !== 'undefined';
let request;
if (isNode) {
    request = require('request');
}

function getQuery (baseUrl = '', params = {}, callbackName, callbackVal) {
    let query = baseUrl.includes('?') ? '&' : '?';
    Object.entries(params).forEach(([key, param]) => {
        query += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '&';
    });
    return baseUrl + query + (callbackName ? callbackName + '=' + callbackVal : '');
}

let id = 0;
function JSONP (url, options, params, callback) {
    if (Array.isArray(url)) {
        return Promise.all(
            url.map((u) => JSONP(u, options, params, callback))
        );
    }
    if (arguments.length === 1 && url && typeof url === 'object') {
        ({url, options, params, callback} = url);
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

    const where = isNode
        ? null
        : appendTo
            ? document.querySelector(appendTo)
            : (document.body || document.head);
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
            script.addEventListener('error', (err) => {
                errorHandler(err, reject);
            });
        }

        if (callbackName) { // If falsy value given, JSONP script is expected to call an existing function
            const [parent, methodName] = JSONP.findParentAndChildOfMethod(callbackName, callbackParent);

            const JSONPResponse = (resp) => {
                if (removeCallBack) {
                    try {
                        delete parent[methodName];
                    } catch (e) {
                        parent[methodName] = null;
                    }
                }
                if (where && removeScript) where.removeChild(script);

                clearTimeout(timer);

                if (callback) callback(resp, resolve, reject);
                else resolve(resp);
            };
            parent[methodName] = JSONPResponse;
        }

        JSONP.srcs.push(callbackName);
        url = getQuery(url, params, callbackParam, callbackName);
        if (isNode) {
            const options = {
                url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
                }
            };
            request(options, function (err, res, body) {
                if (err) throw err;
                else if (res.statusCode === 200) {
                    const cb = new Function(body); // eslint-disable-line no-new-func
                    cb();
                }
            });
        } else {
            where.appendChild(script).src = url;
        }
    });
}

JSONP.srcs = [];

JSONP.findParentAndChildOfMethod = function (callbackName, baseObject = typeof window === 'undefined' ? global : window) {
    const props = callbackName.split('.');
    const methodName = props.pop();
    const parent = props.reduce((par, prop) => par[prop], baseObject);
    return [parent, methodName];
};

JSONP.executeCallback = function (obj, {callbackParam, baseObject} = {callbackParam: 'callback'}) {
    const callbackName = JSONP.srcs.shift();
    if (callbackName.trim() === 'JSONP.executeCallback') {
        throw new TypeError('JSONP.executeCallback cannot be supplied itself');
    }
    const [parent, child] = JSONP.findParentAndChildOfMethod(callbackName, baseObject);
    return parent[child](obj);
};

export default JSONP;
