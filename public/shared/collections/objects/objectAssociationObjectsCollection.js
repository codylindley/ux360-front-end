define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	return Backbone.Collection.extend({

		initialize: function(options){
			this.objectType = options.objectType;
			this.objectId = options.objectId;
			this.objectTypeRequired = options.objectTypeRequired;
		},

		model: Backbone.Model,

		url: function(){
			return buildURL({
				serviceClassName: 'obre_objectrelationshipService',
				serviceMethodName: 'findAllAssociableObjectsByType',
				serviceParameters: {
					object_type: this.objectType,
					object_Id: this.objectId,
					required_object_type: this.objectTypeRequired,
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
