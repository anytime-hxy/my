/**
 * 应用管理页面
 * 
 * @author lizheng02
 * @date 2013/11/25
 */

~function(window, document) {
	"use strict";
	var $ = document.querySelector.bind(document);
	var on = window.addEventListener.bind(window);

	var appid = +location.pathname.match(/\d+/)[0], preview = /preview/.test(location.pathname);

	var publishing = false;

	var callbacks = {}, nextid = 0;

	function addCallback(cb) {
		var id = nextid++;
		callbacks[id] = cb;
		return id;
	}

	function callback(id, data) {
		var cb = callbacks[id];
		delete callbacks[id];
		cb.call(null, data);
	}

	on('message', function(e) {
		var data = e.data;
		switch (data.type) {
		case 'publish':
			if (publishing) {
				return cb(false);
				e.source.postMessage({
					id : data.id,
					data : false
				}, e.origin);
				return;
			}
			publishing = true;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', preview ? '/template/preview/' + appid + '/publish' : '/app/publish/' + appid, true);
			xhr.send();
			xhr.addEventListener('load', function() {
				publishing = false;
				var ret;
				try {
					ret = JSON.parse(xhr.responseText);
				} catch (e) {
					return cb({
						state : 1
					});
				}
				if (!ret.state) { // 成功，跳转到控制台页面
					if (preview) {
						if (confirm('您的模板刚刚成功实现了应用发布，点击确定进入应用管理界面，取消返回模板列表')) {
							location.href = '/template/preview/' + appid + '/manage';
						} else {
							location.href = '/template/my';
						}
					} else {
						if (ret.no_icon) {  //使用默认icon的应用，暂时跳转到控制台的详情页。
							location.href = document.querySelector('#bd-cloud-console-nav a').href.replace('console', 'console#light/'
								+ document.querySelector('#header .title a').getAttribute('data-openid') + '/console');
						} else {
							location.href = document.querySelector('#bd-cloud-console-nav a').href.replace('console', 'console#light/'
								+ document.querySelector('#header .title a').getAttribute('data-openid') + '/search/suc');
						}
					}
				} else {
					cb(ret);
				}
			});
			break;
		case 'widget.setup':
			var curr = $('#footer').previousElementSibling, query = curr.src;
			query = query.substr(query.indexOf('?'));

			curr.style.display = 'none';

			var cid = addCallback(function(ret) {
				curr.parentNode.removeChild(curr.nextElementSibling);
				curr.style.display = '';
				cb(ret);
			});

			curr.insertAdjacentHTML('afterEnd', '<iframe id="container" src="http://' + data.data + query + '&cid=' + cid
				+ '"></iframe>');

			break;
		case 'callback':
			callback(data.id, data.data);
			break;
		case 'setStep':
			var step = data.data - 1;
			var list = $('#nav .setup ol').children;
			for (var i = 0, L = list.length; i < L; i++) {
				list[i].className = i < step ? '' : i > step ? 'disabled' : 'on';
			}
			break;
		case 'setSteps':
			var step = data.data[1] - 1;
			$('#nav .setup ol').innerHTML = data.data[0].map(function(text, i) {
				return '<li class="' + (i < step ? '' : i > step ? 'disabled' : 'on') + '">' + text + '</li>';
			}).join('');
			break;
		}

		function cb(ret) {
			e.source.postMessage({
				id : data.id,
				data : ret
			}, e.origin);
		}
	});

}(window, document);
