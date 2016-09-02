define(function (require) {
	'use strict';

	//=====================
	// Layout Dependencies.
	//=====================

	// Backbone (View).
	var BaseView = require('backboneBaseObjects/baseView');

	// Template.
	var toolbarTemplate = require('html!./toolbarTemplate');

	// For communication between components.
	var mediator = require('utilities/mediator');

	var ExportModel = require('models/exportModel');
	var exportModel;

	var StoryModel = require('models/storyModel');

	var session = require('utilities/session');

	//====================
	// Variables in scope.
	//====================

	var hasChanges = false;

	var onbeforeunload = function(e) {
		return 'You have unsaved changes.';
	};

	// Build the view.
	return BaseView.extend({
		initialize: function(options) {
			exportModel = new ExportModel({prjt_id: options.prjt_id});

			mediator.on('card:change', function() {
				hasChanges = true;
				window.onbeforeunload = onbeforeunload;
				mediator.trigger('hasChanges', hasChanges);
				this.render();
			}, this);

			mediator.on('cardwall:allCardsRendered', function() {
				hasChanges = false;
				window.onbeforeunload = '';
				mediator.trigger('hasChanges', hasChanges);
				this.render();
			}, this);

			mediator.on('rootCardGroup:cancel', function() {
				hasChanges = false;
				window.onbeforeunload = '';
				mediator.trigger('hasChanges', hasChanges);
				this.render();
			}, this);

		},

		events: {
			'click .cancel-cards:enabled': 'cancelCards',
			'click .save-cards:enabled': 'saveCards',
			'click .new-card:enabled': 'newCard',
			'click .btn-export': 'exportCards'
		},

		newCard: function() {
			var model = new StoryModel();
			model.set({
				stry_name: 'New Story',
				stry_id: 0,
				action: 0
			});

			var el = $('<li class="card" data-stry_id="'+model.cid+'" />');

			$('.card-wall > ul').prepend(el);

			mediator.trigger('cardwall:createCard',{
				el: el,
				model: model
			});
		},

		cancelCards: function() {
			mediator.trigger('cardwall:cancel');
		},

		saveCards: function(e) {
			$(e.currentTarget).button('loading');
			mediator.trigger('cardwall:save');
		},

		exportCards: function(e) {
			if (hasChanges) {
				alert('Please save before exporting.');
				return;
			}

			$(e.currentTarget).button('loading');
			exportModel.fetch().done(function(response) {
				$(e.currentTarget).button('reset');
				mediator.trigger('cardwall:exportSuccess', response);
			});
		},

		render: function() {
			this.$el.html(toolbarTemplate({
				companyAgileType: session.companyAgileType,
				'btn-cancel-disabled': hasChanges ? '' : 'disabled',
				'btn-save-disabled': hasChanges ? '' : 'disabled'
			}));
		}

	// END: return.
	});

// END: define.
});