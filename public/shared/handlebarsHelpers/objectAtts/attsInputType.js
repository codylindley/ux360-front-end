define(function (require) {

	'use strict';

	var handlebars = require('handlebars');

	handlebars['default'].registerHelper('attsInputType', function(type){
		if(type === "Numeric" || type === "Integer"){
			return 'number';
		}else if(type === "Date"){
			return 'date';
		}else{
			return 'text';
		}
	});

});


