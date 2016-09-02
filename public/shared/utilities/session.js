define(function (require) {
	'use strict';

	var $ = require('jquery');
	require('cookie');

	var session = {
		load: function(){

			// When the upload <iframe> loads in ux360LayoutTemplate.html,
			// it posts a message that will trigger this event.

			// It contains session variables needed for uploading files to Liferay.

			$(window).on('message', function(e) {
				// And needed variables to the session object.
				session.MEDIA_URL = window.frames.upload.MEDIA_URL;
				session.ADDIMPORT_URL = window.frames.upload.ADDIMPORT_URL;
			});

			this.companyPath = $.cookie().companyPath;
			this.uploadURL = '/group' + (this.companyPath || '/development') + '/upload';
			this.sessionURL = '/group' + (this.companyPath || '/development')  + '/session';

			var data = {};

			if (window.IS_LIFERAY){
				var now = new Date();

				var now_utc = new Date(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate(),
					now.getUTCHours(),
					now.getUTCMinutes(),
					now.getUTCSeconds()
				);

				var UTCDateInMillis = now_utc.getTime();
				data.t = UTCDateInMillis;
				this.uploadURL += '?t=' + UTCDateInMillis;
			}

			// Fetch session data from Liferay.
			return $.ajax({
				dataType: 'json',
				url: this.sessionURL,
				data: data,
				cache: true,
				error: this.loadError,
				success: this.loadSuccess,
				progressBypass: true
			});
		},

		loadError: function(){
			// If mocha is in global, we are running unit tests so don't redirect.
			if (window.mocha) {
				return;
			}

			window.location = '/web/guest/login';
		},

		loadSuccess: function(response){
			_.extend(session, response);
			session.setNavigation();
		},

		setNavigation: function(route){
			this.navigation = [
				{ route: 'dashboard', text: 'Dashboard' },
				{ route: 'research/studies', text: 'Research' },
				/*{ route: 'personas', text: 'Personas' },
				{ route: 'object_hierarchy/tasks', text: 'Tasks & Scenarios' },*/
				{ route: 'ux-modeling#objects', text: 'UX Modeling' },
				{ route: 'ux360#projects', text: 'Projects' },
				{ route: 'files-media', text: 'Files / Media' }
			];

			if (this.isAdmin !== 'false' || this.isPortalAdmin){
				this.navigation.push({ route: 'admin/workgroup', text: 'Admin' });
			}

			_.each(this.navigation, function(item){
				item.className = item.route.match(route) ? 'current' : '';
			});
		}
	};

	return session;

// END: define.
});