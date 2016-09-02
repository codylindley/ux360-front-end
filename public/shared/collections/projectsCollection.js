define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var Model = require('models/projectModel');

	return Backbone.Collection.extend({

		model: Model,

		url: function(){
			return buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'findAllProjects',
				serviceParameters: {
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
