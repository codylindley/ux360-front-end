define(function (require) {

	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');
	require('css!./createObjectBtnStyle');

	var createObjectBtnTemplate = require('html!./createObjectBtnTemplate');

	var objectType;

	return BaseView.extend({

		initialize:function(){

			mediator.on('renderCreateObjectBtn',function(type){
				this.delegateEvents().render(type);
			}, this);

			mediator.on('removeCreateObjectBtn',function(type){
				this.undelegateEvents().$el.empty();
			}, this);

		},

		events: {
			'click .createNewObjectBtn': 'showCreateObjectModal'
		},

		showCreateObjectModal: function(){
			mediator.trigger('showCreateObjectModal',objectType);
		},

		render: function(type,object) {

			if(object || type === null){return this;}

			objectType = type;
			var btnName = "add/arrange";

			if(type === "Personaset" || type === "Userstudy"){
				btnName = "add";
			}

			this.$el.html(createObjectBtnTemplate({type:type,btnName:btnName}));

			return this;
		}

	});

});
