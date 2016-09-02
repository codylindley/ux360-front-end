define(function (require) {
	'use strict';

	var session = require('utilities/session');

	return function(options){

		var data = {
			serviceClassName: 'com.t7.uxm.service.' + options.serviceClassName + 'Util',
			serviceMethodName: options.serviceMethodName,
			serviceParameters: '['+_.keys(options.serviceParameters)+']'
		};

		_.each(options.serviceParameters, function(parameter, key) {
			data[key] = parameter;
		});

		if (!options.serviceParameters.userId) {
			data.userId = session.userId;
		}

		return data;
	};
});