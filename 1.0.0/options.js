var autocheck = "false";

function save_options() {

    // autocheck = document.getElementById("stock_auto_check").value;
    // save_single_option("stock_auto_check");
    var a = document.getElementById("stock_auto_check_time").value;
    if (isNaN(a) || 0 >= a) document.getElementById("stock_auto_check_time").value = 5;
    save_stock_auto_check_time_option("stock_auto_check_time");
    save_single_option("stock_auto_check_alarm");
    save_single_option("ipad_auto_check_alarm");
    save_single_option("ipad_mini_auto_check_alarm");

    update_status("Options saved.");
    alert("\u9078\u9805\u5df2\u5132\u5b58. Option saved.")
}

function save_stock_auto_check_time_option(a) {
    var b = document.getElementById(a);
    if (void 0 != b.value || null != b.value) {
        var c = {};
        c[a] = b.value;
        chrome.storage.sync.set(c, function() {
            chrome.runtime.getBackgroundPage(function(a) {
                "true" == window.autocheck ? a.startBackgroundTask() : a.stopBackgroundTask()
            })
        })
    }
}

function save_single_checkbox_option(a) {
    if (!0 == document.getElementById(a).checked) {
        var b = {};
        b[a] = "true"
    } else b = {}, b[a] = "false";
    chrome.storage.sync.set(b)
}

function save_single_option(a) {
    var b = document.getElementById(a);
    if (void 0 != b.value || null != b.value) {
        var c = {};
        c[a] = b.value;
        chrome.storage.sync.set(c)
    }
}

function restore_single_text_option(a) {
    chrome.storage.sync.get(a, function(b) {
        b = b[a];
        document.getElementById(a).value = void 0 != b && null != b ? b : ""
    })
}

function restore_single_text_option_with_default(a, b) {
    chrome.storage.sync.get(a, function(c) {
        c = c[a];
        document.getElementById(a).value = void 0 != c && null != c ? c : b
    })
}

function restore_single_checkbox_option(a) {
    chrome.storage.sync.get(a, function(b) {
        b = b[a];
        var c = document.getElementById(a);
        "true" == b && (c.checked = !0)
    })
}

function restore_single_select_option(a) {
    chrome.storage.sync.get(a, function(b) {
        b = b[a];
        var c = document.getElementById(a);
        if (void 0 != b && null != b)
            for (var d = 0; d < c.children.length; d++) {
                var e = c.children[d];
                if (e.value == b) {
                    e.selected = "true";
                    break
                }
            } else c.children[0].selected = "true"
    })
}

function restore_single_select_option_with_default(a, b) {
    chrome.storage.sync.get(a, function(c) {
        c = c[a];
        var d = document.getElementById(a);
        if (void 0 != c && null != c)
            for (var e = 0; e < d.children.length; e++) {
                var f = d.children[e];
                if (f.value == c) {
                    f.selected = "true";
                    break
                }
            } else d.children[b].selected = "true"
    })
}

function restore_options() {
    // restore_single_select_option("autofill");
    // restore_single_text_option("firstname");
    // restore_single_text_option("lastname");
    // restore_single_text_option("email");
    // restore_single_text_option("mobile");
    // restore_single_text_option("reservation_code");
    // restore_single_text_option("govt_id");
    // restore_single_select_option("select_store");
    // restore_single_select_option("select_color");
    // restore_single_select_option("select_plan");
    // restore_single_text_option("qty");
    // restore_single_select_option("select_date");
    // restore_single_select_option_with_default("stock_auto_check", 1);
    restore_single_text_option_with_default("stock_auto_check_time", "1");
    restore_single_select_option("stock_auto_check_alarm");
    restore_single_select_option("ipad_auto_check_alarm");
    restore_single_select_option("ipad_mini_auto_check_alarm");
    // restore_single_select_option("stock_auto_check_available_only");
    // restore_single_select_option("stock_auto_check_page")
}

function clear_options() {
    !0 == confirm("Are you sure?") && (chrome.storage.sync.clear(), restore_options(), update_status("All options removed."))
}

function update_status(a) {
    var b = document.getElementById("status");
    b.innerHTML = a;
    setTimeout(function() {
        b.innerHTML = ""
    }, 750)
}

function clear_db() {
    !0 == confirm("Are you sure?") && chrome.runtime.getBackgroundPage(function(a) {
        a.websql.opendb();
        a.websql.deleteAllEntries("R428_Unlocked");
        a.websql.deleteAllEntries("R485_Unlocked");
        a.websql.deleteAllEntries("R409_Unlocked");
        update_status("database cleared.")
    })
}

function displayText() {
    $("title").text(chrome.i18n.getMessage("option_page_header_title"));
    $("#option_page_title").text(chrome.i18n.getMessage("option_page_title"));
    $("#option_page_field_autofill").text(chrome.i18n.getMessage("option_page_field_autofill"));
    $("#option_page_field_lastname").text(chrome.i18n.getMessage("option_page_field_lastname"));
    $("#option_page_field_firstname").text(chrome.i18n.getMessage("option_page_field_firstname"));
    $("#option_page_field_email").text(chrome.i18n.getMessage("option_page_field_email"));
    $("#option_page_field_mobile").text(chrome.i18n.getMessage("option_page_field_mobile"));
    $("#option_page_field_reservaton_code").text(chrome.i18n.getMessage("option_page_field_reservation_code"));
    $("#option_page_field_govtid").text(chrome.i18n.getMessage("option_page_field_govtid"));
    $("#option_page_field_store").text(chrome.i18n.getMessage("option_page_field_store"));
    $("#option_page_field_product").text(chrome.i18n.getMessage("option_page_field_product"));
    $("#option_page_field_color").text(chrome.i18n.getMessage("option_page_field_color"));
    $("#option_page_field_capacity").text(chrome.i18n.getMessage("option_page_field_capacity"));
    $("#option_page_field_qty").text(chrome.i18n.getMessage("option_page_field_qty"));
    $("#option_page_field_date").text(chrome.i18n.getMessage("option_page_field_date"));
    $("#option_page_field_auto_stock_check").text(chrome.i18n.getMessage("option_page_field_auto_stock_check"));
    $("#option_page_field_auto_stock_check_time").text(chrome.i18n.getMessage("option_page_field_auto_stock_check_time"));
    $("#option_page_field_auto_stock_check_time_text").text(chrome.i18n.getMessage("option_page_field_auto_stock_check_time_text"));
    $("#option_page_field_auto_stock_check_alarm").text(chrome.i18n.getMessage("option_page_field_auto_stock_check_alarm"));
    $("#option_page_field_ipad_auto_stock_check_alarm").text(chrome.i18n.getMessage("option_page_field_ipad_auto_stock_check_alarm"));
    $("#option_page_field_ipad_mini_auto_stock_check_alarm").text(chrome.i18n.getMessage("option_page_field_ipad_mini_auto_stock_check_alarm"));
    $("#option_page_field_auto_stock_check_available_only").text(chrome.i18n.getMessage("option_page_field_auto_stock_check_available_only"));
    $("#option_page_field_auto_stock_check_page").text(chrome.i18n.getMessage("option_page_field_auto_stock_check_page"));
    $("#save").val(chrome.i18n.getMessage("option_page_button_save"));
    $("#clear").val(chrome.i18n.getMessage("option_page_button_clear"));
    $("#remove_db").val(chrome.i18n.getMessage("option_page_button_clear_db"))
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("save").addEventListener("click", save_options);
    document.getElementById("clear").addEventListener("click", clear_options);
    document.getElementById("remove_db").addEventListener("click", clear_db);
    displayText();
    restore_options()
});