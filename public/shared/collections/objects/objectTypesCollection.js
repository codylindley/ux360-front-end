define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	return Backbone.Collection.extend({

		model: Backbone.Model,

		url: function(){
			return buildURL({
				serviceClassName: 'obre_objectrelationshipService',
				serviceMethodName: 'getAllObjectTypes',
				serviceParameters: {
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
