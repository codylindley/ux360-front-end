define(function (require) {
	'use strict';

	//=====================
	// Region Dependencies.
	//=====================

	// Style.
	require('css!./frontStyle');

	// Backbone (View).
	var BaseView = require('backboneBaseObjects/baseView');

	// Template.
	var frontTemplate = require('html!./frontTemplate');

	// For communication between components.
	var mediator = require('utilities/mediator');

	// Bootstrap dropdown.
	var StoryModel = require('models/storyModel');

	// JS template engine.
	var handlebars = require('handlebars');

	// Build the view.
	return BaseView.extend({
		initialize: function() {
			this.model = this.options.model;

			handlebars['default'].registerHelper('hasAgileComments', function(comment_count_agile) {
				return comment_count_agile > 0 ? 'has-agile-comments' : '';
			});

			this.listenTo(this.model, 'change', this.render);
			mediator.on('card:commentCountChanged', this.commentCountChanged, this);
			mediator.on('card:attachmentCountChanged', this.attachmentCountChanged, this);
		},

		commentCountChanged: function(data) {
			if (data.id === this.model.id) {
				this.model.set('comment_count', data.count);
			}
		},

		attachmentCountChanged: function(data) {
			if (data.id === this.model.id) {
				this.model.set('attachment_count', data.count);
			}
		},

		events: {
			'click .flip-card': 'flipCard',
			'click .new-card': 'newCard',
			'click .delete-card': 'deleteCard',
			'mouseenter [data-toggle="tooltip"]': 'showToolTip'
		},

		showToolTip: function(e) {
			$(e.currentTarget).tooltip('show');
		},

		flipCard: function(e) {
			e.stopPropagation();
			$(e.currentTarget).tooltip('hide');
			mediator.trigger('cardwall:flipCard', this.model.id || this.model.cid);
		},

		newCard: function(e) {
			e.stopPropagation();

			var model = new StoryModel();

			model.set({
				stry_name: 'New Story',
				stry_id: 0,
				action: 0
			});

			var el = $('<li class="card" data-stry_id="'+model.cid+'" />');
			var ul = $(e.currentTarget).closest('li').find('> ul');

			ul.prepend(el);

			mediator.trigger('cardwall:createCard',{
				el: el,
				model: model
			});
		},

		deleteCard: function(e) {
			e.stopPropagation();
			var stry_ids = [];
			var li = $(e.currentTarget).closest('li');

			li.find('li').each(function() {
				mediator.trigger('cardwall:deleteCard', $(this).data('stry_id'));
			});

			mediator.trigger('cardwall:deleteCard', li.data('stry_id'));
		},

		render: function() {
			this.$el.html(frontTemplate(this.model.toJSON()));
		}

	// END: return.
	});

// END: define.
});