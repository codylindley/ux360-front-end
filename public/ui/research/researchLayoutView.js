define(function (require) {

	'use strict';

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//layout template
	var researchLayoutTemplate = require('html!./researchLayoutTemplate');

	//////*view's (i.e. regions) in project list layout*///////

	//region/view
	/*var ObjectsMenuView = require('./objectsMenu/objectsMenuView');
	var objectsMenuView;*/


	//////* end view's in project list layout*///////

	return BaseView.extend({

		render:function(){

			//append layout
			this.$el.html(researchLayoutTemplate({}));

			// instantiate sub regions...

			/* view regions */

			/*objectsMenuView = new ObjectsMenuView({
				el: this.$('.objectsView'),
				type:this.options.type
			});*/

			return this;
			
		}

	});

});


