define(function (require) {

	'use strict';

	var Ladda = require('ladda');
	var _ = require('underscore');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	require('css!./objectHistoryModalStyle');
	require('handlebarsHelpers/comparison');
	var moment = require('moment');
	require('handlebarsHelpers/decodeUrl');
	require('handlebarsHelpers/decodeHTML');


	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var objectHistoryModalTemplate = require('html!./objectHistoryModalTemplate');

	var didObjectChange = false;

	return BaseView.extend({

		initialize: function(options){
			mediator.on('showObjectHistoryModal', function(type,objectId){
				this.render(type,objectId);
			}, this);
		},

		render: function(type,objectId){

			var that = this;

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'getObjectHistory',
					'serviceParameters': {
						type: type,
						referencePk: objectId,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(response){

				_.each(response.history,function(obj){
					obj.update_date = moment(new Date(Number(obj.update_date)).toISOString()).format("MMM Do YY");
				});

				//create modal
				that.$el
					.html(objectHistoryModalTemplate(response))
					.modal({width:700,height:($(window).height() - 265)});

			});

		}

	});

});
