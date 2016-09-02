var httpProxy = require('http-proxy');
var connect = require('connect');
var redirect = require('connect-redirection');
var proxy = new httpProxy.RoutingProxy();
var port = '8081';

connect.static.mime.define({
	'application/font-woff': ['woff']
});

connect()
	.use(connect.compress())
	.use(redirect())
	.use(connect.logger('dev'))
	.use(connect.static('public'))
	.use(function(req, res){

		// route all ux360 requests to /public
		if( req.url.indexOf('ux360') !== -1){
			res.redirect('/' + req.url.split('ux360')[1]);
			return;
		}

		// everything else get from liferay
		proxy.proxyRequest(req, res, {
			host: 'personamodeler.com',
			port: 8082
		});

	}).listen(port);

console.log('\nStatic file server running at http://localhost:' + port + '/\n\nCTRL + C to shutdown server');
