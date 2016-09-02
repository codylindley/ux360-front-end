#UX360

Client side code for the UX360 application as well as a NodeJS server for local development.

## Setup

### Local Prerequisites to install on your system:

- [Git](http://git-scm.com)
- [Node](http://nodejs.org) & [npm](https://npmjs.org/) (npm is install with node, use installer from [http://nodejs.org/](http://nodejs.org/))

####Local NPM Prerequisite packages to install globally (e.g. `-g`) on your system:

- [Bower](http://bower.io) `$ sudo npm install -g bower`
- [Grunt](http://gruntjs.com) `$ sudo npm install -g grunt-cli`


### Installation (after you have installed prerequisites)

```
# clone the source code
$ git clone https://github.com/TandemSeven/UX360-Front-End

# install npm and bower dependencies
$ cd path to cloned source here
$ npm install
$ bower install

# run the grunt build
$ grunt

# start the server
$ node server.js
```
application runs at http://localhost:8080 (but there is no default route because the default page in the application is in the old code base. To run a route, look in route.js for a route, e.g. [http://localhost:8080#objects](http://localhost:8080#objects)). Pointing a browser to http://localhost:8080 won't run any route in the app for now.

## User Credentials & Servers

local dev = [http://wwwlocalhost:8080/#objects](http://wwwlocalhost:8080/#objects) (note you have to give it a url hash route)

staging = [http://personamodeler.com:8082](http://personamodeler.com:8082)

production = [http://ux360.com/](http://ux360.com/)

Note: staging and production require more paths in the url to resolve hash route. Locally you just use a #hash route from the domain (e.g. `http://wwwlocalhost:8080/#objects`). In staging and production you have to use an added path (e.g. `http://personamodeler.com:8082/group/beta1/ux-modeling#objects/Personaset`)

The credentials for local development, http://ux360.com, and http://personamodeler.com:8082 need to be setup by [Sultan Kan](mailto:szkhan@tandemseven.com).


## Monitoring NPM & Bower Dependencies (via gemnasium.com).

[![Dependency Status](https://gemnasium.com/81fc35572fd2013514ed8cf3127e24de.svg)](https://gemnasium.com/TandemSeven/UX360-Front-End)

[https://gemnasium.com/TandemSeven/UX360-Front-End](https://gemnasium.com/TandemSeven/UX360-Front-End)

login: clindley@tandemseven.com

password: tandemseven

In general we shouldn't globally update bower or npm. Check gemnasium, find an update you'd like to make. Update a single module. Verify any regressions. Repeat. Eventually we should run functional tests every time we update a package. If you update a package you had better be sure it didn't break the app in the supported browsers.

## Back-end API

- MUST BE LOGGED IN! JSON API Documents: [http://localhost:8081/#admin/api](http://localhost:8081/#admin/api)

## Browser & OS Support Matrix

- IE8+ (windows 7+)
- Chrome Latest (windows 7+, OSX ?)
- Safari Latest (windows 7+, OSX ?)
- Firefox Latest (windows 7+, OSX ?)
- Opera Latest (windows 7+, OSX ?)

## Technology Overview

* Local Development & Front-end Technology Stack
	* [JavaScript](http://es5.github.io/)/[Node](http://nodejs.org/)

* Local Server
	* [connect](http://www.senchalabs.org/connect/)

* Package Managers (Note: Make sure you understand [semantic versioner](https://github.com/isaacs/node-semver/) used by npm and bower)
	* [npm](https://npmjs.org/)
	* [bower](http://bower.io/)

* Task Runner / Build Tool
	* [gruntjs](http://gruntjs.com/)
	* [git hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) `> grunt precommit` RUNS ON COMMIT!

* Module Dependency Manager & Optimizer
	* [require.js](http://requirejs.org/) (used in development)
	* [r.js](http://requirejs.org/docs/optimization.html) (used in production)
	* [requirejs-handlerbars](https://github.com/jfparadis/requirejs-handlebars)

* Templates
	* [Handlers](http://handlebarsjs.com/)

* Application Structure
	* [Backbone Models, Collections, & Views](http://backbonejs.org/)
	* [Backbone Events](http://backbonejs.org/#Events)
	* [Backbone Router](http://backbonejs.org/#Router)
	* lodash (note: it's called underscore.js but its actually lodash, `underscore: 'bower_components/lodash/dist/lodash'`)

* Quality Control
	* [hintjs](http://www.jshint.com/) (jshintrc & jshintrcComments)
	* [csslint](http://csslint.net/) (csslintrc)
	* [htmlhint](http://htmlhint.com/) (htmlhintrc)
	* [.editorConfig](http://editorconfig.org/)

* Local Unit Testing
	* None, we favor Functional/Integration tests.

* Code Complexity Analysis
	* [complexityReport.js](http://jscomplexity.org/) and [plato](http://es-analysis.github.io/plato/examples/jquery/)

* Code Coverage
	* ??? [Coveralls](https://coveralls.io/)

* Dependency Monitor
	* [https://gemnasium.com/TandemSeven/UX360-Front-End](https://gemnasium.com/TandemSeven/UX360-Front-End)

* Cloud/Hosted Continuous Integration
	* None ??? [Travis-CI](http://travis-ci.com/) or [wercker](http://wercker.com/) or [codeship.io](https://www.codeship.io/) or [circleci](https://circleci.com/about) or [semaphore](https://semaphoreapp.com)

* Functional/Integration Testing
	* [browserstack](https://www.browserstack.com/automate/node) & [nightwatchjs.org](http://nightwatchjs.org/)


## src mode & build mode

***Overview:*** UX360 is comprised of modules written in AMD format and uses RequireJS (in [sugar](http://requirejs.org/docs/whyamd.html#sugar) format) for module loading and dependency management. r.js from require.js is used via grunt to combine and compress these files into an optimized format for deployment in production.

***Build Mode:*** By default the application runs in build mode from from ```ux360.min.css``` and ```ux360.min.js```.

***SRC Mode:*** While developing, it is best to run the application using the un-optimized source code located in ```public``` (i.e. ```ux360.js``` loaded by ```requireConfig.js``` which then loads modules individually).

The mode is stored in localStorage ```localStorage.isSrc = boolean```

*Note*: kendo UI and bootstrap CSS files are pulled in from CDN's when possible on the index.html page. Currently I don't have coded a back up if the CDN goes down.

## Development Notes

### Writing Code

* Any chance to remove complexity do it. Resist adding any abstracted code until its absolutely necessary and you completely understand what its doing.
* Comment code. Do it. Comment all methods/function. Comment patterns. Comment!
* Use the event hub (i.e. mediator.js) to communicate between modules. Don't tightly coupled a view region to another view region creating a hard dependency.

### Application Startup

* The index.html file in src mode uses one script tag to include require.js. Once it's loaded the dependencies defined in index.html (i.e. `var require = ['requireConfig', 'ux360Start'];` are loaded. The ux360Start.js file contains the logic to start (i.e. backbone router is started) the application.
* The ux360Start.js file creates an `Backbone.Router` instance from the router.js module. It's the router that will setup routes that kick off layout views and thus kickoff region views. After this is the event meditator or route the renders and removes view regions.
* The ux360Start.js module requires in an ajaxSetup.js, which provides the default and global setting for jQuery xhr requests.
* The app provides a ux360 namespace in the browser global scope (i.e. ```ux360```) that contains a session, router, and mediator property. These should be required into the scope when you need something from them.

### Application Structure

* Carefully place shared resources (i.e. utilities etc..) in the shared directory in the logical folder. Try not to pre-optimize by adding stuff in shared that is not yet shared.
* All models and collections go in the `shared/models` or `shared/collections`. Models and Collections do not go into the ui folder! Given our data API (non-restful) the use of a Model or Collection is optional and if used can overly complicate the code because of our API. Thus, in most of the app using a model or collection has been avoided and a simple jQuery xhr request is used logically in `render()` methods. In the future we'd like to move to a MVVM pattern (or react.js) setup in the initialize function for each region view.
* The ui folder contains layout views, regions views, html templates, and css. Its possible that a view could be found in `shared/views`.
* Any handlebars helpers go in `shared/handlebarsHelpers`

### Application Architecture (i.e. How we use Backbone)

* All backbone view's (yes, both layout and region views) inherit from a baseView.js view, which is an extended `Backbone.View constructorr` (found in `shared/backboneBaseObjects`). In the app, views are either layouts or regions. A region then, is a isolated and logical region of the UI that should be decoupled from other parts of the UI. If it helps think of regions similar to UI widgets, except a region can be any UI part that is a logical grouping of encapsulated UI logic. A layout view is used to layout regions. It's important that we denote a layout view from a region view and we do so by placing the words layout in the naming of a layout view file. If a view is not a layout it's assume to be a region view and will include the word "view" in it's name. When constructing region views, each view should be an isolated module that can be rendered at any time and talks to other views using the global event system (i.e. `utilities/mediator.js`).

example:
```
.
├── createObjectBtn
│   ├── createObjectBtnStyle.css
│   ├── createObjectBtnTemplate.html
│   └── createObjectBtnView.js
├── createObjectModal
│   ├── createObjectModalStyle.css
│   ├── createObjectModalTemplate.html
│   └── createObjectModalView.js
├── objectAssociations
│   ├── objectAssociationsTemplate.html
│   ├── objectAssociationsView.js
│   └── objectAssociationsViewStyle.css
├── objectAttributes
│   ├── objectAttsTemplate.html
│   ├── objectAttsView.js
│   ├── objectAttsViewStyle.css
│   ├── objectAttsViewUnitTest.js
│   └── verifyDeleteTemplate.html
├── objectAttsLock
│   ├── objectAttsLockTemplate.html
│   ├── objectAttsLockView.js
│   └── objectAttsLockViewStyle.css
├── objectAttsStockPhotoModal
│   ├── objectAttsStockPhotoModalTemplate.html
│   ├── objectAttsStockPhotoModalView.js
│   └── objectAttsStockPhotoModalViewStyle.css
├── objectTypeList
│   ├── objectTypeListStyle.css
│   ├── objectTypeListTemplate.html
│   ├── objectTypeListView.js
│   ├── objectTypeListViewUnitTest.js
│   └── verifyDeleteTemplate.html
├── objectsBreadCrumb
│   ├── objectsBreadCrumbStyle.css
│   ├── objectsBreadCrumbTemplate.html
│   └── objectsBreadCrumbView.js
├── objectsLayoutTemplate.html
├── objectsLayoutView.js
└── objectsMenu
    ├── objectsMenuStyle.css
    ├── objectsMenuTemplate.html
    └── objectsMenuView.js
```


### CSS

* Global styles are currently derived from bootstrap 3 (managed by bower) and our own boostrapOverrides.css file found in `shared/styles/boostrapOverrides.css`. We don't alter thirdparty code pulled in from bower so any changes to bootstrap go in the overrides files.
* The ux360BaseCSS.js module is used to include all global styles sheets. 

e.g. 

```
define(function (require) {

	'use strict';

	require('css!nprogress');
	require('css!shared/styles/bootstrapOverrides');

	return;

});
```
* As previously mentioned you will *not* need to require in Bootstrap CSS, Kendo UI CSS, or anything required in ux360BaseCSS.js as this is being done globally in index.html.
* The app uses the [kendo UI bootstrap theme](http://demos.telerik.com/kendo-ui/bootstrap/).

### Require.js/AMD modules

* Make sure you open the requireConfig.js file and become aware of the shims and paths (i.e. name shortcuts when requiring in modules/dependencies). Don't alter shorcuts unless you are willing to update all references to a shortcut.
* If you need something in a module, require it in. Avoid going to the global window scope to access something, regardless of if a reference to what you need (i.e. _ or Backbone found in the global scope) is in the global scope.
* No generic global values are used in the application. If something is used by a lot of modules, create a module (e.g. utilities/sessions.js), place it in the shared directory in logical folder, and pull it into any module that needs it.
* All communication between modules should be handled by events. Either the module contains an object that can listen or broadcast events or you must setup listening and broadcasting using a mediator (i.e. mediator.js, which is really just an object (i.e. meditator.js) extended from Backbone.Events).

### UI Widgets & Widget Plug-ins:

####Widget Tools 

We use [bootstrap JavaScript](http://getbootstrap.com/javascript/) JavaScript and [kendo UI](http://www.telerik.com/kendo-ui-web) widgets in this application in addition to bootstrap & jQuery plugins when needed. However, bootstrap and kendo UI are currently the pool of solutions we'd like to pull from. These should be exhausted before you get a plug-in and a plug-in requiring anything more than bootstrap or jQuery should in general be avoid.

Note: The JS for [kendo UI](http://www.telerik.com/kendo-ui-web) widget is not included by default. You will need to require in what you need in each region view because we use the AMD version of kendo UI. However Kendo UI CSS is always available and included for you. All of Boostrap (both CSS & JS) is included no need to require in [bootstrap JavaScript](http://getbootstrap.com/javascript/). When using Bootstrap JS, leverage the markup API (i.e. declarative/Attribute Instantiation) before using JS api for instantiation.

The login for getting updates for kendo UI is:

site: telerik.com
username: swyman@tandemseven.com
password: tandemseven

####jQuery plugins & bootstrap plugins

Note: The CSS, for a plug-in can be included globally in ```ux360BaseCSS.js``` if the plugin can be re-used in other parts of the applications. But it's more common that the CSS for a plug-in will be placed in the CSS file for a view region. Installing jQuery or bootstrap plugins requires changes to the `requireConfig.js` file so you can require in the JS code into your region module. Read the comments in this file very carefully and add your plugins in the correct place (AMD v.s. Non-AMD).

Here is a list of some bootstrap and jQuery plugins we are using in the app:

* [Autogrow Textarea Plugin](https://github.com/jevin/Autogrow-Textarea)
* [jQuery Mask Plugin](https://github.com/igorescobar/jQuery-Mask-Plugin)
* [PowerTip](http://stevenbenner.github.io/jquery-powertip/)
* [jquery.alphanum](https://github.com/KevinSheedy/jquery.alphanum)
* [jquery.cookie](https://github.com/carhartl/jquery-cookie)
* [jquery.maxlength](http://pioul.fr/jquery-maxlength)
* [bootstrap-growl](https://github.com/ifightcrime/bootstrap-growl)
* [nprogress](http://ricostacruz.com/nprogress/)
* [Ladda (i.e. visual loader built into bootstrap buttons) UI for Bootstrap 3](http://msurguy.github.io/ladda-bootstrap/)
* [jquery-timer](https://github.com/jchavannes/jquery-timer)
* [Bootstrap Switch](http://www.bootstrap-switch.org/)
* [bootstrap-modal](https://github.com/jschr/bootstrap-modal)
* [jQuery.AjaxFileUpload.js](https://github.com/jfeldstein/jQuery.AjaxFileUpload.js.git)


### Building the app

* Grunt is used to run r.js (optimizer from require.js project) to combine and uglify all JavaScript modules (i.e ux360.min.js) as well as combine all css files (i.e. ux360.min.css) except for kendo UI and bootstrap CSS files which we pull from public CDN's. These two files are used in production (i.e. non 'src mode' or what we call 'build mode')
* Grunt is used to minify the ux360.min.css after the r.js (optimizer from require.js project) combines all css files. This file, before we minify it is really just all of the css file's used by require.js combined into a single file.
* html is pre-compiled by handlerbars. In a sense, its minified by handlebars
* uglify, is removing any `console.log()` or `log()`. If you need to disable this feature open the grunt.js and adjust the options for uglify.

### Testing Notes

An example of using nightwatch.js with http://www.browserstack.com/ for automated functional/integration tests on [http://personamodeler.com:8082](http://personamodeler.com:8082) can be examined by running:

```nightwatch --group ux360 -e ie11,ie10,ie9,ie8```

### Code Complexity

* Go to [http://localhost:8081/codeComplexityReport](http://localhost:8081/codeComplexityReport)

###JavaScript Error Reporting

We are using [https://errorception.com/](https://errorception.com/) for JS error reporting on personamodeler.com and ux360.com (note: we are not reporting errors on localhost). I'd suggest moving to [https://getsentry.com/welcome/](https://getsentry.com/welcome/) when we want more from this type of a service.

We have an account at errorception.com and getsentry.com both using the following credentials.

login: clindley@tandemseven.com

password: tandemseven

You should add your email address to the account being used so you can get an email detailing JS errors found.

### Bugs

- Bugs & Features: [https://github.com/TandemSeven/UX360-Issues/issues](https://github.com/TandemSeven/UX360-Issues/issues?milestone=7&state=open)

