define(function (require) {

	'use strict';

	// ******************************
	// Layout Dependencies
	// *****************************
	// Backbone (View)
	var BaseView = require('backboneBaseObjects/baseView');

	// Template
	var notificationTemplate = require('html!./notificationTemplate');

	

	return BaseView.extend({

		initialize: function(options){
			this.message = options.message;
			var that = this;
			this.$el.bind('closed.bs.alert', function(){
				that.remove();
			});
		},

		render: function() {
			this.$el.html(notificationTemplate({
				message: this.message
			}));
		}

	});

});
