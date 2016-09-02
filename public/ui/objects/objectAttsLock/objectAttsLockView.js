define(function (require) {

	'use strict';

	var mediator = require('utilities/mediator');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var _ = require('underscore');

	require('bootstrapToggle');

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//css
	require('css!./objectAttsLockViewStyle');

	//layout template
	var objectAttsLockTemplate = require('html!./objectAttsLockTemplate');

	return BaseView.extend({

		initialize: function(){

			mediator.on('renderObjectAttsLock',function(type,objectName,objectId){
				this.delegateEvents().render(type,objectName,objectId);
			},this);

			mediator.on('removeObjectAttsLock',function(type,objectName,objectId){
				this.undelegateEvents().$el.empty();
				$('.objectAttributesView').removeClass('attsAreLocked');
			},this);

		},

		events:{
			'switch-change #editModeSwithBtn':'toggleEditMode'
		},

		render:function(type,objectName,objectId){

			//if type and object are missing then cancel render
			if(!_.all([type,objectName,objectId])){return this;}

			this.type = arguments[0];
			this.objectName = arguments[1];
			this.objectId = arguments[2];

			var that = this;

			//check if attributes are currently being edited, if so don't show toggle edit button
			$.ajax({
				dataType:'json',
				url:buildURL({
					'serviceClassName': 'oblo_objectlockingService',
					'serviceMethodName': 'checkObjectLock',
					'serviceParameters': {
						type: type,
						referencePk: objectId,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(data, textStatus){
				//asking if returnValue is false, the object is not locked so it can be edited
				that.$el.html(objectAttsLockTemplate({canEdit:data.returnValue === 'false'?true:false}));
				//setup switch, in template

				if(data.returnValue === 'false'){
					$('#editModeSwithBtn').bootstrapSwitch();
				}else{
					$('.objectAttributesView').addClass('attsAreLocked');
				}
			});

		},

		toggleEditMode:function(e,data){
			var value = data.value; //toggle value
			if(value){ //edit mode on
				this.lockAtts();
			}else{ //edit mode off
				this.unlockAtts();
			}
		},

		lockAtts:function(){ //will lock this object's atts
			//lock atts
			$.ajax({
				dataType:'json',
				url:buildURL({
					'serviceClassName': 'oblo_objectlockingService',
					'serviceMethodName': 'addObjectlock',
					'serviceParameters': {
						type: this.type,
						referencePk: this.objectId,
						oblo_sessionid: session.sessionID,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(data, textStatus){
				var $attsAccordion = $('#attsAccordion');
				$attsAccordion.find('[disabled]').removeAttr('disabled');
				$('.attsDisabledCover').hide();
			}).error(function(jqXHR, textStatus, errorThrown){
				console.log('HTTP Error: '+errorThrown+' | Error Message: '+textStatus);
			});

		},

		unlockAtts:function(){ //will unlock this object's atts
			//lock atts
			$.ajax({
				dataType:'json',
				url:buildURL({
					'serviceClassName': 'oblo_objectlockingService',
					'serviceMethodName': 'deleteObjectlock',
					'serviceParameters': {
						type: this.type,
						referencePk: this.objectId,
						oblo_sessionid: session.sessionID,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(data, textStatus){
				var $attsAccordion = $('#attsAccordion');
				$('#attsAccordion').find('input, select, textarea, button').attr('disabled','disabled');
				$('.attsDisabledCover').show();
			});
		}


	});

});


