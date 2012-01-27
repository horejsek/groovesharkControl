function restoreBooleanOption (storageKey, defaultValue, callback) {
    restoreGenericOption(storageKey, defaultValue, function(value){
        callback(value !== 'false');
    });
}

function restoreGenericOption (storageKey, defaultValue, callback) {
    if (localStorage[storageKey] === null) {
        localStorage[storageKey] = defaultValue;
    }

    callback(localStorage[storageKey] || defaultValue);
}

function restoreOptions () {
    // Restore notification
    restoreBooleanOption('showNotification', 'true', function (value) {
        $('#showNotification').attr('checked', value);
    });

    restoreGenericOption('showNotificationForMiliseconds', 5000, function (value) {
        $('#showNotificationForMiliseconds').val(value < 1000 ? 1000 : value);
    });

    // Restore pin and left tab
    restoreBooleanOption('prepareGrooveshark', 'false', function (value) {
        $('#prepareGrooveshark').attr('checked', value);
    });

    restoreGenericOption('prepareGroovesharkMode', 'onCreate', function (value) {
        $('#prepareGroovesharkMode').val(value);
    });

    // Enable/disabled checkboxs
    $('td.enable > :checkbox').change(function () {
        var checked = $(this).is(':checked');
        $(this).closest('tr')
            .toggleClass('enabled', checked)
            .find(':input, select, textarea').not(':checkbox').attr('disabled', !checked);

        toggleSavePendings(true);
    }).change();

    // Show save pendings on change inputs
    $('input').change(function () {
        toggleSavePendings(true);
    });

    // Enable toggler
    toggleSavePendingsEnabled = true;
}

function saveOptions () {
    // Save notification
    localStorage['showNotification'] = $('#showNotification').is(':checked');
    localStorage['showNotificationForMiliseconds'] = $('#showNotificationForMiliseconds').val();

    // Save pin and left tab
    localStorage['prepareGrooveshark'] = $('#prepareGrooveshark').is(':checked');
    localStorage['prepareGroovesharkMode'] = $('#prepareGroovesharkMode').val();

    // Show the "Options saved" tag
    $('#status').stop()
        .css('opacity', 1)
        .fadeIn(400).delay(1500)
        .fadeOut(400);

    // Hide save pendings
    toggleSavePendings(false);
}

// Toggle save pendings
var toggleSavePendingsEnabled = false;
function toggleSavePendings (mode, force){
    if (toggleSavePendingsEnabled) {
        $('span#savePendings').fadeTo(150, mode ? 1 : 0);
    }
}

$(restoreOptions);
