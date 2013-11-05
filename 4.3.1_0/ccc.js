(function() {
CCC = {
    port: null,

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
		'([,\\.\\d]+) (dollars?|us dollars|euros??)',  // Dollars, euros (literal)
//        '(.*?\n)', // Trailing new lines
		'gi'),


	'items'		: [],
	'data'		: {},


    // http://docs.oracle.com/cd/E19455-01/806-0169/overview-9/index.html
    'useSpaceRadix': /(\.sk|\.fi|\.ca|\.fr|\.dk|\.de|\.se|localhost)$/i.test(location.host),
	'mini'		: true,
	'useElement': true,

	safari		: window.safari && safari.self && navigator.userAgent.indexOf('AppleWebKit') != -1,
	opera		: window.opera,

    extensionId: chrome.i18n.getMessage("@@extension_id"),

	initialize	: function() {

		// Totally ignore google images
		if( location.host.indexOf('google') !== -1 && document.querySelector('ul.rg_ul') && document.querySelector('ul.rg_ul').getAttribute('data-pg') ) {
			console.log('Bailing out on google images');
			return false;
		}

		// I need to figure out why picassweb and google images search take so much CPU.
		// Probably, the dominserted event.
		if (location.host.indexOf('picasaweb.google.') !== -1) {
			return false;
		}


		// Disable convert
		if(this.safari || this.opera) {
			this.mini = false;
		}

		// Handle DOM works
		this.alterDOM();

		// Add Events
		this.addEvents();

        // Send host
        this.send({'host' : location.host, 'href' : location.href});


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

		// ADDED: 15.11.2010
		if(location.href.indexOf('bike24.com') != -1) {
			var elements = document.querySelectorAll('td.price, div.pricesmall, div.contentbold');

	 		if(elements) {
	 			elements = Array.prototype.slice.call(elements);
	 			elements.forEach(function(element, index) {
	 				element.innerHTML = element.innerHTML.replace(/&nbsp;/gi, '').replace(/(.*?)<span.*?>(.*?)<\/span>/, '$1$2');
	 		});
	 		}
		}

		// ADDED: 10/6/2010
        // Remove <sup> ..
		if(location.href.indexOf('focalprice.com') != -1) {
			var elements = document.querySelectorAll('li.proPri');

 			if (elements) {
	 			elements = Array.prototype.slice.call(elements);
	 			elements.forEach(function(element, index) {
	 				element.innerHTML = element.innerHTML.replace(/<sup>(.*?)<\/sup>/gi, '$1');
	 			});
	 		}
		}

		return this;
	},

	addEvents	: function() {
		// Quick patch for google images
		// It seems this thing some how slows down the extension
		if(location.host.indexOf('images.google') != -1 || location.href.match('google.{2,4}/images') ) {
			return false;
		}



		if(this.safari) {
			//alert(safari.self)
			safari.self.addEventListener("message", function(event) {
				if(event.name === 'convert') {
					CCC.prepare(JSON.parse(event.message));
				}
				if(event.name === 'toggle') {
				//	alert(event.message);
					CCC.toggle(Boolean(event.message));
				}
				//alert(event.name);
				//lert(event.message);
			}, false);

		}


        if (!this.safari) {

            CCC.port = chrome.runtime.connect({'name': 'CCC'});

            CCC.port.onMessage.addListener(function(message) {


                if (message.miniConverted) {

                    var json = {
                        'action' : 'miniConverted',
                        'amount' : message.miniConverted
                    };

                    if(CCC.Mini && CCC.Mini.iframe) {
                        CCC.Mini.iframe.src = CCC.Mini.iframe.src.replace(/#.*$/, '') + '#' + message.miniConverted;
                    }
                }

                if (message.toggle !== undefined) {

                    if (!CCC.signs && message.data) {
                        CCC.prepare(message.data);
                    }

                    CCC.toggle(message.toggle);
                } else {
                    if (message && message.action === 'CCC.convert' && message.data) {

                        if (message.data.enableMini === false) {
                            CCC.mini = false;
                        } else {
                            CCC.mini = true;
                        }

                        CCC.prepare(message.data);
                    }
                }
            });

        }

		// Enable this only if mini is enabled
		if(this.mini) {

			window.addEventListener('keydown', function(event) {
                if (event.altKey && event.shiftKey && event.ctrlKey && event.keyCode === 67) {

                    if (CCC.mini) {
					   CCC.Mini[CCC.Mini.isOpen ? 'close' : 'open']();
                    }
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

		// window.addEventListener('DOMSubtreeModified', function(evt) {
  //           CCC.process(evt.target);
  //       }, false);

  //       window.addEventListener('DOMNodeRemovedFromDocument', function(evt) {
		// 	CCC.process(evt.target);
		// }, false);



		if(this.mini)
		window.addEventListener('message', function(event) {

            // TODO: better check here
            if (event.origin.indexOf(CCC.extensionId) === -1) {
                return false;
            }

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

	send: function(obj) {
		if(this.safari) {
			safari.self.tab.dispatchMessage('action', 'send');
		} else {
            CCC.port.postMessage(obj);
        }
	},

	prepare: function(data) {

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
			'HRK'	: ['kn', true],
			'CUP'	: [String.fromCharCode(8369)],
			'CZK'	: ['Kč', true],
			'DKK'	: ['kr'],
			'DOP'	: ['RD$'],
			'EGP'	: ['£'],
            'EEK'   : ['kr'],
			'GEL'	: ['Gel'],
			'HKD'	: ['$'],
			'HUF'	: ['Ft'],
			'ISK'	: ['Kr'],
			'IKR'	: [String.fromCharCode(8360)],
			'IDR'	: ['Rp'],
			'IRR'	: [String.fromCharCode(65020)],
			'ILS'	: ['₪'], //page - ₪.
			'JPY'	: ['¥'],
			'KZT'	: ['лв'],
			'KPW'	: [String.fromCharCode(8361)],
			'LAK'	: [String.fromCharCode(8365)],
			'LBP'	: ['£'],
            'LKR'   : ['Rs'],
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
			'RUB'	: ['руб', true],
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

        var newLineMatches = false;

        CCC.changes = 0;

        changes = this.parse(element);

		// Nothing changed - go back
		if(!changes) {
			return false;
		}


		// Deal with CCC.items
		if (this.items && this.items.length) {

			if (!CCC.safari) {
				this.send({'changes': CCC.items.length});
			}

			for (var i = currentChanges, l = this.items.length; i< l; i++ ) {

				var current = this.items[i];

				if (this.useElement)	 {

					node 		= current.node;
					runningNode = runningNode || node;

					range		= document.createRange();
					start		= current.reg.offset + current.reg.before.length;

					element		= document.createElement('ccc');
					element.style.fontSize = 'inherit';

					element.textContent = current.reg.ret;

					// Special case
					if (node.textContent.length < start) {
						start = 0;
					}

					range.setStart(node, start);
					range.insertNode(element);
					range.detach(); // Free memory


					// Tricky part
					// Check for running node and the next one
					if (CCC.items[i + 1] && (CCC.items[i+1].node == runningNode)) {

                        var index = 0, trailing = false;

                        // Since the before part doesn't include new_lines and preceding .
                        // Here's a cool trick to fix this
                        if (CCC.items[i+1].node) {
                            index = CCC.items[i].node.nextSibling.nextSibling.textContent
                                .indexOf(CCC.items[i+1].reg.before);
                        }

                        index = Math.max(index, 0);

                        CCC.items[i+1].node         = node.nextSibling.nextSibling;
                        CCC.items[i+1].reg.offset 	= index;
					} else {
						runningNode = null;
					}


					// Assign title to CCC element
					element.title		= current.reg.whole.slice(current.reg.before.length);
					current.node		= element.firstChild;
					current.original	= current.reg.whole.slice(current.reg.before.length);
					current.replaced	= current.reg.ret;

					if(CCC.data.highlight || CCC.data.highlight == undefined) {
					   this.highlight(current.node)
					}
				}
			}
		}

		return this;
	},


	parse	: function(parent, noElement) {

		var node, ret, signData, original, after;
		if (!parent || parent._CCC || /^(G|CANVAS|PATH|IFRAME|CIRCLE|RECT|SVG|EMBED|OBJECT|VIDEO|AUDIO|ccc|IMG|STYLE|SCRIPT|IFRAME|CCC|PRE)$/i.test(parent.nodeName) || parent.childNodes.length == 0) {
			return false;
		}

		// Mark this as parsed
		// TODO: Are we so sure?
		parent._CCC = true;

		// Enumarate childnodes
		for(var i = 0, l = parent.childNodes.length; i < l; i++) {

			node = parent.childNodes[i];
			// Element?

			// ADDED: && noded.innerHTML;
			if(node.nodeType === 1 && node.innerHTML) {

				// EXPERIMENTAL
				// FIX &quote issues
				var _index;
				if(  node.innerHTML.length < 22 && (_index = node.innerHTML.indexOf('&nbsp') ) != -1 && node.innerHTML[_index - 1] && node.innerHTML[_index - 1].match(/\d/)) {
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

            // This is to chekc for , or . leading the price
            after = '';

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






				// The following line will convert something like 13,00 to 13.00
				price = price.replace(/^([0-9]{1,2}),([0-9]{1,2})$/, '$1.$2');

                if (price.match(/[,\.]$/)) {
                    after = RegExp.lastMatch;
                } else {
                    after ='';
                }


				// The following line will convert something like 1123233,00 to 13.00
				// ADDED: 21.11.2010
				price = price.replace(/^([0-9]{3,10}),([0-9]{2})$/, '$1.$2');

				// NN,NN
				price = price.replace(/,/g, '');

                // Let's check on space radix now
                if (CCC.useSpaceRadix && String(price).length > 2 && !/\.|,/g.test(String(price))) {


                    if (before.match(/(\b[\d ]+?)$/)) {

                        var extraSpaceSeparatedPrice = RegExp.lastMatch;
                        var firstCharacterBeforeextraSpaceSeparatedPrice =RegExp.lastMatch.charAt(0);
                        var extraPrice = extraSpaceSeparatedPrice.trim().replace(/ /gi, '');

                        if (firstCharacterBeforeextraSpaceSeparatedPrice === extraPrice.charAt(0)) {
                            firstCharacterBeforeextraSpaceSeparatedPrice = '';
                        }

                        price = parseInt(extraPrice + price + '');

                        // Reset before
                        before = before.slice(0, -(extraSpaceSeparatedPrice.length - firstCharacterBeforeextraSpaceSeparatedPrice.length));

                    }
                }

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

				// Something is wrong
				if(isNaN(ret)) {
					return whole;
				}

				// ROUNDING // ADDED 2.2.2010
				if(CCC.data.round && CCC.data.round != '0' && ret >= parseInt(CCC.data.round) ) {
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


                // Tricky but neede
                ret         += after;
                offset      -= after.length;


				if (CCC.useElement && !noElement) {


					CCC.items.push({
						'node'		: node,
						'original'	: original,
						'replaced'	: before ? before  + ret : ret ,
						'reg'		: {
							'before'	: before || '',
                            'after'     : after,
							'whole'		: whole  || '',
							'offset'	: offset + after.length,
							'ret'		: ret || ''
						}
					})

					return before || '';
				} else {
					return before ? before + ret  : ret;
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
		iframe.width 			= 350;
		iframe.height 			= 175;
		iframe.style.zIndex 	= 999999;
		iframe.style.opacity 	= 1;
		iframe.style.border 	= "3px solid #6f6f6f";
		iframe.style.webkitBoxShadow = '3px 3px 2px rgba(0,0,0,.1)';
		iframe.style.webkitBorderRadius = '0px';
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
//	radix 				=== undefined && (function() {
	if(radix === undefined)
		radix = this.toString().indexOf('.') !== -1 ? this.toString().replace(/^.+\./, '').length : 0;
	//}).bind(this)();

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
