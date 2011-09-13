
function restoreOptions () {
    if (localStorage['showNotification'] != 'false') {
        $('#showNotification').attr('checked', 'checked');
    }

    if (localStorage['prepareGrooveshark'] != 'false') {
        $('#prepareGrooveshark').attr('checked', 'checked');
    }

    $('#showNotificationForMiliseconds').val(howLongDisplayNotification());
}

function saveOptions () {
    localStorage['showNotification'] = $('#showNotification').attr('checked') == 'checked';
    localStorage['prepareGrooveshark'] = $('#prepareGrooveshark').attr('checked') == 'checked';
    localStorage['showNotificationForMiliseconds'] = $('#showNotificationForMiliseconds').val();

    saved();
}

function saved () {
    $('#status')
    	.stop()
    	.css('opacity', 1)
		.fadeIn(400)
		.delay(1500)
		.fadeOut(400);
}

$(document).ready(function () {

    $('#showNotification').change(function () {
        if ($(this).attr('checked') == 'checked') {
            $('#showNotificationForMiliseconds').removeAttr('disabled');
        } else {
            $('#showNotificationForMiliseconds').attr('disabled', 'disabled');
        }
    });

    $('#status').text(chrome.i18n.getMessage('optionsSaved'));

});

