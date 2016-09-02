define(function (require) {

	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var createProjectButtonTemplate = require('html!./createProjectButtonTemplate');

	return BaseView.extend({

		events: {
			'click .btn-create-new-project': 'showCreateProjectModal'
		},

		showCreateProjectModal: function(){
			mediator.trigger('showCreateProject');
		},

		render: function() {
			this.$el.html(createProjectButtonTemplate({}));
			return this;
		}

	});

});
