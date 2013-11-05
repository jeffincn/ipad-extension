function init_baoliao() {
    $('#baoliao_form').validate({
        submitHandler: function(form) {
            var button = $('#button_baoliao_send');
            button.button('loading');
            $.ajax({
                url: 'http://push-chrome.smzdm.com/baoliao',
                type: 'POST',
                dataType: 'html',
                data: $('form#bug_report_form').serialize(),
                success: function(result) {
                    button.button('complete');
                    $('#bug_report_form')[0].reset();
                }
            });
            return false;
        }
    });
}
$(document).ready(init_baoliao);