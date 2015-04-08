var lightapp = function (location, encodeURIComponent) {

    var HOST, appid, token;
    (function () {
        // detect production or debugging mode
        // first try match appid from search
        var m, reg = /[?&](?:appid=(\d+)|token=([\w*-]{48}))(?:&host=([^&]+))?(?:&|$)/;
        if (m = reg.exec(location.search)) {
            // found in search
        } else if (m = reg.exec(document.referrer)) {
            // found in referer, fix location
            history.replaceState('', null, location.search + (location.search ? '&' : '?') + m[0].substr(1) + location.hash);
            document.cookie.split('; ').forEach(function (cookie) {
                var m;
                if (m = /^BDABPT\w+=/.exec(cookie)) {
                    document.cookie = m[0] + '; expires=Thu,01-Jan-1970 00:00:00 GMT; path=/';
                }
            });
        } else {
            console.warn('[lightapp] fail safe mode, appid=0');
            history.replaceState('', null, location.search + (location.search ? '&' : '?') + 'appid=0' + location.hash);
            HOST = 'http://lightapp.duapp.com';
            return;
        }
        if (m[1]) {
            console.log('[lightapp] product mode, appid=' + (appid = m[1]));
            HOST = '';
        } else {
            console.log('[lightapp] debug mode, token=' + (token = m[2]));
            if (m[3])
                HOST = 'http://' + decodeURIComponent(m[3]);
            else
                HOST = 'http://lightapp.duapp.com';
        }
    })();

    var support = {
        ArrayBuffer: typeof ArrayBuffer !== 'undefined'
    };
    var logging = 0, loggingKeys = [], callback = null;

    var lightapp = {
        host: HOST,
        file: {
            download: function (path, cb, range) {
                if (!/^\/public(?:-r)?\//.test(path)) {
                    cb({
                        message: 'ERR_BAD_PATH'
                    });
                }
                request('GET', '/api/file' + path, function (status, ret) {
                    if (status !== 200 || status !== 206) {
                        cb({
                            message: 'ERR_BAD_RESPONSE',
                            code: status
                        });
                    } else {
                        cb(null, ret);
                    }
                }, null, range && {
                    Range: 'bytes=' + range[0] + '-' + range[1]
                }, true);
            },
            upload: function (path, data, cb, overwrite) {
                request('PUT', '/api/file' + path + (overwrite ? '?overwrite=true' : ''), function (status, ret) {
                    ret = JSON.parse(ret);
                    if (status !== 200 || ret.status) {
                        cb(ret);
                    } else {
                        cb(null, ret.data);
                    }
                }, data);
            }
        },
        log: function (key) {
            if (/^\w+$/.test(key)) {
                loggingKeys.push(key);
                if (!logging)
                    logging = setTimeout(sendLog, 0);
            }
            return this;
        },
        finish: function (cb) {
            if (logging)
                callback = cb;
            else
                cb();
        },
        passport: {
            getLoginUser: function () {
                var m = /; BDLogin=(\w+):(\w*):/.exec('; ' + document.cookie);
                return m && {uid: parseInt(m[1], 36), scope: m[2]};
            },
            getLoginUserInfo: function (cb) {
                request('GET', '/api/userinfo', function (status, text) {
                    if (status === 200) {
                        cb(null, JSON.parse(text));
                    } else {
                        cb({
                            message: 'ERR_BAD_RESPONSE',
                            code: status
                        });
                    }
                });
            },
            login: function (cb, options) {
                options = Object(options);
                var user;
                if (!options.confirm_login && (user = this.getLoginUser()) && (!options.scope || user.scope.indexOf(options.scope) + 1)) {
                    return cb();
                }
                var args = {
                    client_id: 'ecVFYtml9L8EeXY55pApaVux',
                    redirect_uri: 'http://' + location.host + '/login_redirect',
                    display: "mobile",
                    response_type: "code"
                };

                if (options.vars)
                    args.redirect_uri += '?' + buildQuery(options.vars);
                ['confirm_login', 'login_type', 'login_mode', 'scope', 'disable_third_login'].forEach(function (arg) {
                    if (options.hasOwnProperty(arg)) {
                        args[arg] = options[arg];
                    }
                });

                if (typeof cb === 'function') {// callback
                    lightapp.passport._cb = cb;
                }
                if (typeof BLightApp !== 'undefined' && BLightApp.login) {
                    BLightApp.login(JSON.stringify(args), 'lightapp.passport._login_succ', 'lightapp.passport._login_fail');
                } else {
                    document.body
                        .insertAdjacentHTML(
                        'beforeEnd',
                            '<div id="lightapp_login" style="display:none;position:fixed;left:0;top:0;right:0;bottom:0;background:#FFF;z-index:9999999999;display:-webkit-box;-webkit-box-orient:vertical;display:flex;flex-direction:column"><iframe src="https://openapi.baidu.com/oauth/2.0/authorize?'
                            + buildQuery(args) + '" style="border:0;-webkit-box-flex:1;display:block"></iframe></div>');
                    var em = document.getElementById('lightapp_login');
                    em.firstChild.addEventListener('load', function () {
                        if (em.parentNode)em.style.display = '-webkit-box';
                    });
                }
            },
            _login_succ: function (result) {
                this._cb(null, result);
                this._cb = Boolean;
            },
            _login_fail: function (err) {
                this._cb(err);
                this._cb = Boolean;
            },
            _cb: Boolean
        }
    };

    var callbacks = {'onlogin': function (err, ret) {
        var em = document.getElementById('lightapp_login');
        if (!em)
            return;
        em.parentNode.removeChild(em);
        lightapp.passport._cb(err, ret);
        lightapp.passport._cb = Boolean;
    }};
    window.addEventListener('message', function (e) {
        var cb;
        if (cb = callbacks[e.data.type]) cb.apply(null, e.data.args);
    });

    [ 'query', 'get', 'keys' ].forEach(function (name) {
        lightapp[name] = function () {

            var args = Array.prototype.slice.call(arguments), cb = args.pop();
            if (typeof cb !== 'function') {
                args.push(cb);
                cb = Boolean;
            }
            request('POST', '/api', function (status, ret) {
                ret = JSON.parse(ret);
                if (status !== 200 || ret.status) {
                    cb(ret);
                } else {
                    cb(null, ret.data);
                }
            }, JSON.stringify({
                method: name,
                params: args
            }), null);
        };
    });

    return lightapp;

    function request(method, path, cb, data, headers, raw) {
        var xh = new XMLHttpRequest();
        if (logging) {
            clearTimeout(logging);
            logging = 0;
        }
        if (loggingKeys.length) {
            path += (path.indexOf('?') === -1 ? '?' : '&') + 'logging=' + loggingKeys.join(':');
            loggingKeys.length = 0;
        }
        xh.open(method, HOST + path, true);
        if (headers) {
            Object.keys(headers).forEach(function (key) {
                xh.setRequestHeader(key, headers[key]);
            });
        }
        xh.withCredentials = true;
        if (raw) {
            if (support.ArrayBuffer) {
                xh.responseType = 'arraybuffer';
            } else {
                xh.overrideMimeType('text/plain; charset=x-user-defined');
            }
        }

        xh.send(data);

        xh.addEventListener('load', function () {
            cb(xh.status, raw ? xh.response : xh.responseText);
        });
    }

    function sendLog() {
        if (logging) {
            logging = 0;
            request('GET', '/syn?_=' + Date.now(), function () {
                if (callback) {
                    callback();
                    callback = null;
                }
            });
        }
    }

    function buildQuery(obj) {
        return typeof obj === 'string' ? obj : Object.keys(obj).map(function (key) {
            return key + '=' + encodeURIComponent(obj[key]);
        }).join('&');
    }
}(location, encodeURIComponent);

var cloudaui = function (window, document) {
    var __proto__ = {
        initCbs: []
    };
    [ 'render', 'handle' ].forEach(function (entry) {
        __proto__[entry] = function () {
            init();
            this.initCbs.push(entry, Array.prototype.slice.call(arguments));
        };
    });

    // �жϵ�ǰҳ���Ƿ�������Ⱦ���������У�ִ�г�ʼ��
    if (document.querySelector('script[ui\\:rendered]')) {
        init(true);
    }
    // domready���ж��Ƿ��з��<package-name>��������������ʼ��
    document.addEventListener('DOMContentLoaded', function () {
        if (document.evaluate(".//*[contains(name(),'-')]", document.body, null, 8).singleNodeValue) {
            window.cloudaui.handle(document.body);
        }
    });

    var jsPath = document.getElementsByTagName('SCRIPT');
    jsPath = jsPath[jsPath.length - 1].src;
    jsPath = __proto__.jsPath = jsPath.substr(0, jsPath.lastIndexOf('/') + 1) + 'lightapp_smartui/';

    return Object.create(__proto__);

    function init(loading) {
        init = Boolean;
        if (loading) {
            document.write('<script src="' + jsPath + 'require.js"></script><script src="' + jsPath + 'core.js"></script>');
        } else {
            var js = document.createElement('SCRIPT');
            js.src = jsPath + "require.js";
            js.onload = function () {
                document.head.appendChild(js);
            };
            document.head.appendChild(js);
            js = document.createElement('SCRIPT');
            js.src = jsPath + "core.js";
        }
    }
}(this, document);
