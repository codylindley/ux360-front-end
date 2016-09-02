define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	return Backbone.Collection.extend({

		initialize: function(options){
			this.objectType = options.objectType;
		},

		model: Backbone.Model,

		url: function(){
			return buildURL({
				serviceClassName: 'obre_objectrelationshipService',
				serviceMethodName: 'findAllObjectsByType',
				serviceParameters: {
					type: this.objectType,
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
