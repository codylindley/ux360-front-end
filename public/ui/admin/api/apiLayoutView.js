define(function (require) {

	'use strict';

	require('css!./apiLayoutStyle');

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//api layout template
	var apiLayoutTemplate = require('html!./apiLayoutTemplate');

	//view's in api layout

	//list
	var ApiListView = require('./apiList/apiListView');
	var apiListView;

	return BaseView.extend({

		render:function(){

			//append layout
			this.$el.html(apiLayoutTemplate({}));

			apiListView = new ApiListView({el:'div[data-view="apiListView"]'});

		}

	});

});
