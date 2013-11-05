/* http://developer.chrome.com/extensions/messaging.html#connect */
CCC = {
	debug			: false,
    version         : 2.0,
	tabs			: {}, // Will hold toggler status

    ports           : {},

	mode			: 'page',
	tabID			: null,							// Current tabID
	cacheTS			: (1000 * 60) * 3600 * 8,		// Cache interval
	data			: localStorage['data'] ? JSON.parse(localStorage['data']) : {'currency' : 'EUR'},

	initialize		: function() {

		if (this.mode === 'browser') {
			chrome.browserAction.onClicked.addListener(function(tab) {
				CCC.convert(false, CCC.getPortByTabId(tab.id));
			});
		}

		// Handle onRequest(s) used to convert again using new currency setting from options.
        chrome.runtime.onConnect.addListener(function (port) {

            // Sanity check
            if (port.name !== 'CCC') {
                return false;
            }

            if (!port.sender || !port.sender.tab.id) {
                console.warn('Sorry, unable to find tab here', port);
                return false;
            }

            var tabId = port.sender.tab.id;

            // Keep it
            CCC.ports[tabId] = port;

            port.onMessage.addListener(function (req) {

                if (req.miniConvert) {
                    CCC.miniConvert(req.miniConvert, port);
                    return false;
                }

                if (req.href) {

                    if (CCC.data.disUsedomains === true && CCC.data.disDomains) {

                        var disDomains  = CCC.data.disDomains.split(/\n/),
                            disSkip     = false;

                        disDomains.forEach(function(item, index) {

                            if(item && req.href.indexOf(item) !== -1) {
                                skip = true;
                                return;
                            }
                        });

                        if(skip === true) {
                            return false;
                        }
                    }

                    if (CCC.data.usedomains === true && CCC.data.domains) {

                        var domains = CCC.data.domains.split(/\n/),
                            skip    = true;

                        domains.forEach(function(item, index) {

                            if (item && req.href.indexOf(item) !== -1) {
                                skip = false;
                                return;
                            }
                        });

                        if(skip) {
                            return false;
                        } else {
                            CCC.convert(null, port);
                        }
                    } else {

                        // All good, let's go
                        CCC.convert(null, port);
                    }
                 }

                 if (req['update'])  {
                    CCC.data  = localStorage['data'] ? JSON.parse(localStorage['data']) : {'currency' : 'EUR'}; // Update data
                    CCC.convert(true, port);
                 }

                 // Display pageAction if applicable
                 if (req['changes'] && CCC.mode === 'page' && (CCC.data.icon || CCC.data.icon == undefined)) {

                    CCC.tabs[tabId] = true;
                    chrome.pageAction.show(tabId);
                    chrome.pageAction.setTitle({'tabId' : tabId, 'title' : 'CCC: ' + req.changes + ' conversions'});
                 }

            })
        });

		/// Handle pageAction click (toggler in omnibar)
		if (this.mode === 'page') {

			chrome.pageAction.onClicked.addListener(function (tab) {

				CCC.tabs[tab.id] = !CCC.tabs[tab.id];

                CCC.getPortByTabId(tab.id).postMessage( {'toggle': CCC.tabs[tab.id] });

                chrome.pageAction.setIcon({
					'tabId' : 	tab.id,
					'path' : 	chrome.extension.getURL('/icons/' + ( CCC.tabs[tab.id] ? '19.png' : '19-off.png'))
                });
			});
		}

		return this.getRates();
	},

    getPortByTabId: function (tabId) {

        if (!this.ports[tabId]) {
            this.ports[tabId] = chrome.tabs.connect(tabId, { 'name': 'CCC'} );
        }

        return this.ports[tabId];
    },

	// Set badge text to current currency;
	// Applicable only when this.mode === 'browser'
	setBadge		: function() {

		if (this.mode === 'browser') {
			chrome.browserAction.setBadgeText({'text' : this.data.currency});
		}
	},

	convert			 : function (forceGetRates, port) {

		if (!localStorage['data']) {
            return this.getRates();
		}

		this.data 	= JSON.parse(localStorage['data']);

		this.setBadge();

		if (forceGetRates || !this.data.rates) {
            this.getRates(true, port);
            return;
        }

        // Back to content-script
		if (this.data.rates && port) {
            port.postMessage({'action': 'CCC.convert', 'data' : this.data});
	  	}
  	},

  	miniConvert	 : function(data, port) {

  		var amount      = data.amount,
            currency    = data.currency;

		// Fetch
		xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://chrome.' + ( this.debug ? 'dev.' : '') + 'pathfinder.gr/Stocks/convert.php?amount='+amount+'&to='+this.data.currency + '&from=' + currency, true);
		xhr.send();

		console.log('Converting: ' + amount + ' to currency: ' + currency);

		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4) {
                port.postMessage({ 'miniConverted': xhr.responseText } );
			}
		};
  	},

	getRates: function (force, port) {

        force = true;

		if (force) {
			this.data.updated 	= null;
			this.data.rates		= null;
		}

		var rates     = this.data.rates,
            updated   = this.data.updated;

        // TODO: Figure out a way to force for undefined

		// Use cached rates if applicable
		if (!force && this.data && localStorage['data']) {
			if (!this.debug && rates && updated && (new Date().getTime() - updated <  this.cacheTS)) {
				return this.convert(false, port);
			}
		}

		// Fetch
		xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://chrome.' + ( this.debug ? 'dev.' : '') + 'pathfinder.gr/Stocks/ccc.php?json=1&currency=' + this.data.currency, true);
		xhr.send();

		xhr.onreadystatechange = function() {

            var rates;

			if (xhr.readyState === 4) {

				rates = JSON.parse(xhr.responseText);

				if (rates) {
					CCC.data.rates 			= rates;
					CCC.data.updated 		= new Date().getTime();
					localStorage['data'] 	= JSON.stringify(CCC.data); // Store again
					CCC.convert(false, port);
				} else if (CCC.data.rates) {
					CCC.convert(false, port);
				}
			}
		};
	}
}

CCC.initialize();