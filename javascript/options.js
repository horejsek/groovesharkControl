
function restoreOptions () {
    if (localStorage['showNotification'] != 'false') {
        $('#showNotification').attr('checked', 'checked');
    }
    
    $('#showNotificationForMiliseconds').val(howLongDisplayNotification());
}

function saveOptions () {
    localStorage['showNotification'] = $('#showNotification').attr('checked') == 'checked';
    localStorage['showNotificationForMiliseconds'] = $('#showNotificationForMiliseconds').val();
    
    saved();
}

function saved () {
    $('#status').text('Options saved.');
    setTimeout(clearStatus, 1500);
}

function clearStatus () {
    $('#status').text('');
}

$(document).ready(function () {

    $('#showNotification').change(function () {
        if ($(this).attr('checked') == 'checked') {
            $('#showNotificationForMiliseconds').removeAttr('disabled');
        } else {
            $('#showNotificationForMiliseconds').attr('disabled', 'disabled');
        }
    });

});

