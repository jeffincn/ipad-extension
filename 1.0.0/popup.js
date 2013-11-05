document.addEventListener("DOMContentLoaded", function() {
    // var a = document.getElementById("ireserve_zh_hk");
    // a.addEventListener("click", function() {
    //     chrome.tabs.create({
    //         url: "https://ireservea.apple.com/HK/zh_HK/reserve/iPhone/productReservation"
    //     })
    // });
    // a = document.getElementById("ireserve_en_hk");
    // a.addEventListener("click", function() {
    //     chrome.tabs.create({
    //         url: "https://ireservea.apple.com/HK/en_HK/reserve/iPhone/productReservation"
    //     })
    // });
    a = document.getElementById("ireserve_ipad_zh_hk");
    a.addEventListener("click", function() {
        chrome.tabs.create({
            url: "http://store.apple.com/hk-zh/buy-ipad/ipad-air"
        })
    });

    a = document.getElementById("ireserve_ipad_mini_zh_hk");
    a.addEventListener("click", function() {
        chrome.tabs.create({
            url: "http://store.apple.com/hk-zh/buy-ipad/ipad-mini-retina"
        })
    });
    
    a = document.getElementById("page_test");
    a.addEventListener("click", function(){
        caTimerListener(true);
    });
    
    // a = document.getElementById("ireserve_cn");
    // a.addEventListener("click", function() {
    //     chrome.tabs.create({
    //         url: "https://ireservea.apple.com/CN/zh_CN/reserve/iPhone/productReservation"
    //     })
    // });
    // a = document.getElementById("ireserve_stock");
    // a.addEventListener("click", function() {
    //     chrome.tabs.create({
    //         url: "checkAvailability.html"
    //     })
    // });
    // a = document.getElementById("ireserve_help");
    // a.addEventListener("click", function() {
    //     chrome.tabs.create({
    //         url: "https://www.facebook.com/ireserveapple"
    //     })
    // });
    a = document.getElementById("popup_config");
    a.addEventListener("click", function() {
        chrome.i18n.getMessage("@@extension_id");
        chrome.tabs.create({
            url: "options.html"
        })
    });
    displayText()
});

function displayText() {
    $("title").text(chrome.i18n.getMessage("popup_page_header_title"));
    $("#ireserve_ipad_zh_hk > h3").text(chrome.i18n.getMessage("popup_ipad_list_zh_cn_link"));
    $("#ireserve_ipad_mini_zh_hk > h3").text(chrome.i18n.getMessage("popup_ipad_mini_list_zh_cn_link"));
    $("#page_test > h3").text(chrome.i18n.getMessage("page_test_link"));
    $("#popup_config > h3").text(chrome.i18n.getMessage("popup_list_config_link"))
};