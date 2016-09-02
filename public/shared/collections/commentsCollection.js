define(function (require) {

	'use strict';

	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	var CommentModel = require('models/commentModel');

	return Backbone.Collection.extend({

		initialize: function(models, options){
			this.uxcm_referencepk = options.uxcm_referencepk;
		},

		model: CommentModel,

		url: function(){
			return buildURL({
				'serviceClassName': 'uxcm_commentService',
				'serviceMethodName': 'findAllCommentsByTypeTitle_Referencepk',
				'serviceParameters': {
					'type': 'Userstory',
					'uxcm_referencepk': this.uxcm_referencepk,
					'orderByField': 'create_date',
					'orderByAscending': '0',
					'groupId': session.groupId
				}
			});
		}


	});

});
