define(function (require) {

	'use strict';

	// ******************************
	// Region Dependencies
	// ******************************

	// Backbone (View)
	var BaseView = require('backboneBaseObjects/baseView');

	// template
	var headerTemplate = require('html!./headerTemplate');


	return BaseView.extend({
		initialize: function(){
			this.model = this.options.model;
			this.listenTo(this.model, 'change:stry_name', this.render);
		},
		render: function() {
			this.$el.html(headerTemplate(this.model.toJSON()));
		}

	});

});
