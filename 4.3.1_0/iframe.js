CCC = {

  initialize : function() {

    CCC.currencies = currencies;

    document.querySelector('#amount').addEventListener('keydown', function (event) {
      if (event.keyCode === 13) {
        CCC.convert();
      }
    }, false);

    document.querySelector('#button').addEventListener('click', function (event) {
        CCC.convert();
    }, false);


    // Get data from location
    try {
        CCC.data  = JSON.parse(decodeURIComponent(location.href).replace(/.*?data=/, ''));
    } catch (ex) {
        console.warn('Unable to find and parse data from hash. Bailing out');
        return;
    }

    var amount  = document.getElementById('amount');
    document.getElementById('button').innerHTML = 'Convert to '+CCC.data.currency;
    var select  = document.getElementById('currency');
    var html  = ['<optgroup label="Major currencies">'];
    var cnt   = 0;
    for(var i in CCC.currencies) {
      if(i === CCC.data.currency) {

        continue;
      }
      //cnt ++;
      if( cnt++ == 3) {
        html.push ('</optgroup><optgroup label="More currencies">');
      }
      html.push( '<option ' + (i == CCC.data.currency ? 'selected class=\"selected\"' : '') + ' value="'+i+'">' + i + ' - ' + CCC.currencies[i] + '</option>');
    }
    html.push('</optgroup>');
    select.innerHTML = html.join('\n');




    window.addEventListener('keydown', function(event){
      if(event.keyCode === 27 ) {
        parent.postMessage('CCC.close', '*');
      }
    }, false);


    amount.focus();


    var hash = String(document.location.hash || '').slice(1);
    setInterval(function() {
      var newHash = String(document.location.hash || '').slice(1);

      if(newHash !== hash) {

        var amount = newHash.replace(/[^0-9\.]/gi, '');
        document.getElementById('result').innerHTML =  ( parseFloat(amount).toFixed(3)  ) + ' '+ CCC.data.currency;
        hash = newHash;
      }
    }, 10)

  },

  convert  : function() {
    var amount    = document.getElementById('amount');
    var value   = amount.value;
    var currency  = document.getElementById('currency').value;

    if(!value) {
      amount.focus();
    }


    var json    = {
      'action'  : 'convert',
      'currency'  : currency,
      'amount'  : value

    }



    parent.postMessage(JSON.stringify(json), '*');

  }
}

CCC.initialize();

