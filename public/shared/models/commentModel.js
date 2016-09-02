define(function (require) {

	'use strict';

	var _ = require('underscore');
	var Backbone = require('backbone');

	var session = require('utilities/session');
	var buildData = require('utilities/buildApiData');

	return Backbone.Model.extend({

		idAttribute: 'uxcm_id',

		url: '/uxm-plugin/json',

		read: function(){

			var data = buildData({
				serviceClassName: 'uxcm_commentService',
				serviceMethodName: 'addCommentWithTitles',
				serviceParameters: {
					type: 'Userstory',
					uxcm_referencepk: this.get('uxcm_referencepk'),
					uxcm_comment: this.get('uxcm_comment'),
					groupId: session.groupId,
					userId: session.userId
				}
			});

		},

		create: function(){
			var data = buildData({
				serviceClassName: 'uxcm_commentService',
				serviceMethodName: 'addCommentWithTitles',
				serviceParameters: {
					type: 'Userstory',
					uxcm_referencepk: this.get('uxcm_referencepk'),
					uxcm_comment: this.get('uxcm_comment'),
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch({
				data: data
			});
		},

		'delete': function(){
			var data = buildData({
				serviceClassName: 'uxcm_commentService',
				serviceMethodName: 'deleteComment',
				serviceParameters: {
					'uxcm_id': this.id
				}
			});
			return this.fetch({
				type: 'POST',
				data: data
			});
		},

		update: function(fieldName, fieldValue){
			var data = buildData({
				serviceClassName: 'uxcm_commentService',
				serviceMethodName: 'updateCommentWithField',
				serviceParameters: {
					uxcm_id: this.id,
					fieldName: fieldName,
					fieldValue: fieldValue,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch({
				type: 'POST',
				data: data
			});
		}


	});

});
