var _agds544245sdgf4d5g4d54g5d525dggf={_agds544245sdgf4d5g4d54g5d525dhjghj:function(a,b){storeChange(a,b);$(".step-one .selection").html($('.step-one .menu li[data-tag="'+a+'"]').html());$("#store input.select-value").val(a)},_agds544245sdgfdsgfdsg45425dq:function(){$(".overlay").hide();$(".step-two .scrim").hide();$("."+"iphone 5s".replace(/ /g,"_")).removeClass("disabled");$("."+"iphone 5s".replace(/ /g,"_")+"-scrim").hide();window.clickEventTracker=0;$(".models li input").click()},_agds544245sdgwwdsgfdsg45425dq:function(a){window.clickEventTracker= 0;$(".colors li > ."+a).click()},_agds5442hdgfhf5g45425dq:function(a){$.each(["Contract","Unlocked"],function(a,c){var d=$("."+c.toLowerCase().replace(/ /g,"_"));d.hasClass("disabled-carrier")&&d.removeClass("disabled-carrier")});window.clickEventTracker=0;$(".carrier-row li."+a+" label").click()},_agds5442hdgfgh545g45425dqf:function(a){window.clickEventTracker=0;var b=$(".capacity-row li");b.hasClass("disabled")&&b.removeClass("disabled");switch(a){case 16:$('.capacity-row li[data-capacity="16GBHK$ 5,588"]').click(); break;case 32:$('.capacity-row li[data-capacity="32GBHK$ 6,388"]').click();break;case 64:$('.capacity-row li[data-capacity="64GBHK$ 7,188"]').click();break;case "16":$('.capacity-row li[data-capacity="16GBHK$ 5,588"]').click();break;case "32":$('.capacity-row li[data-capacity="32GBHK$ 6,388"]').click();break;case "64":$('.capacity-row li[data-capacity="64GBHK$ 7,188"]').click()}},_agds5442hdfgjgj5g45425dqf:function(a){$(".step-five .selection").html(a);$(".step-five input.select-value").attr("value", a)},_agds5442hfd5gh41f25jgj5g45425dqf:function(a,b,c,d){$("#firstname").val(a);$("#lastname").val(b);$("#email").val(c);$("#govid").val(d)},_agds5442hfd5ghhthq5jgj5g45425dqf:function(a){$("#phone").val(a)},timeSlot:function(a){if(0!==timeslots.length){var b=$('.step-seven li[identifier="timeslots"]');tValue=b.eq(a).attr("data-tag");tLabel=b.eq(a).html();ProductReservation.timeSlots(tValue,tLabel);$(".step-seven .selection").html(tLabel);$(".step-seven input.select-value").val(tValue)}},_agds5445eteathq5hgjgjgj5g4542dgdgdfgq:function(a){if(0!== timeslots.length){var b;$('.step-seven li[identifier="timeslots"]').each(function(d){a==$(this).html()&&(b=$(this))});if(b)tValue=b.attr("data-tag"),tLabel=b.html(),ProductReservation.timeSlots(tValue,tLabel),$(".step-seven .selection").html(tLabel),$(".step-seven input.select-value").val(tValue);else{var c=Math.floor(Math.random()*timeslots.length);_agds544245sdgf4d5g4d54g5d525dggf.timeSlot(c)}}},submitOrder:function(){onSubmitRequest()}}; function queryTimeslots(a,b,c,d,e){jQuery(".overlay").show();jQuery.ajax({type:"POST",url:"getTimeSlots",dataType:"json",data:"productName="+a+"&storeNumber="+b+"&plan="+c+"&mode="+d,success:function(a){window.clickEventTracker=0;jQuery(".overlay").hide();jQuery("#timeSlots").html("");window.timeslots=null!=a.timeSlots?a.timeSlots:[];"UNLOCKED"===c?window.timeslotsUnlocked=window.timeslots:window.timeslotsCarrier=window.timeslots;null!=window.timeslots&&0<window.timeslots.length?e():jQuery(".intro").last().after('<p class="intro" style="color:red">['+ getCurrentTime()+"] iPhone\u8a02\u6a5f\u52a9\u624b: Server timeslots is not available. Try reload the page later.</p>")},error:function(a,b,d){403==a.status&&window.location.reload();window.clickEventTracker=0;jQuery(".overlay").hide();jQuery(".intro").last().after('<p class="intro" style="color:red">['+getCurrentTime()+"] iPhone\u8a02\u6a5f\u52a9\u624b: No timeslots response from server, try reload the page later.</p>")}})}var curStoreStock=!1; function storeChange(a,b){jQuery(".row li").each(function(){jQuery(this).removeClass("selected")});jQuery(".step-two .scrim").show();jQuery(".step-three .scrim").show();jQuery(".step-four .scrim").show();jQuery(".userInformation .scrim , .step-seven .scrim, .reservation-step3 .scrim").show();jQuery(".overlay").show();jQuery(".step-five .select, .step-seven .select").addClass("disabled-dropdown");jQuery(".submit-button").attr("disabled","disabled");jQuery(".submit-button").addClass("disable-reservation-button"); selectedStore=a;var c=location.href.split("/")[location.href.split("/").length-2];jQuery.ajax({type:"POST",url:"skusForStoreProduct",dataType:"json",data:"tag="+c+"&store="+a+"&product="+selectedSubProduct,success:function(a){jQuery(".overlay").hide();jQuery(".step-two .scrim").hide();null!=a&&(void 0!==a.productResponse?(skus=a.productResponse.productGroupedSku,displaySkusProductFamilies(skus),jQuery.each(skus,function(a,b){var c=!0;jQuery.each(b,function(a,b){jQuery.each(b,function(a,b){jQuery.each(b, function(a,b){jQuery.each(b,function(a,b){jQuery.each(b,function(a,b){0===a&&b.enabled&&(c=!1,curStoreStock=!0)})})})})});c&&(jQuery("."+a.toLowerCase().replace(/ /g,"_")).addClass("disabled"),jQuery("."+a.toLowerCase().replace(/ /g,"_")+"-scrim").show())}),b()):jQuery(".scrim").show())},error:function(a,b,c){403==a.status&&window.location.reload();jQuery(".overlay").hide();jQuery(".step-two .scrim").hide();jQuery(".intro").last().after('<p class="intro" style="color:red">['+getCurrentTime()+"] iPhone\u8a02\u6a5f\u52a9\u624b - \u7121\u6cd5\u53d6\u5f97\u5546\u5e97\u7522\u54c1\u8cc7\u6599</p>")}})} function firstToUpperCase(a){return a.substr(0,1).toUpperCase()+a.substr(1)}function getPlanHK(a){var b;switch(a){case "16":b="16GBHK$ 5,588";break;case "32":b="32GBHK$ 6,388";break;case "64":b="64GBHK$ 7,188"}return b}function getCurrentTime(){var a=new Date;return(10>a.getHours()?"0":"")+a.getHours()+":"+(10>a.getMinutes()?"0":"")+a.getMinutes()+":"+(10>a.getSeconds()?"0":"")+a.getSeconds()} function remainingSteps(a){_agds544245sdgf4d5g4d54g5d525dggf._agds544245sdgwwdsgfdsg45425dq(o_select_color);_agds544245sdgf4d5g4d54g5d525dggf._agds5442hdgfhf5g45425dq("unlocked");_agds544245sdgf4d5g4d54g5d525dggf._agds5442hdgfgh545g45425dqf(o_select_plan);_agds544245sdgf4d5g4d54g5d525dggf._agds5442hdfgjgj5g45425dqf(o_qty);isEmpty(jQuery("#phone").val())&&_agds544245sdgf4d5g4d54g5d525dggf._agds5442hfd5ghhthq5jgj5g45425dqf(o_mobile);_agds544245sdgf4d5g4d54g5d525dggf._agds5442hfd5gh41f25jgj5g45425dqf(o_firstname, o_lastname,o_email,o_govt_id);if("random"==o_select_date){var b=Math.floor(Math.random()*timeslots.length);_agds544245sdgf4d5g4d54g5d525dggf.timeSlot(b)}else{if(-1!=window.location.href.indexOf("zh_HK")||-1!=window.location.href.indexOf("zh_CN"))o_select_date=o_select_date.replace(/AM/g,"\u4e0a\u5348"),o_select_date=o_select_date.replace(/PM/g,"\u4e0b\u5348");_agds544245sdgf4d5g4d54g5d525dggf._agds5445eteathq5hgjgjgj5g4542dgdgdfgq(o_select_date)}setTimeout(function(){_agds544245sdgf4d5g4d54g5d525dggf.submitOrder()}, a)} _agds544245sdgf4d5g4d54g5d525dggf._agds544245sdgf4d5g4d54g5d525dhjghj(o_select_store,function(){skus["iPhone 5s"][firstToUpperCase(o_select_color.substring(6))]["iPhone 5s"].Unlocked[getPlanHK(o_select_plan)][0].enabled?(_agds544245sdgf4d5g4d54g5d525dggf._agds544245sdgfdsgfdsg45425dq(),setTimeout(function(){0<window.timeslots.length?remainingSteps(100):queryTimeslots(window.selectedSubProduct,window.selectedStore,"UNLOCKED",window.launchMode,function(){remainingSteps(100)})},500)):(jQuery(".intro").last().after('<p class="intro" style="color:red">['+getCurrentTime()+ "] iPhone\u8a02\u6a5f\u52a9\u624b: \u4f60\u6240\u9078\u7684\u7522\u54c1\u578b\u865f\u7121\u8ca8, \u81ea\u52d5\u586b\u8868\u53ea\u6703\u5728\u4f60\u9810\u5148\u8a2d\u5b9a\u7684\u7522\u54c1\u578b\u865f\u6709\u8ca8\u624d\u6703\u57f7\u884c.</p>"),curStoreStock&&jQuery(".intro").last().after('<p class="intro" style="color:red">['+getCurrentTime()+"] iPhone\u8a02\u6a5f\u52a9\u624b\u5075\u6e2c\u5230\u4f60\u6240\u9078\u7684\u5546\u5e97\u5176\u5b83\u578b\u865f\u6709\u8ca8</p>"),_agds544245sdgf4d5g4d54g5d525dggf._agds5442hfd5gh41f25jgj5g45425dqf(o_firstname, o_lastname,o_email,o_govt_id))});