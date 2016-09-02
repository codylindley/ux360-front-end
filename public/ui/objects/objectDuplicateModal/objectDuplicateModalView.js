define(function (require) {

	'use strict';

	var Ladda = require('ladda');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	//require('css!./objectDuplicateModalStyle');
	require('handlebarsHelpers/comparison');

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var objectDuplicateModalTemplate = require('html!./objectDuplicateModalTemplate');

	return BaseView.extend({

		initialize: function(options){
			mediator.on('showObjectDuplicateModal', function(type,objectId,parentId,name){
				this.render(type,objectId,parentId,name);
			}, this);
		},

		events: {
			'click #duplicateObject':'duplicateObject'
		},

		duplicateObject:function(e){

			var that = this;

			var $this = this.$(e.target).closest('button');

			this.$('input').addClass('disabled').prop('disabled',true);

			//grab button, start loader UI
			var loader = Ladda.create($this.get(0));
			loader.start();

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'duplicateObject',
					'serviceParameters': {
						type: $this.data('type'),
						referencePk: $this.data('id'),
						parent: $this.data('parent-id'),
						new_title:this.$('input').val(),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(){
				loader.stop();
				document.body.scrollTop = 0;
				mediator.trigger('renderGridList','Personaset');
				that.$el.modal('hide');
			});

		},

		render: function(type,objectId,parentId,name){

			var that = this;

			that.$el
				.html(objectDuplicateModalTemplate({type:type,id:objectId,parentId:parentId,Name:name}))
				.modal({width:650,show:false})
				.on('shown.bs.modal',function(){
					that.$el.find('input').focus();
				})
				.modal('show')
				.find('input').on('keyup focus',function(e){
					if(that.$(e.target).val() === ''){
						that.$('#duplicateObject')
						.addClass('disabled')
						.prop('disabled',true);
					}else{
						that.$('#duplicateObject')
						.removeClass('disabled')
						.prop('disabled',false);
					}
				});

		}

	});

});
