define(function (require) {
	'use strict';

	// Style.
	require('css!./importTasksLayoutStyle');

	var BaseView = require('backboneBaseObjects/baseView');

	var importTasksLayoutTemplate = require('html!./importTasksLayoutTemplate');

	// Regions.
	var PersonaSetsView = require('./personaSets/personaSetsView');

	var PersonasFilterView = require('./personasFilter/personasFilterView');

	var PersonasView = require('./personas/personasView');

	var TasksView = require('./tasks/tasksView');

	// Build the view.
	return BaseView.extend({
		render: function(){
			this.$el.html(importTasksLayoutTemplate({}));

			var personaSetsView = new PersonaSetsView({
				el: this.$('div[data-view="personaSetsView"]'),
				prjt_id: this.options.prjt_id
			});

			var personasFilterView = new PersonasFilterView({
				el: this.$('div[data-view="personasFilterView"]')
			});
			personasFilterView.render();

			var personasView = new PersonasView({
				el: this.$('div[data-view="personasView"]')
			});

			var tasksView = new TasksView({
				el: this.$('div[data-view="tasksView"]'),
				prjt_id: this.options.prjt_id
			});
		}

	// END: render.
	});

// END: define.
});