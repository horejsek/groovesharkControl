(function($){
	// chrome.i18n.getMessage() based on HTML attr
	$.extend({
		i18n: function(where){
			// Fill .text() on element
			$('[i18n-text]', where).each(function(){
				var self = $(this);
				self.text(chrome.i18n.getMessage(self.attr('i18n-text')))
					.removeAttr('i18n-text');
			});

			// Fill .text() with content
			$('[i18n-html]', where).each(function(){
				var self = $(this);
				var contents = self.contents().detach();

				var message = chrome.i18n
					.getMessage(self.attr('i18n-html'))
					.replace('%contents', '<span/>');

				self.html(message)
					.removeAttr('i18n-text')
					.find('span').replaceWith(contents);
			});

			// Fill attributes on element (need start with i18n-; except "text" and "html")
			$('*', where).each(function(){
				var self = $(this);
				$.each(this.attributes, function(i, attr){
					if(attr.name.indexOf('i18n-') === 0){
						self.attr(attr.name.substr(5, attr.name.length - 5),
							chrome.i18n.getMessage(attr.value));
					}
				});
			});
		}
	});

	$(function(){
		$.i18n(document);
	});
})(jQuery);