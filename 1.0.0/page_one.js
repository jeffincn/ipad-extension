﻿var _rhngfhnj5yghj4kyh5k45j41={_rhngfhnj5RY5ghdtf5k45j41:function(a,b){if(void 0===b||null===b)b="";$("#phoneNumber").val(a);$("#reservationCode").val(b)},_rYU5hj4g5j4tyg4kjk:function(){$("#continue").click()}}; $(function(){chrome.storage.sync.get(["mobile","reservation_code","autofill"],function(a){var b=void 0==a.autofill?"":a.autofill,c=void 0==a.mobile?"":a.mobile;a=void 0==a.reservation_code?"":a.reservation_code;if(void 0==b||null==b)b="true";if(void 0==c||null==c)c="";if(void 0==a||null==a)a="";$("#reservationCode").blur(function(){var a=$("#reservationCode").val().trim();chrome.storage.sync.set({reservation_code:a})});$("#captchaAnswer").keydown(function(a){13==a.which&&(a.preventDefault(),_rhngfhnj5yghj4kyh5k45j41._rYU5hj4g5j4tyg4kjk())}); $("#reservationCode").keydown(function(a){13==a.which&&(a.preventDefault(),a=$("#reservationCode").val().trim(),chrome.storage.sync.set({reservation_code:a}),_rhngfhnj5yghj4kyh5k45j41._rYU5hj4g5j4tyg4kjk())});"true"==b&&$("#productsPageForm").length&&(_rhngfhnj5yghj4kyh5k45j41._rhngfhnj5RY5ghdtf5k45j41(c,a),0<$("#reservationCode").val().length?$("#captchaAnswer").focus():$("#reservationCode").focus())})});