define(function (require) {

	'use strict';

	var Ladda = require('ladda');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	//require('css!./objectPropertiesModalStyle');
	require('handlebarsHelpers/comparison');

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var objectPropertiesModalTemplate = require('html!./objectPropertiesModalTemplate');

	var properties;

	return BaseView.extend({

		initialize: function(options){
			mediator.on('showObjectPropertiesModal', function(type,objectId){
				this.render(type,objectId);
			}, this);
		},

		events: {
			'click #saveObjProps':'saveObjProps',
			'click input:checkbox':'updateWorkingGroups'
		},

		saveObjProps:function(e){

			var that = this;

			var $this = this.$(e.target);

			this.$(':input,:checkbox').addClass('disabled').prop('disabled',true);

			//grab button, start loader UI
			var loader = Ladda.create($this.closest('button').get(0));
			loader.start();

			properties.Description = this.$('#objDescription').val();
			properties.Name = this.$('#objName').val();

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'updateObjectProperties',
					'serviceParameters': {
						type: properties.type,
						referencePk: properties.id,
						propertiesMap: JSON.stringify(properties),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(){
				loader.stop();
				//reset scroll
				document.body.scrollTop = 0;
				if(properties.object_parent){
					mediator.trigger('renderGridList',properties.object_parent);
				}else{
					mediator.trigger('renderGridList',properties.type);
				}
				that.$el.modal('hide');
			});

		},

		updateWorkingGroups:function(e){
			var $this = $(e.target);
			var id = $this.data('id');

			if($this.is(':checked')){
				_.find(properties.workgroups,{id:id}).associated = 1;
			}else{
				_.find(properties.workgroups,{id:id}).associated = 0;
			}
		},

		render: function(type,objectId){

			var that = this;

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'getObjectProperties',
					'serviceParameters': {
						type: type,
						referencePk: objectId,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(response){

				var reponseWithNameDecoded = _.cloneDeep(response,function(obj){
					obj.Name = decodeURIComponent(obj.Name).replace(/\+/g,' ');	
				});

				properties = reponseWithNameDecoded;

				//create modal
				that.$el
					.html(objectPropertiesModalTemplate(reponseWithNameDecoded))
					.modal({width:650,show:false})
					.on('shown.bs.modal',function(e){
						$(e.target).find('#objName').focus();					
					})
					.modal('show');

			});

		}

	});

});
