
function restoreOptions () {
    if (localStorage['showNotification'] != 'false') {
        $('#showNotification').attr('checked', 'checked');
    }
}

function saveOptions () {
    localStorage['showNotification'] = $('#showNotification').attr('checked') == 'checked';
    
    saved();
}

function saved () {
    $('#status').text('Options saved.');
    setTimeout(clearStatus, 1500);
}

function clearStatus () {
    $('#status').text('');
}

