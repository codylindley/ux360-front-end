define(function (require) {
	'use strict';

	var _ = require('underscore');
	var Backbone = require('backbone');

	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	return Backbone.Model.extend({

		idAttribute: 'uxme_id',

		'delete': function(){
			this.url = buildURL({
				serviceClassName: 'uxme_mediaService',
				serviceMethodName: 'deleteMedia',
				serviceParameters: {
					uxme_id: this.get('uxme_id'),
					groupId: session.groupId,
					userId: session.userId
				}
			});

			return this.fetch({ type: 'POST'} );
		}
	});
});