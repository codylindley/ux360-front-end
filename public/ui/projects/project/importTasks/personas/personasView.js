define(function (require) {

	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var personasTemplate = require('html!./personasTemplate');
	var personasCollection;

	return BaseView.extend({

		initialize: function(){

			personasCollection = new Backbone.Collection();

			mediator.on('selectPersonaSet', this.selectPersonaSet, this);
			mediator.on('filterPersonas', this.filterPersonas, this);

			this.listenTo(personasCollection, 'reset', this.render);

		},

		events: {
			'click a': 'selectPersona'
		},

		selectPersonaSet: function(personaSet){
			personasCollection.reset(personaSet);
		},

		filterPersonas: function(filterValue){
			this.filterValue = filterValue;
			this.render();
		},

		selectPersona: function(e){
			e.preventDefault();
			var peso_id = $(e.currentTarget).data('peso_id');
			var model = personasCollection.findWhere({peso_id: peso_id}); //why doesn't getting this by ID work ex: personasCollection.get(peso_id)?
			var checked = model.get('checked');
			var modelStatus = model.get('checked') ? model.unset('checked') : model.set('checked', true);
			
			mediator.trigger('updateProjectPersona', peso_id, checked);
			this.render();
		},

		setFilterValue: function(filterValue){
			this.filterValue = filterValue;
			this.render();
		},

		render: function(){

			var personas = personasCollection.toJSON();
			var regex = new RegExp(this.filterValue, 'gi');

			if(this.filterValue){
				personas = _.filter(personas, function(persona){
					return regex.test(persona.peso_title);
				});
			}

			personas = _.sortBy(personas, function(persona){
				return persona.checked;
			});

			this.$el.html(personasTemplate(personas));
			this.delegateEvents();
			return this;
		}


	});

});
