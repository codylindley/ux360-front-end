define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var buildURL = require('utilities/buildApiUrl');
	var session = require('utilities/session');

	return Backbone.Model.extend({

		idAttribute: 'prjt_id',

		url: function(){
			return buildURL({
				serviceClassName: 'alin_agileintegrationService',
				serviceMethodName: 'syncToVersionOne',
				serviceParameters: {
					prjt_id: this.id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
