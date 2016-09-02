define(function (require) {

	'use strict';

	var handlebars = require('handlebars');

	handlebars['default'].registerHelper('debug', function(optionalValue){
		if (!optionalValue.data && !optionalValue.hash) {
			console.log("Value");
			console.log("====================");
			console.log(optionalValue);
		}else{	
			console.log("Current Context");
			console.log("====================");
			console.log(this);
		}
	});

});


