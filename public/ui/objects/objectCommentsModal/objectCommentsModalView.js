define(function (require) {

	'use strict';

	var Ladda = require('ladda');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	require('css!./objectCommentsModalStyle');
	require('handlebarsHelpers/comparison');
	var moment = require('moment');

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');
	require('textInputCounter'); 

	var objectCommentsModalTemplate = require('html!./objectCommentsModalTemplate');
	var objectCommentTemplate = require('html!./objectCommentTemplate');

	return BaseView.extend({

		initialize: function(options){
			mediator.on('showObjectCommentsModal', function(type,objectId){
				this.render(type,objectId);
			}, this);
		},

		events: {
			'click #addComment':'addComment'
		},

		addComment:function(e){

			var that = this;

			var $this = this.$(e.target);
			var $textarea = this.$('textarea');

			$textarea.addClass('disabled').prop('disabled',true);
			$this.closest('button').addClass('disabled').prop('disabled',true);

			//grab button, start loader UI
			var loader = Ladda.create($this.closest('button').get(0));
			loader.start();

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'addObjectComment',
					'serviceParameters': {
						type: $this.closest('button').data('type'),
						referencePk: $this.closest('button').data('id'),
						comment: $textarea.val(),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(response){
				var date = response.comments[0];
				date.create_date = moment(new Date(Number(date.create_date)).toISOString()).format("MMM Do YY");
				var comment = objectCommentTemplate(response.comments[0]);
				that.$('#commentsList').prepend(comment);
				that.$('#commentsList').find('.newComment').fadeTo(1000, 1);
				$textarea.val('').removeClass('disabled').prop('disabled',false);
				loader.stop();
			});

		},

		render: function(type,objectId){

			var that = this;

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'getObjectComments',
					'serviceParameters': {
						type: type,
						referencePk: objectId,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(response){

				_.each(response.comments,function(obj){
					obj.create_date = moment(new Date(Number(obj.create_date)).toISOString()).format("MMM Do YY");
				});

				//create modal
				that.$el
					.html(objectCommentsModalTemplate(response))
					.modal({width:750,show:false})
					.on('shown.bs.modal',function(){
						that.$el.find('textarea').focus().maxlength();
					})
					.modal('show')
					.find('textarea').on('keyup focus',function(e){
						if(that.$(e.target).val() === ''){
							that.$('#addComment')
							.addClass('disabled')
							.prop('disabled',true);
						}else{
							that.$('#addComment')
							.removeClass('disabled')
							.prop('disabled',false);
						}
					});

			});

		}

	});

});
