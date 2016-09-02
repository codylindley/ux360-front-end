define(function (require) {

	'use strict';

	var session = require('utilities/session');

	return function(options){

		var url = '/uxm-plugin/json?';

		var data = {
			serviceClassName: 'com.t7.uxm.service.' + options.serviceClassName + 'Util',
			serviceMethodName: options.serviceMethodName,
			serviceParameters: _.keys(options.serviceParameters)
		};

		url += 'serviceClassName=com.t7.uxm.service.' + options.serviceClassName + 'Util';
		url += '&serviceMethodName=' + options.serviceMethodName;
		url += '&serviceParameters=[' + _.keys(options.serviceParameters) + ']';

		_.each(options.serviceParameters, function(parameter, key) {
			url += '&' + key + '=' + encodeURIComponent(parameter);
			data[key] = parameter;
		});

		if (!options.serviceParameters.userId) {
			url += '&userId=' +  (session.userId || '');
		}

		return url;
	};

});
