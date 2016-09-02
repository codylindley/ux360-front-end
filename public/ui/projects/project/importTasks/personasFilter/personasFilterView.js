define(function (require) {

	'use strict';

	var _ = require('underscore');
	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var personasFilterTemplate = require('html!./personasFilterTemplate');

	return BaseView.extend({

		events: {
			'keyup .filter-input': 'filterPersonas'
		},

		filterPersonas: _.debounce(function(e){
			var filterValue = $.trim($(e.currentTarget).val());
			mediator.trigger('filterPersonas', filterValue);
		}, 200),

		render: function() {
			this.$el.html(personasFilterTemplate({}));
		}

	});

});
