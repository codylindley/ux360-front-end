define(function (require) {
	'use strict';

	//=====================
	// Layout Dependencies.
	//=====================

	// Style.
	require('css!./projectLayoutStyle');

	// View.
	var BaseView = require('backboneBaseObjects/baseView');

	// Template.
	var projectLayoutTemplate = require('html!./projectLayoutTemplate');

	// Helper.
	require('handlebarsHelpers/isActiveTab');

	//===============================
	// Sub Views (Regions & Layouts).
	//===============================

	// Project Name.
	var ProjectNameView = require('./projectName/projectNameView');
	var projectNameView;

	// Tabs.
	var TabsView = require('./tabs/tabsView');
	var tabsView;

	// Project Overview (Tab content area).
	var ProjectOverviewLayoutView = require('./cardwall/cardwallLayoutView');
	var cardwallLayoutView;

	// Import Tasks (Tab content area).
	var ImportTasksLayoutView = require('./importTasks/importTasksLayoutView');
	var importTasksLayoutView;

	//====================
	// Variables in scope.
	//====================

	var prjt_id;
	var tab;

	return BaseView.extend({
		render: function() {
			// These options are passed in by the router.
			prjt_id = this.options.prjt_id;
			tab = this.options.tab;

			// Render the layout.
			this.$el.html(projectLayoutTemplate({tab: tab}));

			// Instantiate sub views.
			projectNameView = new ProjectNameView({
				// This is an <h2> but let's leave it generic, so that
				// if the markup changes, we don't have to change here.
				el: this.$('*[data-view="projectNameView"]'),
				prjt_id: prjt_id
			});

			tabsView = new TabsView({
				el: this.$('div[data-view="tabsView"]'),
				prjt_id: prjt_id,
				tab: tab
			});
			tabsView.render();

			if (tab === 'cardwall') {
				cardwallLayoutView = new ProjectOverviewLayoutView({
					el: this.$('div[data-view="cardwallLayoutView"]'),
					prjt_id: prjt_id
				});
				cardwallLayoutView.render();
			}

			if (tab === 'importTasks') {
				importTasksLayoutView = new ImportTasksLayoutView({
					el: this.$('div[data-view="importTasksLayoutView"]'),
					prjt_id: prjt_id
				});
				importTasksLayoutView.render();
			}
		}

	// END: return.
	});

// END: define.
});