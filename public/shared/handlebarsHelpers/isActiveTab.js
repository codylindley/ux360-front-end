define(function (require) {

	'use strict';

	var handlebars = require('handlebars');

	handlebars['default'].registerHelper('isActive', function(tab){
		return (this.tab === tab) ? 'active' : '';
	});


});


