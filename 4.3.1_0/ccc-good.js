(function() {
CCC = {
	'keys' : {
		'shift' : false,
		'alt'	: false,
		'ctrl'	: false
	},
	// was EUR) ) 
	// changed = EUR) ?)
	'reg'		: new RegExp(
		'(.*?)'+ // Before part
		'((USD|US|EUR) ?)?(('+String.fromCharCode(163) +'|USD|EUR|€|£|\\$) ?([,\\.\\d]+)( (USD|EUR|dollars|euros))?|' +
		//'([,\\.\\d]+) ?('+String.fromCharCode(8364)+'))( (USD|EUR))?|' +
		'([,\\.\\d]+) ?('+String.fromCharCode(8364)+'|USD|EUR))'+ // Middle euro sign or USD or EUR
		'( (USD|EUR))?|' +			// Leading usd and euro (fix this)
		'(￥) ?([,\\.\\d]+)|' +		// Yen 1
		'([,\\.\\d]+) ?(円)|' +  	// Yen 2
		'(GBP) ?([,\\.\\d]+)|' +	// Pounds related
		'([,\\.\\d]+) (dollars?|us dollars|euros??)', // Dollars, euros (literal)
		'gi'),
	
		
	'items'		: [],
	'data'		: {},
	
	'mini'		: true,
	'useElement': true,
	
	
	initialize	: function() {
		// Send host
		this.send({'host' : location.host, 'href' : location.href});
		
		// Handle DOM works 
		this.alterDOM();
		
		// Add Events
		this.addEvents();	

		return this;
	},
	
	// TODO: make this BETTER
	alterDOM	: function() {
		if(location.href.indexOf('woot.com') != -1) {
			var elements = document.querySelectorAll('span.money');
			
	 		if(elements) {
	 			elements = Array.prototype.slice.call(elements);
	 			elements.forEach(function(element, index) {
	 				element.innerHTML = element.innerHTML.replace(/<abbr[\s\S]*?>(.*?)<\/abbr>[\s\S]*?<span class="amount">(.*?)<\/span>/, '$1$2');
	 		});
	 		}
		}		
		
		// ADDED: 10/6/2010
		// TODO: Could use some fixing.
		if(location.href.indexOf('focalprice.com') != -1) {
			var elements = document.querySelectorAll('li.proPri');
 			if(elements) {
	 			elements = Array.prototype.slice.call(elements);
	 			elements.forEach(function(element, index) {
	 				element.innerHTML = element.innerHTML.replace(/.*?<span.*?>(.*?)<\/span>/, '<span class="cf60">\$$2</span>');
	 		});
	 		}
		}
		
		return this;
	},
	
	addEvents	: function() {
		//if (window == top)
		chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
			if(req.miniConverted) {
				// Send back to iframe
				var json = {
					'action' : 'miniConverted',
					'amount' : req.miniConverted	
				};
				
				if(CCC.Mini && CCC.Mini.iframe) {
					CCC.Mini.iframe.src = CCC.Mini.iframe.src.replace(/#.*$/, '') + '#' + req.miniConverted;
				}
				
				//CCC.Mini.iframeWindow.postMessage(JSON.stringify(json), CCC.Mini.iframe.src);		
			}
			
			if(req.toggle !== undefined) {
				CCC.toggle(req.toggle);
			} else {
				// Prepare data
				if(req && req.action === 'CCC.convert' && req.data) {
					CCC.prepare(req.data);
				}
			}
		});
	
		// Enable this only if mini is enabled
		if(this.mini) {
			window.addEventListener('keydown', function(event) {
				switch(event.keyCode) {
					case 16:
						CCC.keys.shift 	= true;
						break;
					case 18:
						CCC.keys.alt 	= true
						break;
					case 17:
						CCC.keys.ctrl 	= true;
						break;
				}
				
				// Toggle CCC.Mini
				if(CCC.keys.alt && CCC.keys.shift && CCC.keys.ctrl && event.keyCode === 67) {
					CCC.Mini[CCC.Mini.isOpen ? 'close' : 'open']();
				}
			});
			
			window.addEventListener('keyup', function(event) {
				switch(event.keyCode) {
					case 16:
						CCC.keys.shift 	= false;
						break;
					case 18:
						CCC.keys.alt 	= false
						break;
					case 17:
						CCC.keys.ctrl 	= false;
						break;
				}
			});
		}
		
		// AutoPatchWork support		
		window.addEventListener('AutoPatchWork.DOMNodeInserted', function(evt) {
			CCC.process(evt.target);			
		}, false);
	
		//window.addEventListener('DOMContentLoaded', function(event) {
			window.addEventListener('DOMNodeInserted', function(evt) {
			CCC.process(evt.target);
			}, false);		
		//});
		
		
		window.addEventListener('message', function(event) {
			var json;
			if(event.data === 'CCC.close') {
				CCC.Mini.close();
				return;
			}
			
			if(event.data && (json = JSON.parse(event.data) ) ) {
				if(!json.action || json.action !== 'convert') {
					return false;
				}				
				CCC.send({'miniConvert' : json});
			}
		}, false);
	
		return this;	
	},
	
	send			: function(obj) {
		chrome.extension.sendMessage(obj, function(response) {
			
		});
		
		return this;
	},
	
	prepare		: function(data) {
		this.data 			= data;
		
		// Should have be renamed symbol
		this.signs			= {
			'EUR' 	: [ String.fromCharCode(8364), true],
			'USD'	: ['$'],
			'GBP'	: ['£'],
			'JPY'	: ['¥'],
			'EGP'	: ['£'],
			
			'ALL'	: ['Lek'],
			'ARS'	: ['$'],
			'AUD'	: ['$'],
			'BOB'	: ['$b'],
			'BAM'	: ['KM'],
			'BGN'	: ['лв'],
			'BRL'	: ['R$'],
			'CAD'	: ['$'],
			'CLP'	: ['$'],
			'CNY' 	: ['¥'],
			'COP'	: ['$'],
			'HRK'	: ['kn'],
			'CUP'	: [String.fromCharCode(8369)],
			'CZK'	: ['Kč', true],
			'DKK'	: ['kr'],
			'DOP'	: ['RD$'],
			'EGP'	: ['£'],
			'EEK'	: ['kr'],
			'HKD'	: ['$'],
			'HUF'	: ['Ft'],
			'ISK'	: ['Kr'],
			'INR'	: [String.fromCharCode(8360)],
			'IDR'	: ['Rp'],
			'IRR'	: [String.fromCharCode(65020)],
			'NIS'	: ['₪'], //page - ₪.
			'JPY'	: ['¥'],
			'KZT'	: ['лв'],
			'KPW'	: [String.fromCharCode(8361)],
			'LAK'	: [String.fromCharCode(8365)],
			'LBP'	: ['£'],
			'LRD'	: ['$'],
			'LTL'	: ['Lt'],
			'MKD'	: ['ден'],
			'MYR'	: ['RM'],
			'MXN'	: ['$'],
			'MNT'	: [String.fromCharCode(8366)],
			'NZD'	: ['$'],
			'KPW'	: [String.fromCharCode(8361)],
			'NOK'	: ['kr'],
			'PKR'	: [String.fromCharCode(8360)],
			'PLN'	: ['zł'],
			'RON'	: ['lei'],
			'RUB'	: ['руб'],
			'SAR'	: [String.fromCharCode(65020)],
			'RSD'	: ['Дин'],
			'SGD'	: ['$'],
			'ZAR'	: ['R'],
			'KRW'	: [String.fromCharCode(8361)],
			'LVL'	: ['Ls'],
			'LBP'	: ['£'],
			'LRD'	: ['$'],
			'SEK'	: ['kr'],
			'TWD'	: ['NT$'],
			'UAH'	: [String.fromCharCode(8372)],
			'VND'	: ['₫'],
			'YER'	: [String.fromCharCode(65020)]
		};
	
		this.showOriginal		= data.original;
		this.changes			= 0;	// Hold num of changes
		
		// Pick up the rates and extend them
		var rates											= data.rates;	
		rates['$']											= rates['dollar'] = rates['US$'] = rates['USD'];
		rates['￥']											= rates['JPY'];
		rates['¥']											= rates['JPY'];
		rates['円']											= rates['JPY'];
		rates['円']											= rates['JPY'];
		
		rates[String.fromCharCode(165)]						= rates['JPY'];
		rates[String.fromCharCode(8364)]					= rates['euro']		= rates['EUR'];
		rates[String.fromCharCode(163)]						= rates['&#163;'] 	= rates['£']	= rates['pound'] = rates['£'] = rates['GBP'];	
		
		this.data.rates										= rates;
		
		// CHANGED: 7/1/10
		
		if(document && document.body) {
			this.process(document.body);
		}
		
		return this;
		
	},
	
	process		: function(element) {
		var runningNode, current, node, range, element, changes, start,currentChanges = CCC.items.length;
		CCC.changes = 0;
		changes = this.parse(element);

		// Nothing changed - go back
		if(!changes) {
			return false;
		}
		
			
		// Deal with CCC.items
		if(this.items && this.items.length) {
			
			this.send({'changes': CCC.items.length});
	
			for(var i = currentChanges, l = this.items.length; i< l; i++ ) {
			
				var current = this.items[i];
				if(this.useElement)	 {
					node 		= current.node;
					runningNode = runningNode || node;
					
					
					range		= document.createRange();
					start		= current.reg.offset + current.reg.before.length;
					
					element		= document.createElement('ccc');
					
					// TODO: Fix this - it's not working properly now:(
					// This is needed for the underline issues
					// element.style.position 	= 'relative';
					// element.style.zIndex 	= 0;
					
					element.textContent = current.reg.ret;
								
					// Special case
					if(node.textContent.length < start) {
						start = 0;
					}
					
					range.setStart(node, start);
					range.insertNode(element);
					range.detach(); // Free memory
					
					
					
					// Tricky part
					// Check for running node and the next one
					if(CCC.items[i + 1] && (CCC.items[i+1].node == runningNode)) {
						CCC.items[i+1].node 		= node.nextSibling.nextSibling;
						CCC.items[i+1].reg.offset 	= 0;
					} else {
						runningNode = null;
					}
					
					// Assign title to CCC element
					element.title		= current.reg.whole.slice(current.reg.before.length);
					current.node		= element.firstChild;
					current.original	= current.reg.whole.slice(current.reg.before.length);
					current.replaced	= current.reg.ret;
					
					// Highlught
					
					if(CCC.data.highlight || CCC.data.highlight == undefined) {
						this.highlight(current.node)
					}
				}
			}
		}
		
		return this;	
	},
	
	parse	: function(parent, noElement) {
		var node, ret, signData, original;
		if(!parent || parent._CCC || /(EMBED|OBJECT|VIDEO|AUDIO|CCC|IMG|STYLE|SCRIPT|IFRAME|CCC|PRE)/.test(parent.nodeName) || parent.childNodes.length == 0) {
			return false;
		}
		
		// Mark this as parsed
		// TODO: Are we so sure?
		parent._CCC = true;
		

		// Enumarate childnodes
		for(var i = 0, l = parent.childNodes.length; i < l; i++) {
			node = parent.childNodes[i];
			// Element?
			if(node.nodeType === 1) {
				
				// EXPERIMENTAL
				// FIX &quote issues
				var _index;
				if( node.innerHTML.length < 22 && (_index = node.innerHTML.indexOf('&nbsp') ) != -1 && node.innerHTML[_index - 1] && node.innerHTML[_index - 1].match(/\d/)) {
					node.innerHTML = node.innerHTML.replace(/(\d)&nbsp;(\D)/gi, '$1 $2');
				}
				
				CCC.parse(node, noElement);
				continue;
			}
							
			// Only text nodes
			if(node.nodeType !== 3) {
				continue;
			}
			
			// Original
			original			= node.textContent;
			replaced			= false;
			
			//node['innerHTML'] = node['innerHTML'].replace(/&nbsp;/g, ' ');
			// console.log(node.textContent.charAt(6));
			// Magic
			node['textContent'] = node['textContent'].replace(CCC.reg,  function(whole,before, beforeFullSign, beforeFullSignDetail, first,firstSign,firstPrice,firstFullSign,firstFullSignDetail, secondPrice,secondSign,secondFullSign, secondFullSignDetail, thirdSign, thirdPrice, fourthPrice, fourthSign, fifthFullSign, fifthPrice, sixthPrice, sixthFullString,          offset, s) {
				var sign	= firstSign	 || secondSign || thirdSign || fourthSign || fifthFullSign || sixthFullString;
				var price	= firstPrice || secondPrice	|| thirdPrice || fourthPrice || fifthPrice ||  sixthPrice;
				
				
				
				// Special care to dollars, euros
				// TODO: Make it WAY better
				if(sixthFullString) {
					sign = sign.toLowerCase().replace(/s$/, '');
					
					// A minor patch
					if(sign === 'us dollar') {
						sign = 'dollar';
					}
				}			

				// Detect regular expressions
				// TODO: Fix this mess
				if(sign === '$' && parseInt(price) <=9 && String(price).length == 1) {
					// GIT hub replaces
					if(node.parentNode.className === 's1') {
						return whole;
					}
					
					// Before and no space
					if(before && before.indexOf(' ') === -1) {
						return whole;
					}
				}
				
				// Singapure dollare
				// ADDED: 9.1.2010
				// Or BR  (ADDED: 29.1.2010)
				if( sign === '$' && (before.slice(-1)== 'S' || before.slice(-1) == 'R') ) {
					return whole;
				}
				
				
				// // Handle decimal 
				// // TODO: This is ugly, fix it.
				// if(!secondPrice) {
				// 	price = price.replace(/,/, '');
				// 	price = price.replace(/,([0-9]{1,2})/, '.$1'); // e.g 129,99 > 129.99
				// 	//console.log(price)
				// } else {
				// 	price = parseFloat(price.replace(/,/, ''));
				// }
				
				// Handle prices like II,DDD (where , is used as decimal seperator);
				
				// Remove ,	 from tho
				//if(price.indexOf('.') != -1) {
				
				// Handle numbers using , as decimals (Greek does it)
				//price = price.replace(/^([0-9]{1,2}),[0-9]*?$/, '$1.');
				
				// Remove commas 
				
				price = price.replace(/^([0-9]{1,2}),([0-9]{1,2})$/, '$1.$2');
				
				// NN,NN 
				price = price.replace(/,/g, '');
				
				
				
				// Signdata
				signData	= CCC.signs[CCC.data.currency] || [CCC.data.currency + ' '];
				
				// Same rate = bail out
				// ADDED: 7/1/2010
				if(!signData || ( CCC.data.rates[signData[0]] == CCC.data.rates[sign] ) )  {
					return whole;
				}
				
				// NO IDEA WHAT THIS IS
				if(signData && signData[0] && signData[0] == sign) {
					return whole
				}
				
				// Return;
				ret   = (parseFloat(price)/(CCC.data.rates[sign])).toFixed(2);
			//	console.log(ret);
			//	return;
				
				// Something is wrong
				if(isNaN(ret)) {
					return whole;
				}
				
				
					
				//console.log('PRICE IS ' + ret + ' round = ' + CCC.data.round);
				// ROUNDING // ADDED 2.2.2010
			
				if(CCC.data.round && CCC.data.round != '0' && ret >= parseInt(CCC.data.round) ) {
						
					//console.log('PRICE IS ' + ret + ' round = ' + CCC.data.round + ', rounded: ' + Math.round(ret));
					ret = Math.round(ret);
					
				}
				
				
				// Formating
				
				if(CCC.data.thousands || CCC.data.thousands === undefined) {
					ret = Number(ret).toFormatted(CCC.data.formatDecimal === ',' ? '.' : ',');	
				} else {
					ret = Number(ret).toFormatted('', CCC.data.formatDecimal);		
				}
							
											
				// Add to changes
				CCC.changes ++;

				if(signData) {
					if(CCC.data.separateSymbol) {
						space = ' ';
					} else {
						space = '';
					}
					if(CCC.data.formatPosition) {
						ret = CCC.data.formatPosition === 'left' ? signData[0] + space + ret : ret + space + signData[0];
					} else {
						ret = signData[1] ? ret + space + signData[0] : (signData[0] + space + ret);
					}
				} else {
					// ho ho ho
				}
				
				
				// Used below
				replaced = true;
				
				if(CCC.data.original) {
					ret = ret + ' ('+whole.slice((before || '').length)+')';
				}				
				
				// TODO maybe better
				if(CCC.data.original && !!CCC.useElement) {
					node.parentNode.title = whole;
				}
				
				
				if(CCC.useElement && !noElement) {
				
					
					CCC.items.push({
						'node'		: node,
						'original'	: original,
						'replaced'	: before ? before  + ret : ret,
						'reg'		: {
							'before'	: before || '',
							'whole'		: whole  || '',
							'offset'	: offset,
							'ret'		: ret || ''
						}
					})
					
					return before || '';
				} else {
					return before ? before + ret : ret;
				}
				
			});	
			
			// Used for non-element related stuff
			if(replaced && !CCC.useElement || noElement) {
				CCC.items.push({
					'node'		: node,
					'original'	: original,
					'replaced'	: node.textContent
				})	
			}
		}
		
		
		return CCC.changes;
	},
	
	// TODO: 
	// 1. fix this mees with multiple queries
	// 2. Optionl stuff
	highlight		: function(node) {
		var style, parent = node.parentNode, color;
		style	= document.defaultView.getComputedStyle(parent, null);
		
		if(style['backgroundColor'] == 'rgba(0, 0, 0, 0)') {
			style =  document.defaultView.getComputedStyle(parent.parentNode, null);	
		}
		
		if(style['backgroundColor'] == 'rgba(0, 0, 0, 0)') {
			style =  document.defaultView.getComputedStyle(parent.parentNode.parentNode, null);	
		}
		
		color = style['backgroundColor'];
		
		// Transparent
		if(color == 'rgba(0, 0, 0, 0)' || color == '') {
			color = 'white';
		}
		
		// This is the CCC element actually.
		parent.style.backgroundColor = 'yellow';
		
		setTimeout(function() {
			parent.style.webkitTransition 	= 'background-color 0.8s linear';
			parent.style.backgroundColor 	= color;
			// This is needed
			setTimeout(function() {
				parent.style.webkitTransition 	= 'none';
				parent.style.backgroundColor 	= 'transparent'
			}, 800);
		}, 800);
		
		
		return this;
	
	},
	
	toggle			: function(mode) {
		this.items.forEach(function(item, index) {
			item.node.textContent = item[mode === false ? 'original' : 'replaced'];
		});
		
		return this;
	}
	
}


CCC.Mini	= {
	'isOpen'		: false,
	'iframe'		: null,
	'iframeWindow'	: null,
		
	initialize		: function() {
		var iframe = document.createElement('iframe');
		iframe.src = chrome.extension.getURL('iframe.html#data='+encodeURIComponent(JSON.stringify(CCC.data)));
		document.body.appendChild(iframe);
		
		iframe.style.position 	= 'fixed';
		iframe.style.top 		= '5px';
		iframe.style.right 		= '5px';
		iframe.width 			= 320;
		iframe.height 			= 175;
		iframe.style.zIndex 	= 999999;
		iframe.style.opacity 	= .98;
		iframe.style.border 	= "2px solid #aaa";
		iframe.style.webkitBorderRadius = '3px';
		iframe.borderWidth 		= 0;
	
		this.iframe = iframe;
		
		// Post initial data
		//iframe.onload = function() {
			//iframe.src = iframe.src + '#lala=6'
			//	var port = chrome.extension.connect();
			//	port.postMessage({'mini.data' : CCC.data});
			//alert(iframe.contentWindow)
			// iframe.contentWindow.postMessage(JSON.stringify(CCC.data), iframe.src);
			// CCC.Mini.iframeWindow = iframe.contentWindow
		//}
		
		return this;		
	},
	
	open			: function() {
		// Something went wrong, and we have no data here yet.
		// Bail out
	
		// TODO: FIX THIS
		if(0)
		if(navigator.appVersion.indexOf('AppleWebKit/532.5') !== -1) {
			alert('Sorry, this BETA Chrome release has a bug regarding accessing iFrame (content)windows.\n\nPlease update to a dev release in order for this Mini Converter to work.\n\nSorry for the inconvenience ;(');
			return false;;
		}	
		
		if(!this.iframe) {
			this.initialize()
		}
		this.iframe.style.display  = 'block';	
		
		if(this.iframeWindow) {
			//this.iframeWindow.postMessage('CCC.open', this.iframe.src);
		}
		
		this.isOpen = true;
		
		return this;
	},
	
	close		: function() {
		this.iframe.style.display  = 'none';
		this.isOpen 				= false;
		window.focus();
		return this;		
	}
}



// Some prototyping
String.prototype.reverse 					= function() 		{ return this.split('').reverse().join(''); }
String.prototype.toFormatted 				= Number.prototype.toFormatted = 	function( seperator, seperatorDec, radix ) {
	// Figure out default radix
	radix 				=== undefined && (function() { 
		radix = this.toString().indexOf('.') !== -1 ? this.toString().replace(/^.+\./, '').length : 0;
	}).bind(this)();
	
	// Figure out seperators ( . OR ,)
	seperator			= seperator === undefined ?  '.' : seperator;
	var seperatorDec 	= seperatorDec ? seperatorDec : (seperator == '.' ? ',' : '.');
	
	// Get sign, integer and decimal
	var match = String(this.toFixed(radix)).match( /^(\-)?(\d+?)(\.(\d+)?)?$/);

	return ((match[1] || '')  +
	match[2].reverse().replace( /(\d{3})(?!$)/g, '$1' + seperator ).reverse() +
	( match[4] ? 	(seperatorDec || ',' ) + match[4] : '' )).
	replace(new RegExp((seperator + seperatorDec).replace(/\./g, '\\.')), seperatorDec);			// Lame:(
}



// Let the game begin
CCC.initialize();


})();




























































































































// if(0)
// (function(){
// //console.log(navigator.appVersion)
// /* START NEW */
// CCC = {
// 	shift	: false,
// 	alt		: false,
// 	ctrl	: false,
// 	isOpen	: false,
// 	data	: {},
// 	addCCC	: true,
	
// 	open	: function() {
// 		// http://osdir.com/ml/chromium-extensions/2009-11/msg00721.html
// 		if(navigator.appVersion.indexOf('AppleWebKit/532.5') !== -1) {
// 			alert('Sorry, this BETA Chrome release has a bug regarding accessing iFrame (content)windows.\n\nPlease update to a dev release in order for this Mini Converter to work.\n\nSorry for the inconvenience ;(');
// 			return false;;
// 		}		
		
// 		if(!this.iframe) {
// 			this.build();
// 		}
		
// 		this.iframe.style.display  = 'block';
		
// 		if(this.iframeWindow) {
// 		this.iframeWindow.postMessage('CCC.open', this.iframe.src);
// 		}
		
// 		this.isOpen = true;
		
// 	},
	
// 	close	: function() {
// 		this.iframe.style.display  = 'none';
// 		this.isOpen = false;
// 		window.focus();
// 		return;
// 	},
	
// 	build	: function() {
// 		var iframe = document.createElement('iframe');
// 		iframe.src = chrome.extension.getURL('iframe.html');
// 		document.body.appendChild(iframe);
		
// 		iframe.style.position = 'fixed';
// 		iframe.style.top = '5px';
// 		iframe.style.right = '5px';
// 		iframe.width = 320;
// 		iframe.height = 175;
// 		iframe.style.zIndex = 999999;
// 		iframe.style.opacity = .98;
// 		iframe.style.border = "2px solid #aaa";
// 		iframe.style.webkitBorderRadius = '3px';
// 		iframe.borderWidth = 0;
	
// 		this.iframe = iframe;
		
// 		// Post initial data
// 		iframe.onload = function() {
	
// 			iframe.contentWindow.postMessage(JSON.stringify(CCC.data), iframe.src);
// 			CCC.iframeWindow = iframe.contentWindow
// 		}
		
		
	
// 		return this;
// 	}
// }

// // Host PRE-works (woot) to add shopzilla and more
// if(location.href.match(/\.woot\.com\/[^\/]*$/)) {
// 	var elements = document.querySelectorAll('span.money');
//  	if(elements) {
//  		elements = Array.prototype.slice.call(elements);
//  		elements.forEach(function(element, index) {
 			
// 				element.innerHTML = element.innerHTML.replace(/<abbr.*?>(.*?)<\/abbr>.*?<span class="amount">(.*?)<\/span>/, '$1$2');
//  		});
//  	}
// }	
// chrome.extension.sendRequest({ 'host' : location.host, 'href' : location.href}, function(response) {
// 		// console.log(response)
// });



// window.addEventListener('keydown', function(event) {
// 	if(event.keyCode === 16) {
// 		CCC.shift = true;
// 	}
// 	if(event.keyCode === 18) {
// 		CCC.alt = true;
// 	}
	
// 	if(event.keyCode === 17 ) {
// 		CCC.ctrl = true;
// 	}
	
// 	// 67 = C
// 	if(CCC.alt && CCC.shift && CCC.ctrl && event.keyCode === 67) {
// 		//	console.log('Opening');
// 		CCC[CCC.isOpen ? 'close' : 'open']();
// 	}
// });

// window.addEventListener('keyup', function(event) {
// 	if(event.keyCode === 16) {
// 		CCC.shift = false;
// 	}
// 	if(event.keyCode === 18) {
// 		CCC.alt = false;
// 	}
	
// 	if(event.keyCode === 17 ) {
// 		CCC.ctrl = false;
// 	}
	
	
// });

// window.addEventListener('message', function(event) {
	
// 	if(event && event.data == 'CCC.close') {
// 		CCC.close();
// 		return;	
// 	}
	
// 	if(event && event.data) {
// 		var json;
		
// 		if(!(json = JSON.parse(event.data))) {
// 			return false;
// 		}
		
// 		if(!json.action && !json.action.convert) {
// 			return false;
// 		}
		
		
// 		//if(!json.converted) {
// 			chrome.extension.sendRequest({ 'miniConvert' : json }, function(response) {
// 				// console.log(response)
// 			});
// 		//}

		
// 	}
// }, false);


// /* END NEW */



// String.prototype.reverse = function() 		{ return this.split('').reverse().join(''); }

// String.prototype.toFormatted = Number.prototype.toFormatted = 	function( seperator, radix ) {
// 	// Figure out default radix
// 	var self = this;
// 	// Figure out default radix
// 	radix 				=== undefined && (function() { 
// 		radix = self.toString().indexOf('.') !== -1 ? self.toString().replace(/^.+\./, '').length : 0;
// 	})();

	
// 	// Figure out seperators ( . OR ,)
// 	seperator			= seperator || '.';
// 	var seperatorDec 	= seperator == '.' ? ',' : '.';
	
// 	// Get sign, integer and decimal
// 	var match = String(this.toFixed(radix)).match( /^(\-)?(\d+?)(\.(\d+)?)?$/);

// 	return ((match[1] || '')  +
// 	match[2].reverse().replace( /(\d{3})(?!$)/g, '$1' + seperator ).reverse() +
// 	( match[4] ? 	(seperatorDec || ',' ) + match[4] : '' )).
// 	replace(new RegExp((seperator + seperatorDec).replace(/\./g, '\\.')), seperatorDec);			// Lame:(
// }

	

// if (window == top) {
// 	chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
// 		/*	if(req.reload) {		location.reload();		return;	}		*/
		
// 		if(req.miniConverted) {
// 			// Send back to iframe
// 			var json = {
// 				'action' : 'miniConverted',
// 				'amount' : req.miniConverted	
// 			};
			
// 			// HERE IS THE TING
// 			CCC.iframeWindow.postMessage(JSON.stringify(json), CCC.iframe.src);
// 			//alert(CCC.iframe.contentWindow);
// 			//CCC.iframe.contentWindow.postMessage(JSON.stringify(json), CCC.iframe.src);
			
// 		}
// 		if(req.toggle !== undefined) {
// 				CCCToggle(req.toggle);
// 		} else {
		
// 			parsePage(req)
// 		}
// 	});
// }


// var CCCToggle	= function(mode) {

// 	window.CCCContent.forEach(function(item, index) {
		
// 		item.node.textContent = item[mode === false ? 'original' : 'replaced'];
// 	});
// }

// var parsePage = function(data) {
// 	CCC.data = data;
// 	window.CCCContent = [];
// 	var signs						= {
// 		'EUR' 	: [ String.fromCharCode(8364), true],
// 		'USD'	: ['$'],
// 		'GBP'	: ['£'],
// 		'JPY'	: ['¥'],
// 		'EGP'	: ['£']
		
// 		//'SAR'	: ['SAR', false]
// 		//'SAR'	: ['SAR', false]
// 	}	
// 	var original										= data.original;
// 	var changes 										= 0;	
// 	var rates											= data.rates;
// 	rates['$']											= rates['dollar'] = rates['USD'];
// 	rates['￥']											= rates['JPY'];
// 	rates['¥']											= rates['JPY'];
// 	rates['円']											= rates['JPY'];
// 	rates['円']											= rates['JPY'];
	
// 	rates[String.fromCharCode(165)]						= rates['JPY'];
// 	rates[String.fromCharCode(8364)]					= rates['euro'] = rates['EUR'];
// 	rates[String.fromCharCode(163)]						= rates['&#163;'] = rates['£']	= rates['pound'] = rates['£'] = rates['GBP'];

	
// 	//var reg			= new RegExp('(.*?)(('+String.fromCharCode(163) +'|£|\\$) ?([,\\.\\d]+)( (USD|EUR))?|([,\\.\\d]+) ?('+String.fromCharCode(8364)+'))( (USD|EUR))?|(￥) ?([,\\.\\d]+)|([,\\.\\d]+) ?(円)', 'g');	
	
// 	var reg			= new RegExp('(.*?)((USD|US|EUR) )?(('+String.fromCharCode(163) +'|€|£|\\$) ?([,\\.\\d]+)( (USD|EUR|dollars|euros|pounds))?|([,\\.\\d]+) ?('+String.fromCharCode(8364)+'))( (USD|EUR))?|(￥) ?([,\\.\\d]+)|([,\\.\\d]+) ?(円)|(GBP) ?([,\\.\\d]+)|([,\\.\\d]+) (dollars?|euros?|pounds?)', 'g');	
	
// 	// THIS IS THE PREVIOUS REGEXP WITHOUTH THE USD|EUR
// 	//var reg			= new RegExp('(('+String.fromCharCode(163) +'|£|\\$) ?([,\\.\\d]+)|([,\\.\\d]+) ?('+String.fromCharCode(8364)+'))|(￥) ?([,\\.\\d]+)|([,\\.\\d]+) ?(円)', 'g');	
// 	var attr		= window.ActiveX ? 'innerText' : 'textContent'; // hah;p
	
// 	// AutoPatchWork support		
// 	window.addEventListener('AutoPatchWork.DOMNodeInserted', function(evt) {
// 		parser(evt.target, true)
		
		
// 		chrome.extension.sendRequest({ 'changes' : window.CCCContent.length }, function(response) {
// 			// console.log(response)
// 			});	
// 	}, false);


// 	// NOT FOR NOW
// 	//if(0)
// 	window.addEventListener('DOMNodeInserted', function(evt) {
// 		if(evt.target.nodeType === 1 && evt.target.nodeName !== 'CCC' && evt.target.nodeName !== 'STYLE') {
// 			//alert(evt.srcElement)
// 			//alert(evt.srcElement.innerHTML)
		
// 			parser(evt.target, true)
			
			
// 				chrome.extension.sendRequest({ 'changes' : window.CCCContent.length }, function(response) {
// 			// console.log(response)
// 			});
// 		}
// 	}, false);
	
	
// 	// 	window.addEventListener('DOMNodeRemoved', function(evt) {
// 	// 			var tempArray = [];
				
// 	// 			window.CCCContent.forEach(function(item, index) {
// 	// 					console.log(1);
// 	// 				if(item.node.parentNode) {
						
// 	// 					tempArray.push(item);
// 	// 				}
// 	// 			});
// 	// 		//window.CCCContent = tempArray;
			
// 	// 		//c//hrome.extension.sendRequest({ 'changes' : window.CCCContent.length }, function(response) {
// 	// 		// console.log(response)
// 	// 			//});
// 	// }, false);
	
	
	
// 	// LAME :p
// 	var highlight 	= function(node) {
// 		var style;
// 		if(!node.__ccParent) {
// 			node.__ccParent 	= node.parentNode;
// 			style = document.defaultView.getComputedStyle(node.__ccParent, null);
			
// 			if(style['backgroundColor'] == 'rgba(0, 0, 0, 0)') {
// 				style = document.defaultView.getComputedStyle(node.__ccParent.parentNode, null);
// 			}
			
// 			if(style['backgroundColor'] == 'rgba(0, 0, 0, 0)') {
// 				style = document.defaultView.getComputedStyle(node.__ccParent.parentNode.parentNode, null);
// 			}

// 			node.__ccColor	= style['backgroundColor'];			
			
// 			// tansparent
// 			if(node.__ccColor === 'rgba(0, 0, 0, 0)') {
// 				node.__ccColor = 'white';
// 				node.__cccColorTrans = true;
// 			}
			
			
// 			node.__ccParent.style.backgroundColor = 'yellow';
			
// 			setTimeout((function() {
// 				node.__ccParent.style.webkitTransition = 'background-color 1s linear';
				
// //alert(node.__ccColor);
// 				node.__ccParent.style.backgroundColor = node.__ccColor;
				
// 				//if(node.__cccColorTrans) {
// 					setTimeout((function() {
// 						node.__ccParent.style.webkitTransition = 'none';
// 						node.__ccParent.style.backgroundColor = 'transparent';
// 					}), 1000);
// 				//}
// 			}), 1000);

// 		}
// 		node.__ccParent = node.__ccParent || node.parentNode;
		
// 	}
	
// 	var parser		= function(parent, skipAddCCC) {
// 		// Already been here and done that
// 		if(parent && parent._CCCParsed) {
// 			return;
// 		}
		
// 		if(parent.nodeName === 'IMG' || parent.nodeName === 'STYLE' || parent.nodeName === 'SCRIPT' || parent.nodeName === 'IFRAME') {
// 			return;
// 		}
		
// 		// Deal with a potential bug
// 		parent._CCCParsed = true;
		
// 		if(!parent.innerHTML || parent.childNodes.length === 0) {
// 			return false;
// 		}
// 			//console.log(parent.nodeName)
		
// 		var c 			= parent.childNodes, node;	
// 		var OFFSET, BEFORE, WHOLE, RET;
// 		for(var i = 0, l = c.length;i < l; i ++) {
// 			node = c[i];
// 			// TextNode - NOT SCRIPT  OR PRET TEXT THOUGH
// 			if( node.nodeType == 3 && node.parentNode.nodeName !== 'IMG' && node.parentNode.nodeName !== 'STYLE' && node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'PRE') {
// 				var __original = node.textContent;
// 				var __altered = false;
				
								
// 				node[attr] = node[attr].replace(reg, function(whole,before, beforeFullSign, beforeFullSignDetail, first,firstSign,firstPrice,firstFullSign,firstFullSignDetail, secondPrice,secondSign,secondFullSign, secondFullSignDetail, thirdSign, thirdPrice, fourthPrice, fourthSign, fifthFullSign, fifthPrice, sixthPrice, sixthFullString,          offset, s) {
		
// 				// THIS IS THE PREVIOUS REGEXP WITHOUTH THE USD|EUR	
// 				//node[attr] = node[attr].replace(reg, function(whole,first,firstSign,firstPrice,secondPrice,secondSign, thirdSign, thirdPrice, fourthPrice, fourthSign) {
// 					//console.log(arguments);return whole;
								
// 					var sign		= firstSign 	|| secondSign 	|| thirdSign || fourthSign || fifthFullSign || sixthFullString;
// 					var price		= firstPrice 	|| secondPrice	|| thirdPrice || fourthPrice || fifthPrice ||  sixthPrice;
					
// 					if(sixthFullString) {
// 						sign = sign.toLowerCase().replace(/s/, '');
						
// 					}
				
// 					// Regular expressions - try to fix
// 					if(sign === '$' && parseInt(price) < 9) {
// 						// Git hub replaces
// 						if(node.parentNode.className === 's1') {
// 							return whole;
// 						}
						
// 						// Before and no space
// 						if(before && before.indexOf(' ') == -1) {
// 							return whole;
// 						}
// 					}
					
				
		
				
// 					// Handle decimal (ugly)
// 					if(!secondPrice) {
// 						price 		= price.replace(/,/ , ''); 
// 					} else {
// 						price 		= parseFloat(price.replace(/,/ , '.'));
// 					}
					
// 					var  ret;
// 					var signData = signs[data.currency] || [data.currency +' '];
					
// 					// Skip same signs
// 					if(signs[data.currency] && signs[data.currency][0] && signs[data.currency][0] == sign) {
// 						return whole;
// 					}
						
						
// 					ret   = (parseFloat(price)/(rates[sign])).toFixed(2);
					
// 					// Something went wrong :
// 					if(isNaN(ret)) {
// 						return whole;
// 					}
// 					changes++;
						
			
					
// 					ret = Number(ret).toFormatted(data.formatDecimal === ',' ? '.' : ',');
					
						
// 					// Sign + direction
// 					if(signData) {
// 						// Position
// 						if(data.formatPosition) {
// 							ret = data.formatPosition === 'left' ? 	signData[0] + ret : ret + signData[0];
// 						} else {
// 							ret =  signData[1] ? ret + '' + signData[0] : (signData[0] + '' + ret);
// 						}
// 					} else {
						
// 					}
														

// 					//alert('ret ' +  ret + ' - original:' + __original)
// 					if(original) {
// 						ret = ret + ' ('+whole.slice((before || '').length)+')';
// 					}
					
					
// 						// Suggestion
// 					if(!original && !CCC.addCCC) {
// 						node.parentNode.title = whole;
// 					}
					
					
// 					__altered = true;
					
					
		
		
		
// 			if(__altered && CCC.addCCC && !skipAddCCC) {
// 					// Store content
				
// 					window.CCCContent.push({
// 						'node'			: node,
// 						'original'	 	: __original,
// 						'replaced' 		: before ? before  + ret : ret
// 					})
// 				}
		
		
	
		
					
// 					// Add CCC element?
// 					if(CCC.addCCC && !skipAddCCC) {
						
// 						OFFSET = offset;
// 						BEFORE =  before;
// 						WHOLE  = whole;
// 						RET	= ret;
						
// 						window.CCCContent[window.CCCContent.length-1].__cccAlter = {
// 							'before' : before  || '',
// 							'whole'	: whole || '',
// 							'offset' : offset,
// 							'ret' : ret || ''
// 						}
				
// 						//alert(whole);
// 						return before || '';
// 					} else {
						
// 						return before ? before  + ret : ret;
// 					}
					
// 				});
				
// 			// Store content
// 					if(__altered && !CCC.addCCC || skipAddCCC) {
							
// 					window.CCCContent.push({
// 						'node'			: node,
// 						'original'	 	: __original,
// 						'replaced' 		: node.textContent
// 					})		
					
// 			}
			
// 			} else if(node.nodeType == 1) {
// 				parser(node, skipAddCCC);
// 			}
// 		}
		
		
		
		
		
// 	}

// 	document.body && parser(document.body);

// 	var runningNode;
// 	// Broadcast changes
// 	if(window.CCCContent.length ) {
		
// 			chrome.extension.sendRequest({ 'changes' : window.CCCContent.length }, function(response) {
// 			// console.log(response)
// 			});
		
// 		//if(CCC.data.highlight || CCC.data.highlight === undefined) {
// 			// Reverse !
			
// 			//for(var i = window.CCCContent.length -1 ; i > -1; i-- ) {
// 			for(var i = 0;  i <window.CCCContent.length ; i++ ) {	
				
						
// 				if( CCC.addCCC ) {
					
// 					var current =  window.CCCContent[i];
					
// 					if(current.done) {
// 					 continue;
						
// 					}
					
// 					current.done = true;
					
					
// 					node = window.CCCContent[i].node;
// 					runningNode = runningNode || node;
					
// 						var range = document.createRange();
// 						var start = current.__cccAlter.offset  + current.__cccAlter.before.length ;
						
// 						test = document.createElement('ccc'); // cool huh;p
// 						//test.style.borderBottom = '1px dotted #aaa';
// 						test.textContent = current.__cccAlter.ret;
	
	
						
// 						 if(node.textContent.length <start ) {
						
// 						// 	//start  = node.textContent.length;
// 						// 	node = window.CCCContent[i-1].node.nextSibling;
							
// 						 	start = 0;
						
// 						// 	//start = 0;
// 						// 	//node = node.nextSibling.nextSibling;
// 						// 	//alert([node.textContent,node.textContent.length, start])
// 						// 	//start = 0;
						
// 						// 	//continue;
// 						 }
						
						
										
				
						
// 						//alert(1)
						
// 						if(1) {
// 							//console.log(node.__cccAlter.ret, '#' + node.textContent  + '#', node.__cccAlter.offset  + node.__cccAlter.before.length);
							
// 							range.setStart(node,start);
							
// 							range.insertNode(test);
// 						}
// 						range.detach();
						
						
						
							
// 						if(window.CCCContent[i+1] && ( window.CCCContent[i+1].node == runningNode  ) ) {
						
// 							//start  = node.textContent.length;
// 							window.CCCContent[i+1].node = node.nextSibling.nextSibling;
// 							window.CCCContent[i+1].__cccAlter.offset = 0;
// 							//alert(0);	
// 							//start = 0;
						
// 							//start = 0;
// 							//node = node.nextSibling.nextSibling;
// 							//alert([node.textContent,node.textContent.length, start])
// 							//start = 0;
						
// 							//continue;
// 						} else {
// 							runningNode = null;
// 						}
							
						
// 					// if(window.CCCContent[i+1] && window.CCCContent[i+1].node == node ) {
// 					// 		window.CCCContent[i+1].node = window.CCCContent[i+1].node.nextSibling.nextSibling;
// 					// 		alert(window.CCCContent[i+1].__cccAlter.before);
// 					// 		window.CCCContent[i+1].__cccAlter.offset = 0;
// 					// 		//start = 0;
// 					// 	}
						
						
// 						test.title = current.__cccAlter.whole.slice(current.__cccAlter.before.length);
// 						window.CCCContent[i].node = test.firstChild;
// 						window.CCCContent[i].original = current.__cccAlter.whole.slice(current.__cccAlter.before.length);
// 						window.CCCContent[i].replaced = current.__cccAlter.ret;
// 				//	}								
				
// 				if(CCC.data.highlight || CCC.data.highlight === undefined) {
// 					highlight(window.CCCContent[i].node);
// 				}
// 			}
					
		
// 		}
// 	}	
	
// }
// })();