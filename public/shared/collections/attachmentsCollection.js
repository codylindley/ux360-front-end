define(function (require) {

	'use strict';

	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	var AttachmentModel = require('models/attachmentModel');

	return Backbone.Collection.extend({

		initialize: function(models, options){
			this.referencepk = options.referencepk;
		},

		model: AttachmentModel,

		url: function(){
			return buildURL({
				'serviceClassName': 'uxme_mediaService',
				'serviceMethodName': 'findMediaByType_Referencepk_Object',
				'serviceParameters': {
					type: 'Userstory',
					referencepk: this.referencepk,
					object_type: '',
					object_referencepk: 0,
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}


	});

});
