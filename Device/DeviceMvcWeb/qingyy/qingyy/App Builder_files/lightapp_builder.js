var lightapp = function(window) {
	"use strict";
	var HOST = 'http://lightapi.duapp.com';
	~function(location) {
		var m, reg = /[?&]token=([\w*-]{48})(?:&host=([^&]+))?(?:&|$)/, search = location.search, repl = null;
		if (m = reg.exec(search)) {
			// found in search
		} else if (m = reg.exec(document.referrer)) {
			// found in referer, fix location
			history.replaceState('', null, search + (search ? '&' : '?') + m[0].substr(1) + location.hash);
		} else {
			throw 'Bad page url';
		}

		console.log('[lightapp] builder mode, token=' + m[1]);
		if (m[2])
			HOST = 'http://' + decodeURIComponent(m[2]);
	}(location);

	var support = {
		ArrayBuffer : typeof ArrayBuffer !== 'undefined'
	};

	var lightapp = {
		file : {
			getQuota : function(cb) {
				request('GET', '/api/file.quota', cb);
			},
			download : function(path, cb, range) {
				request('GET', '/api/file' + path, cb, null, range && {
					Range : 'bytes=' + range[0] + '-' + range[1]
				}, true);
			},
			upload : function(path, data, cb, overwrite) {
				request('PUT', '/api/file' + path + (overwrite ? '?overwrite=true' : ''), cb, data);
			},
			mkdir : function(path, cb) {
				request('PUT', '/api/file' + path + '?dir=true', cb);
			}
		},
		app : {
			setStep : function(n) {
				postMessage('setStep', n);
			},
			setSteps : function(steps, current) {
				postMessage('setSteps', [ steps, current ]);
			},
			publish : function(cb) {
				postMessage('publish', null, cb);
			}
		},
		widget : {
			setup : function(widget, cb) {
				postMessage('widget.setup', widget, cb);
			}
		},
		callback : function(data) {
			var cid = +/&cid=(\d+)/.exec(location.search)[1];
			window.parent.postMessage({
				type : 'callback',
				id : cid,
				data : data
			}, '*');
		}
	};

	var postMessage = function() {
		var cbs = {};

		window.addEventListener('message', function(e) {
			var id = e.data.id, cb = cbs[id];
			cbs[id] = null;
			if (typeof cb === 'function')
				cb(e.data.data);
		});

		return function(type, data, cb) {
			var id;
			if (cb) {
				cbs[id = Math.random().toString(36).substr(2, 8)] = cb;
			} else {
				id = 0;
			}
			window.parent.postMessage({
				type : type,
				id : id,
				data : data
			}, '*');
		};
	}();

	'query,get,keys,setString,insert,insertString,set,unset,remove,clear,sync,addSitemap,removeSitemap,publish'.split(',')
		.forEach(function(name) {
			lightapp[name] = function() {
				var args = Array.prototype.slice.call(arguments), cb = args.pop();
				if (typeof cb !== 'function') {
					args.push(cb);
					cb = console.log.bind(console);
				}
				// assert(typeof cb === 'function');
				request('POST', '/api', cb, JSON.stringify({
					method : name,
					params : args
				}), null);
			};
		});

	return lightapp;

	function request(method, path, cb, data, headers, raw) {
		var xh = new XMLHttpRequest();
		xh.open(method, HOST + path, true);
		if (headers) {
			Object.keys(headers).forEach(function(key) {
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
		xh.addEventListener('readystatechange', function() {
			if (xh.readyState === xh.DONE) {
				var status = xh.status;
				if (status !== 200 && status !== 201 && status !== 206 && status != 500) {
					cb({
						code : status,
						message : 'ERR_BAD_RESPONSE'
					});
				} else {
					if (raw) {
						cb.call(xh, null, xh.response);
					} else {
						var ret = JSON.parse(xh.responseText);
						if (status === 500 || ret.status) {
							cb(ret);
						} else {
							cb(null, ret.data);
						}
					}
				}
			}
		});
	}

}(window);