// This is the first JS file included in the application.
require.config({
	map: {
		'*': {
			// Add the global `var bypassCss = true` to any context
			// (browser window or Node) to prevent CSS from loading.

			// This is useful for unit testing, without styling.
			css: typeof bypassCss !== 'undefined' ? 'utilities/bypassCss' : 'require-css/css'
		}
	}
});