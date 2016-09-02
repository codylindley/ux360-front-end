define(function (require) {

	require('css!bower_components/nprogress/nprogress');
	require('css!shared/styles/bootstrapOverrides');

	//has to come after overrides, which contains https://raw.github.com/jschr/bootstrap-modal/master/css/bootstrap-modal-bs3patch.css
	require('css!bower_components/bootstrap-modal/css/bootstrap-modal');
	
	require('css!bower_components/ladda-bootstrap/dist/ladda-themeless');
	require('css!bower_components/bootstrap-switch/build/css/bootstrap3/bootstrap-switch');
	require('css!bower_components/jquery-ui/themes/base/theme');
	require('css!bower_components/jquery-ui/themes/base/resizable');
	require('css!bower_components/jquery-powertip/dist/css/jquery.powertip');

	return;

});


