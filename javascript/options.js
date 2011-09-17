
// Restore a boolean option
function restoreBooleanOption (storageKey, defaultValue, callback) {
	restoreGenericOption(storageKey, defaultValue, function(value){
		callback(value !== 'false');
	});
}

// Restore a generic option
function restoreGenericOption (storageKey, defaultValue, callback) {
	if(localStorage[storageKey] === null)
		localStorage[storageKey] = defaultValue;

	callback(localStorage[storageKey] || defaultValue);
}

// Restore options
function restoreOptions () {

	// Restore notification
	restoreBooleanOption('showNotification', 'true', function(value){
		$('#showNotification').attr('checked', value);
	});

	restoreGenericOption('showNotificationForMiliseconds', 5000, function(value){
    	$('#showNotificationForMiliseconds').val(value < 1000 ? 1000 : value);
	});

	// Restore pin and left tab
	restoreBooleanOption('prepareGrooveshark', 'false', function(value){
		$('#prepareGrooveshark').attr('checked', value);
	});

	restoreGenericOption('prepareGroovesharkMode', 'false', function(value){
    	$('#prepareGroovesharkMode').val(value);
	});

	// Restore remove ads
	restoreBooleanOption('removeAds', 'false', function(value){
		$('#removeAds').attr('checked', value);
	});

	// Enable/disabled checkboxs
    $('td.enable > :checkbox').change(function(){
    	var checked = $(this).is(':checked');
		$(this).closest('tr')
			.toggleClass('enabled', checked)
			.find(':input, select, textarea').not(':checkbox').attr('disabled', !checked);
	}).change();

	// Show remove ads advise
	$('#removeAds').change(function(){
		if ($(this).is(':checked'))
			alert(chrome.i18n.getMessage('optionsGeneralRemoveAdsAdvise'));
	});

}

// Save options
function saveOptions () {

	// Save notification
    localStorage['showNotification'] = $('#showNotification').attr('checked') == 'checked';
    localStorage['showNotificationForMiliseconds'] = $('#showNotificationForMiliseconds').val();

	// Save pin and left tab
    localStorage['prepareGrooveshark'] = $('#prepareGrooveshark').attr('checked') == 'checked';
    localStorage['prepareGroovesharkMode'] = $('#prepareGroovesharkMode').val();

    // Save remove ads
    localStorage['removeAds'] = $('#removeAds').attr('checked') == 'checked';

	// Show the "Options saved" tag
    $('#status').stop()
    	.css('opacity', 1)
		.fadeIn(400).delay(1500)
		.fadeOut(400);

}

// Restore options
$(restoreOptions);
