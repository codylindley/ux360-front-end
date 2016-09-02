define(function (require) {

	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var personaSetsTemplate = require('html!./personaSetsTemplate');

	var PersonaSetsCollection = require('collections/personaSetsCollection');
	var personaSetsCollection;

	var ProjectPersonasCollection = require('collections/projectPersonasCollection');
	var projectPersonasCollection;

	var prjt_id;

	return BaseView.extend({

		initialize: function(options){

			projectPersonasCollection = new ProjectPersonasCollection([], {prjt_id: options.prjt_id});

			personaSetsCollection = new PersonaSetsCollection();

			var that = this;

			$.when(
				projectPersonasCollection.fetch(),
				personaSetsCollection.fetch()
			).done(
				$.proxy(that.collectionsLoaded, that)
			);

		},

		collectionsLoaded: function(){
			personaSetsCollection.updateProjectPersonas(projectPersonasCollection);
			this.render();
			this.selectPersonaSet();
		},

		events: {
			'click a': 'clickPersonaSet'
		},

		clickPersonaSet: function(e){
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			this.selectPersonaSet(id);
		},

		selectPersonaSet: function(id){
			id = id || 'all';

			var activeModel = personaSetsCollection.findWhere({
				isActive: true
			});

			if(activeModel){
				activeModel.unset('isActive');
			}

			var personaSet = personaSetsCollection.get(id);
			if(personaSet){
				personaSet.set('isActive', true);
				mediator.trigger('selectPersonaSet', personaSet.get('Personas'));
				this.render();
			}
		},

		render: function() {
			this.$el.html(personaSetsTemplate(personaSetsCollection.toJSON()));
		}

	});

});
