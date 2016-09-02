define(function (require) {

	'use strict';
	
	require('handlebarsHelpers/decodeUrl');
	require('css!./objectsBreadCrumbStyle');
	require('handlebarsHelpers/comparison');
	var mediator = require('utilities/mediator');
	var session = require('utilities/session');
	var $ = require('jquery');

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//list layout template
	var objectsBreadCrumbTemplate = require('html!./objectsBreadCrumbTemplate');

	return BaseView.extend({

		initialize:function(){
			mediator.on('renderObjectsBreakCrumb',function(type,staticCrumb){
				this.render(type,staticCrumb);
			},this);

			mediator.on('removeObjectsBreakCrumb', function(){
				this.$el.empty();
			},this);
		},

		events:{
			'click .firstCrumbClick':'triggerMenu'
		},

		triggerMenu:function(){
			mediator.trigger('triggerObjectsMenuViewClick');
			return false;
		},

		render:function(type,staticCrumb){
			if(type === null || type === undefined || staticCrumb === undefined){return this;}

			this.$el.html(objectsBreadCrumbTemplate({
				type:type,
				liferayPath:$('body').is('.liferay')?session.root+'/ux-modeling':'',
				staticCrumb:staticCrumb
			}));
		}

	});

});


