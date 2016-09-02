define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	return Backbone.Collection.extend({

		initialize: function(value,options){
			this.objectType = options.objectType;
			this.objectId = options.objectId;
		},

		model: Backbone.Model,

		url: function(){
			return buildURL({
				serviceClassName: 'obre_objectrelationshipService',
				serviceMethodName: 'associateObjects',
				serviceParameters: {
					object_type: this.objectType,
					object_id: this.objectId,
					objectMap: JSON.stringify(this.toJSON()),
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
