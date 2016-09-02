define(function (require) {

	'use strict';

	// dependencies
	var $ = require('jquery');
	var _ = require('underscore');
	var BaseView = require('backboneBaseObjects/baseView');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var mediator = require('utilities/mediator');

	var apiListTemplate = require('html!./apiListTemplate');

	return BaseView.extend({

		className: 'apiList',

		events: {
			'click button': 'generateUrl',
			'click a': 'clickMethod'
		},

		clickMethod: function(e){
			e.preventDefault();
			this.$('.api-list a.selected').removeClass('selected');
			$(e.currentTarget).addClass('selected');
			mediator.trigger('navigate',e.currentTarget.getAttribute('href'));
		},

		initialize: function(){

			var view = this;
			var api = this.api = [];

			$.get('/uxm-plugin/axis', function(html){

				$(html).find('a').each(function( i, a ){
					api.push({
						name: a.href.split('Plugin_uxm_')[1].split('?')[0],
						href: a.href
					});
				});

				var index = 0;
				var counter = api.length;

				_.each(api, function(service){
					$.ajax({
						url: service.href,
						dataType: 'text'
					}).done(function(xml){

						xml = xml.replace(/wsdl:/g, '');
						xml = xml.replace(/wsdlsoap:/g, '');

						var xmlDoc = $.parseXML( xml );
						var $xml = $( xmlDoc );

						var methods = [];

						$xml.find('operation:not(:has(operation))').each(function(){

							var el = $(this);
							var name = el.attr('name');
							var parameterOrder = el.attr('parameterOrder');
							parameterOrder = parameterOrder ? parameterOrder.split(' ') : [];

							if(name){
								methods.push({
									id: service.name + '/' + name,
									name: name,
									parameterOrder: _.map(parameterOrder, function(name){
										var value = '';
										if(name === 'groupId'){
											value = session.groupId;
										}
										if(name === 'userId'){
											value = session.userId;
										}
										return {
											name: name,
											value: value
										};
									})
								});
								index++;
							}

						});

						service.methods = methods;

						counter--;

						if(!counter){

							view.render();

						}

					});
				});

			});


		},

		generateUrl: function(e){

			var container = $(e.currentTarget).closest('.method');

			var serviceParameters = {};

			container.find('.serviceParameter').each(function(){
				serviceParameters[this.name] = this.value;
			});

			var serviceClassName = $.trim(container.find('.serviceClassName').text());
			var serviceMethodName = $.trim(container.find('.serviceMethodName').text());

			var params = {
				serviceClassName: serviceClassName,
				serviceMethodName: serviceMethodName,
				serviceParameters: serviceParameters
			};

			var url = buildURL(params);

			container.find('.url').html('<a href="'+url+'" target="_blank">'+location.origin+url+'</a>');

			if(serviceParameters.groupId){
				serviceParameters.groupId = 'session.groupId';
			}

			if(serviceParameters.userId){
				serviceParameters.userId = 'session.userId';
			}

			// convert params object into pretty, tab formatted string
			var pre = JSON.stringify(params, null, '\t');
			// replace double quotes w/single quotes
			pre = pre.replace(/"/g, "'");
			// unquote object keys (beginning)
			pre = pre.replace(/\t'/g, '\t');
			// unquote object keys (trailing)
			pre = pre.replace(/':/g, ':');
			// unquote session.userId
			pre = pre.replace(/'session.userId'/g, 'session.userId');
			// unquote session.groupId
			pre = pre.replace(/'session.groupId'/g, 'session.groupId');

			container.find('.pre').html('<b>API Options Config:</b><pre>'+pre+';</pre>');

		},

		render: function(){
			this.$el.html(apiListTemplate(this.api));
			return this;
		}
	});

});


