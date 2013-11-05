var lang = [];
lang[1001] = '“什么值得买”是一个中立的，致力于帮助广大网友买到更有性价比网购产品的推荐类博客。“什么值得买”的目的是在帮助网友控制网 购的风险的同时，尽可能的向大家介绍高性价比的网购产品，让大家买着不心疼，花钱等于省钱。同时希望大家在满足自身需求的基础上理性消费，享受特价的同时尽量少的占用其他人机会和资源。';
lang[1002] = '倡导理性消费，享受品质生活';
lang[1003] = '2012:12:12 12:12:12';
lang[1004] = '刚刚';
lang[1005] = '分钟前';
lang[1006] = '小时前';
lang[1007] = '年';
lang[1008] = '月';
lang[1009] = '日 ';
var default_cls = [
	[4540, '神价格'], [3537, '手慢无'], [4541, '白菜党'], [7500, '蚊子肉'], [13191, '高端秀'],
	[8388, '八哥价'], [13463, '奇葩物'], [13438, '怀旧族'], [32501, '折腾狂'], [2509, '免费得']
];
var all_cls = [
	[3834, '数码家电'], [3876, '个护化妆'], [6616, '食品保健'], [3877, '家居生活'], [3983, '图书音像'],
	[3873, '服饰鞋包'], [3880, '母婴玩具'], [3883, '钟表首饰'], [18301, '运动户外'], [8609, '杂七杂八'],
	[99999, '其它']
];
var location_cls = ["3535", "8296"];
var config = {
	site:	'http://plugin.smzdm.com',
	getUrl: 'http://plugin.smzdm.com/api_mobile1/index.php',
	getUrlc: 'http://plugin.smzdm.com/api_mobile1/c_index.php',
	dbname: 'smzdm_db',
	version: '',
	display_name: 'SMZDM messages DB',
	size:	'2*1024*1024'
};
var Notify = function() {};
Notify.prototype = {
	isSupport: function() {
		return !!window.webkitNotifications;
	},
	getPermission: function(callback) {
		window.webkitNotifications.requestPermission(function() {
			if (callback) callback(this.checkPermission());
		});
	},
	checkPermission: function() {
		return !!(window.webkitNotifications.checkPermission() == 0);
	},
	show: function(icon, title, body) {
		var _notify = window.webkitNotifications.createNotification(icon, title, body);
		_notify.show();
	}
};
var database = function() { db = this.init(); };
database.prototype = {
	init: function() {
		return window.openDatabase(config.dbname, config.version, config.display_name, config.size, function(db) {});
	},
	creat: function(param, callback) {
		var param = param || {},
			table = param.table ? param.table : ' messages ',
			field = param.field ? param.field : '',
			callback = callback != null ? callback : function(tx, rs) {};
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS ' + table + field, [], callback, function(tx, error){
				console.log('database error:'+error.message);
			});
		});
	},
	fetch: function(param, callback) {
		var param = param || {},
			table = param.table ? param.table : ' messages ',
			field = param.field ? param.field : '*',
			where = param.where ? ' WHERE ' + param.where : '',
			order = param.order ? ' ORDER BY ' + param.order : '',
			callback = callback != null ? callback : function(tx, rs) {};
		db.transaction(function(tx) {
			tx.executeSql('SELECT ' + field + ' FROM ' + table + where + order + ' LIMIT 1', [], callback, function(tx, error){
				console.log('database error:'+error.message);
			});
		});
	},
	fetchAll: function(param, callback) {
		var param = param || {},
			table = param.table ? param.table : ' messages ',
			field = param.field ? param.field : '*',
			where = param.where ? ' WHERE ' + param.where : '',
			order = param.order ? ' ORDER BY ' + param.order : '';
		limit = param.limit ? ' LIMIT ' + param.limit : '', callback = callback != null ? callback : function(tx, rs) {};
		db.transaction(function(tx) {
			tx.executeSql('SELECT ' + field + ' FROM ' + table + where + order + limit, [], callback, function(tx, error){
				console.log('database error:'+error.message);
			});
		});
	},
	insert: function(param, callback) {
		var param = param || {},
			self = this,
			table = param.table ? param.table : ' messages ',
			data = param.data,
			callback = callback != null ? callback : function(tx, rs) {};
		if (!data) return false;
		data = self.merge(data);
		db.transaction(function(tx) {
			tx.executeSql('INSERT INTO ' + table + ' VALUES ' + data, [], callback, function(tx, error){
				console.log('database error:'+error.message);
			});
		});
	},
	update: function(param, callback) {
		var param = param || {},
			table = param.table ? param.table : ' messages ',
			data = param.data ? ' SET ' + param.data : '',
			where = param.where ? ' WHERE ' + param.where : '',
			callback = callback != null ? callback : function(tx, rs) {};
		db.transaction(function(tx) {
			tx.executeSql('UPDATE ' + table + data + where, [], callback, function(tx, error){
				console.log('database error:'+error.message);
			});
		});
	},
	dele: function(param, callback) {
		var param = param || {},
			table = param.table ? param.table : ' messages ',
			where = param.where ? ' WHERE ' + param.where : '',
			callback = callback != null ? callback : function(tx, rs) {};
		db.transaction(function(tx) {
			tx.executeSql('DELETE FROM ' + table + where, [], callback, function(tx, error){
				console.log('database error:'+error.message);
			});
		});
	},
	merge: function(data) {
		if (!data) return false;
		var str = '';
		for (var k in data) {
			str += ',"' + data[k] + '"';
		}
		return '(' + str.substring(1) + ')';
	}
};
var database = new database();
var kerData = {
	sync_message_number: function(callback){
		database.fetchAll({
			table: 'messages'
		}, function(tx, rs) {
			var message_all = 0,
				message_all_unread = 0,
				message_fav = 0,
				message_fav_unread = 0;
			for (var i = 0; i < rs.rows.length; i++) {
				var msg = rs.rows.item(i);
				if (msg.msg_fav == 0) { 
					message_all++;
					if (msg.msg_top == 0) {
						message_all_unread++;
					}
				} else {
					message_fav++;
					if (msg.msg_top == 0) {
						message_fav_unread++;
					}
				}
			}
			var bkg = chrome.extension.getBackgroundPage();
			bkg.message_config.message_all = message_all;
			bkg.message_config.message_all_unread = message_all_unread;
			bkg.message_config.message_fav = message_fav;
			bkg.message_config.message_fav_unread = message_fav_unread;
			if (message_all_unread > 0) {
				chrome.browserAction.setBadgeText({
					text: message_all_unread.toString()
				});
			} else {
				chrome.browserAction.setBadgeText({
					text: ''
				})
			}
			if (callback != null) callback(bkg.message_config);
		});
	},
	set_message_read: function(message_id){
		database.update({
			table: 'messages',
			data: 'msg_top=1',
			where: 'msg_id=' + message_id
		});
	},
	login: function() {
		var uid = this.cookie('suid') ? this.cookie('suid') : 0,
			nicename = this.cookie('snicename') ? this.cookie('snicename') : '',
			self = this;
		if (uid > 0) {
			kerData.logoutDom(nicename);
		} else {
			$('#login').on('click', function(event) {
				$('#logindiv').modal('show');
			});
		}
	},
	logoutDom: function(name){
		$('#login').remove();
		$('#line').remove();
		$('#checklogin').remove();
		$('#row1').prepend('<span id="nice">您好，' + name + '&nbsp;&nbsp;<a id="logout">退出</a></span>');
		$('#logout').click(function(){
			kerData.cookie('suid', '');
			kerData.cookie('snicename', '');
			window.location.reload();
		});
	},
	goto: function(url, callback){
		var callback = callback!=null ? callback : function(){};
		chrome.tabs.create({url: url}, callback);
	},
	array_intersect: function(a, b){
		var ai = 0,
			bi = 0;
		var result = new Array();
		while (ai < a.length && bi < b.length) {
			if (a[ai] < b[bi]) {
				ai++;
			} else if (a[ai] > b[bi]) {
				bi++;
			} else {
				result.push(a[ai]);
				ai++;
				bi++;
			}
		}
		return result;
	},
	getTime: function(beginTime) {
		var endTime = new Date().getTime();
		var secondNum = parseInt((endTime-beginTime)/1000);
		if(secondNum>=0 && secondNum<120){
			return lang[1004];
		}else if (secondNum>=120 && secondNum<3600){
			var nTime=parseInt(secondNum/60); 
			return nTime + lang[1005];
		}else if (secondNum>=3600 && secondNum<3600*15){
			var nTime=parseInt(secondNum/3600);
			return nTime + lang[1006];
		}else{
			var tm = new Date(beginTime),
				month = tm.getMonth() > 9 ? tm.getMonth()+1 : '0'+(tm.getMonth()+1),
				date = tm.getDate() > 9 ? tm.getDate() : '0'+tm.getDate(),
				hour = tm.getHours() > 9 ? tm.getHours() : '0'+tm.getHours(),
				minutes = tm.getMinutes() > 9 ? tm.getMinutes() : '0'+tm.getMinutes(),
				seconds = tm.getSeconds() > 9 ? tm.getSeconds() : '0'+tm.getSeconds();
			return tm.getFullYear()+lang[1007]+month+lang[1008]+date+lang[1009]+hour+':'+minutes+':'+seconds;
		}
	},
	cookie: function(name, value, args) {
		if (name === null) {
			var cookie = document.cookie || '';
			var c, cs = cookie.split('; ');
			for (var i = 0; i < cs.length; i++) {
				c = cs[i].split('=');
				if (c.length > 0) {
					$.cookie(c[0], null, value);
				}
			}
			return true;
		}
		if (value === undefined) {
			var cookie = document.cookie;
			if (cookie) {
				var pos1, pos2;
				pos1 = cookie.indexOf(name + '=');
				if (pos1 != -1) {
					pos1 = pos1 + name.length + 1;
					pos2 = cookie.indexOf(';', pos1);
					if (pos2 == -1) {
						pos2 = cookie.length;
					}
					return decodeURIComponent(cookie.substring(pos1, pos2));
				}
			}
			return null;
		}
		if (name !== undefined) {
			args = args || {};
			if (value === null) {
				name += '=';
				args.expires = -1;
			} else {
				name += '=' + encodeURIComponent(value);
			}
			if (args.expires) {
				if (typeof(args.expires) == 'number') {
					var expires = new Date();
					expires.setTime(expires.getTime() + args.expires * 86400000);
					name += '; expires=' + expires.toGMTString();
				} else if (args.expires.toGMTString()) {
					name += '; expires=' + args.expires.toGMTString();
				}
			}
			if (args.path) {
				name += '; path=' + args.path;
			}
			if (args.domain) {
				name += '; domain=' + args.domain;
			}
			if (args.secure) {
				name += '; secure';
			}
			document.cookie = name;
		}
	}
};