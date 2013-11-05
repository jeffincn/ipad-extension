Options = {
  data: localStorage['data'] ? JSON.parse(localStorage['data']) : { 'currency' : 'EUR', 'icon': true},
  port: chrome.runtime.connect({name: 'CCC'}),

  initialize  : function() {

    if (window.BumbleAd) {
      var bumbleAd = new BumbleAd(optionConfig);
    } else {
      console.log('Unable to start BumbleAd.');
    }


    var chk         = document.getElementById('icon');

    var domainsContainer  = document.getElementById('domains-container');
    var domains       = document.getElementById('domains');

    var disDomainsContainer   = document.getElementById('dis-domains-container');
    var disDomains        = document.getElementById('dis-domains');

    var original      = document.getElementById('original');

    var formatPosition    = document.getElementById('format-position');
    var formatDecimal   = document.getElementById('format-decimal');

    var highlight     = document.getElementById('highlight');

    var thousands     = document.getElementById('thousands');

    var separateSymbol    = document.getElementById('separate-symbol');

    var enableMini = document.getElementById('mini');

    if(this.data.domains !== undefined) {
      domains.value = this.data.domains;
    }

    if(this.data.disDomains !== undefined) {
      disDomains.value = this.data.disDomains;
    }


    if(this.data.original) {
      original.checked = true;
    }

    if(this.data.thousands || this.data.thousands == undefined) {
      thousands.checked = true;
    }

    if(this.data.highlight || this.data.highlight === undefined) {
      highlight.checked = true;
    }


    if(this.data.icon || this.data.icon === undefined) {
      chk.checked = true;
    }

    if(this.data.separateSymbol) {
      separateSymbol.checked = true;
    }

    if (this.data.enableMini || this.data.enableMini === undefined) {
      enableMini.checked = true;
    }

    var radios  = document.getElementsByName('usedomains');
    if(this.data.usedomains == false || this.data.usedomains === undefined) {
      radios[0].checked = true;
      radios[1].checked = false;
    }  else {
      radios[0].checked = false;
      radios[1].checked = true;
      domainsContainer.style.display = 'block'
    }

    radios[0].addEventListener('change', function(event) {
      domainsContainer.style.display = 'none'
    }, false);

    radios[1].addEventListener('change', function(event) {
      domainsContainer.style.display = 'block'
      domains.focus();
    }, false);


    var disRadios = document.getElementsByName('dis-usedomains');
    if(this.data.disUsedomains == false || this.data.disUsedomains === undefined) {
      disRadios[0].checked = true;
      disRadios[1].checked = false;
    }  else {
      disRadios[0].checked = false;
      disRadios[1].checked = true;
      disDomainsContainer.style.display = 'block'
    }

    disRadios[0].addEventListener('change', function(event) {
      disDomainsContainer.style.display = 'none'
    }, false);

    disRadios[1].addEventListener('change', function(event) {
      disDomainsContainer.style.display = 'block'
      disDomains.focus();
    }, false);




    var select  = document.getElementById('currency');
    var html  = ['<optgroup label="Major currencies">'];
    var cnt   = 0;
    for(var i in currencies) {
      if( cnt++ == 3) {
        html.push ('</optgroup><optgroup label="More currencies">');
      }
      html.push( '<option ' + (i == this.data.currency ? 'selected class=\"selected\"' : '') + ' value="'+i+'">' + i + ' - ' + currencies[i] + '</option>');
    }
    html.push('</optgroup>');
    select.innerHTML = html.join('\n');

    if(this.data.formatPosition) {
      this.select('format-position', this.data.formatPosition);
    }

    if(this.data.formatDecimal) {
      this.select('format-decimal', this.data.formatDecimal);
    }

    // Round
    if(this.data.round) {
      this.select('round', this.data.round);
    }


  },

  save    : function() {
    var select    = document.getElementById('currency');
    var index   = select.selectedIndex;
    var radios    = document.getElementsByName('usedomains');

    var disRadios = document.getElementsByName('dis-usedomains');

    var original  = document.getElementById('original');
    var thousands = document.getElementById('thousands');
    var separateSymbol  = document.getElementById('separate-symbol');

    var enableMini = document.getElementById('mini');

    if (select.querySelector('.selected')) {
        select.querySelector('.selected').className = '';
    }

    select.options[index].className = 'selected';
    var currency  = select.value;


    // Store currency
    this.data         = localStorage['data'] ? JSON.parse(localStorage['data']) : this.data;
    this.data.currency    = currency;
    this.data.icon      = !!document.getElementById('icon').checked;
    this.data.usedomains  = !!radios[1].checked;
    this.data.original    = !!original.checked;
    this.data.domains   = document.getElementById('domains').value;

    this.data.disUsedomains  = !!disRadios[1].checked;
    this.data.disDomains   = document.getElementById('dis-domains').value;

    this.data.formatDecimal   = document.getElementById('format-decimal').value;
    this.data.formatPosition  = document.getElementById('format-position').value;

    this.data.round       = document.getElementById('round').value;

    this.data.separateSymbol  = !!separateSymbol.checked;

    this.data.enableMini = !!enableMini.checked;

    this.data.highlight     = !!document.getElementById('highlight').checked;

    this.data.thousands   = !!thousands.checked;


    // Reset rates
    delete(this.data.rates);

    localStorage['data']  = JSON.stringify(this.data);


    var say = document.getElementById('say');
    say.innerHTML = 'Saved';
    say.style.display = 'inline';
    setTimeout((function() {
      say.style.display = 'none';

    }), 1500);



    Options.port.postMessage({
      'update': true
    });

    // chrome.extension.sendRequest({'update': true}, function() {

    // });

  },



select  : function(what, value) {
  var select = document.getElementById(what);
  Array.prototype.slice.call(select.options).forEach(function(option, index) {
    if(option.value == value ) {
      select.selectedIndex = index;
    }
  });
}



}


window.onload = function () {

  Options.initialize();
}


document.querySelector('button').addEventListener('click', function () {
  Options.save();
}, false);



