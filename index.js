/* eslint-env node */
((global) => {
'use strict';

const ns = 'JSONP';
const prefix = '__JSONP__';
const document = global.document;

function getQuery (baseUrl = '', params = {}, callbackName, callbackVal) {
    let query = baseUrl.includes('?') ? '?' : '&';
    Object.entries(params).forEach(([key, param]) => {
        query += encodeURIComponent(key) + '=' + encodeURIComponent(param) + '&';
    });

    return baseUrl + query + callbackName ? (callbackName + '=' + callbackVal) : '';
}

let id = 0;
function JSONP (uri, options = {}, params, callback) {
    if (Array.isArray(uri)) {
        return Promise.all(
            uri.map((u) => JSONP(u, options = {}, params, callback))
        );
    }
    if (typeof params === 'function') {
        callback = params;
        params = null;
    } else if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    params = options.params || params;
    const error = (err, reject) => reject(new Error('Script loading error.')); // eslint-disable-line handle-callback-err

    const {
        appendTo,
        attrs,
        callbackName = ns + '.' + prefix + id++,
        callbackParam = 'callback',
        callbackParent,
        errorHandler = error,
        removeCallBack = true,
        removeScript = true,
        timeout
    } = options;

    const where = appendTo
        ? document.querySelector(appendTo)
        : (document.body || document.head);
    if (!where) {
        throw new Error('No DOM element onto which one may append the script');
    }

    const script = document.createElement('script');
    script.async = true;
    Object.entries(attrs).forEach(([attr, attrValue]) => {
        script.setAttribute(attr, attrValue);
    });

    return new Promise((resolve, reject) => {
        let timer;
        if (timeout) {
            timer = setTimeout(() => {
                reject(new Error('JSONP request timed out.'));
            }, timeout);
        }
        script.addEventListener('error', (err) => {
            errorHandler(err, reject);
        });

        if (callbackName) { // If falsy value given, JSONP script is expected to call an existing function
            const props = callbackName.split('.');
            const lastProp = props.pop();
            const parent = props.reduce((par, prop) => par[prop], callbackParent || global);

            const JSONPResponse = (resp) => {
                if (removeCallBack) {
                    try {
                        delete parent[lastProp];
                    } catch (e) {
                        parent[lastProp] = null;
                    }
                }
                if (removeScript) where.removeChild(script);

                clearTimeout(timer);
                if (callback) callback(resp, resolve, reject);
                else resolve(resp);
            };
            parent[lastProp] = JSONPResponse;
        }

        where.appendChild(script).src = getQuery(uri, params, callbackParam, callbackName);
    });
}
if (typeof module !== 'undefined') {
    module.exports = JSONP;
} else {
    global.JSONP = JSONP;
}
})(this);
