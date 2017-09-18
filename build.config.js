module.exports = {
	phonegapServePort: 3131,
	phonegapDirectory: 'phonegap-app',
	sourceDirectory: 'quickcommerce/app/src',
	buildDirectory: 'upload/pos',
	//buildDirectory: 'quickcommerce/app/build',
	//buildDirectory: 'upload/catalog/view/javascript/quickcommerce',
	libDirectory: 'quickcommerce/app/lib',
	themeSourceDirectory: 'quickcommerce/theme/src',
	themeBuildDirectory: 'upload/catalog/view/theme/quickcommerce',
    // TODO: Support for specific themes only
    themes: [
        'default',
        'journal2',
        'quickcommerce'
    ],
    cssIncludes: [
        // OpenCart CSS files for themes
        //'catalog/view/theme/**/stylesheet/*.css',
        //'catalog/view/theme/**/stylesheet/**/*.css',
        'phonegap-app/www/theme/default/stylesheet/*.css', // TODO: GROSS!
        'quickcommerce/app/lib/opencart/javascript/bootstrap/css/bootstrap.min.css', // TODO: GROSS!
        'quickcommerce/app/lib/opencart/javascript/fontawesome/css/fontawesome.min.css', // TODO: GROSS!
        'quickcommerce/app/lib/css/qc.css' // TODO: GROSS!
    ],
    jsIncludes: [
        // OpenCart JavaScript files
        //'catalog/view/javascript/**/*.js',
        //'catalog/view/javascript/**/**/*.js'
        'quickcommerce/app/lib/opencart/javascript/jquery/jquery-2.1.1.min.js' // TODO: GROSS!
    ],
	app: {
		namespace: 'com.firebrand.quickcommerce.pos',
		version: '0.0.1',
		name: 'ReactJS-Phonegap App',
		description: 'A boilerplate ReactJS-Phonegap App!',
		author: {
			name: 'Lucas Michael Lopatka',
			website: 'https://firebrandwebsolutions.com',
			email: 'lucas@firebrandwebsolutions.com'
		},
		accessOrigin: '*',
		orientation: 'all', //all: default means both landscape and portrait are enabled
		targetDevice: 'universal', //handset, tablet, or universal
		exitOnSuspend: 'true', //ios: if set to true, app will terminate when home button is pressed
		phonegapPlugins: [
			{
				name: 'org.apache.cordova.core.device',
				installFrom: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git',
				version: null
			},
			{
				name: 'org.apache.cordova.core.dialogs',
				installFrom: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs',
				version: null
			},
			/*{
				name: 'org.apache.cordova.geolocation',
				installFrom: 'org.apache.cordova.geolocation',
				version: null
			},*/
			{
				name: 'org.apache.cordova.core.vibration',
				installFrom: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git',
				version: null
			},
			{
				name: 'org.apache.cordova.statusbar',
				installFrom: 'org.apache.cordova.statusbar',
				version: null
			},
			{
				name: 'com.phonegap.plugins.pushplugin',
				installFrom: 'https://github.com/phonegap-build/PushPlugin.git',
				version: '2.1.1'
			},
			{
				name: 'org.apache.cordova.core.inappbrowser',
				installFrom: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git',
				version: null
			},
			{
				name: 'org.apache.cordova.statusbar',
				installFrom: 'org.apache.cordova.statusbar',
				version: null
			},
			{
				name: 'org.apache.cordova.splashscreen',
				installFrom: 'org.apache.cordova.splashscreen',
				version: null
			},
			{
				name: 'it.mobimentum.phonegapspinnerplugin',
				installFrom: 'https://github.com/mobimentum/phonegap-plugin-loading-spinner.git',
				version: null
			}
		]
	}

}
