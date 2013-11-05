chrome.runtime.onSuspend.addListener(function() {});
function _grtyy54RGDfdgdfhdh(b) {
    var attrs=[
        ['hk-zh','4G',128],
        ['hk-zh','4G',64],
        ['hk-zh','4G',32],
        ['hk-zh','4G',16],
        ['hk-zh','WIFI',128],
        ['hk-zh','WIFI',64],
        ['hk-zh','WIFI',32],
        ['hk-zh','WIFI',16]//,
        // ['cn','WIFI',128],
        // ['cn','WIFI',64],
        // ['cn','WIFI',32],
        // ['cn','WIFI',16]
    ];
    for(i=0;i<attrs.length;i++){
        console.log(attrs[i]);
        $.getJSON("http://store.apple.com/"+attrs[i][0]+"/buyFlowVariationUpdate/IPADAIR2013_"+attrs[i][1]+"?option.dimensionColor=silver&option.dimensionCapacity="+attrs[i][2]+"gb&node=home%2Fshop_ipad%2Ffamily%2Fipad_air&step=select").done(function(a) {
            b(a);
        }).fail(function() {}).always(function() {});
    }
}
function _grtyy54RGDfdgdfhdi(b) {
    var attrs=[
        ['hk-zh','4G',128],
        ['hk-zh','4G',64],
        ['hk-zh','4G',32],
        ['hk-zh','4G',16],
        ['hk-zh','WIFI',128],
        ['hk-zh','WIFI',64],
        ['hk-zh','WIFI',32],
        ['hk-zh','WIFI',16]
    ];


    for(i=0;i<attrs.length;i++){
        $.getJSON("http://store.apple.com/"+attrs[i][0]+"/buyFlowVariationUpdate/IPADMINI2013_"+attrs[i][1]+"?option.dimensionColor=silver&option.dimensionCapacity="+attrs[i][2]+"gb&node=home%2Fshop_ipad%2Ffamily%2Fipad_mini_retina&step=select").done(function(a) {
            b(a);
        }).fail(function() {}).always(function() {});
    }
}
document.addEventListener("DOMContentLoaded", function() {
    chrome.power.requestKeepAwake("system");
    startBackgroundTask()
});

var iprChkTimer;

function startBackgroundTask() {
    chrome.alarms.clearAll();
    window.clearInterval(iprChkTimer);
    chrome.storage.sync.get(["stock_auto_check_time"], function(b) {
        var t = (b && 0 == b.stock_auto_check_time)? 1 : parseFloat(b.stock_auto_check_time);
        (isNaN(t) && (t = 1));

        // window.setTimeout(function() {
        caTimerListener();
        // }, 0);
        iprChkTimer = window.setInterval(caTimerListener, 6E4 * t);
    })
}

function stopBackgroundTask() {
    chrome.alarms.clearAll();
    window.clearInterval(iprChkTimer)
}

function caTimerListener(isTest) {
    isTest || (isTest = false);
    var isHas = false;
    chrome.storage.sync.get(["ipad_auto_check_alarm", "ipad_mini_auto_check_alarm"], function(b){
        console.log(b);
    });

    // if(isHas){
        chrome.browserAction.setBadgeText({
            text: ""
        });
    // }
    
    _grtyy54RGDfdgdfhdh(function(data){
        var datas = data.body.content.selected;
        var icon = datas.productImage.trim()
        var content = $(datas.purchaseOptions.shippingLead).text().trim();
        content = content.replace(/[\t|\n|\s]/g,'');
        icon = icon.replace(/<img[(\S\s)*]class=\"ir\"[(\S\s)*]src=\"([\S]*)\"([\s\S]*)\/>/g,'$1');
        chrome.storage.sync.get(["ipad_auto_check_alarm"], function(b){
            if(b.ipad_auto_check_alarm!=="false" && (isTest||datas.purchaseOptions.isBuyable)){
                var notify = webkitNotifications.createNotification(
                    icon,
                    datas.productTitle,
                    content
                );
                notify.show();
                isHas = true;
                notify.ondisplay = function(){
                    setTimeout(notify.close, 3000);
                }
                playAudio();
            }
            if(isHas){
                chrome.browserAction.setBadgeText({
                    text: "G"
                });
            }
        });
    });


    _grtyy54RGDfdgdfhdi(function(data){
        var datas = data.body.content.selected;
        var icon = datas.productImage.trim()
        var content = $(datas.purchaseOptions.shippingLead).text().trim();
        content = content.replace(/[\t|\n|\s]/g,'');
        icon = icon.replace(/<img[(\S\s)*]class=\"ir\"[(\S\s)*]src=\"([\S]*)\"([\s\S]*)\/>/g,'$1');
        chrome.storage.sync.get(["ipad_mini_auto_check_alarm"], function(b){
            if(b.ipad_mini_auto_check_alarm!=="false" && (isTest||datas.purchaseOptions.isBuyable)){
                var notify = webkitNotifications.createNotification(
                    icon,
                    datas.productTitle,
                    content
                );
                notify.show();
                isHas = true;
                playAudio();
                setTimeout(function(){notify.close();}, 3000);
                // notify.ondisplay = function(){
                //     setTimeout(notify.close, 3000);
                // }
            }

            if(isHas){
                chrome.browserAction.setBadgeText({
                    text: "G"
                });
            }
        });
    });
}

chrome.alarms.onAlarm.addListener(function(b) {
    "CheckAvailability" == b.name && caTimerListener()
});
function playAudio() {
    chrome.storage.sync.get(["stock_auto_check_alarm"], function(b){
        if(b.stock_auto_check_alarm!=="false"){
            document.getElementById("player").play();
        }
    });
};