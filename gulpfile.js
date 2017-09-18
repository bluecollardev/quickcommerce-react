// Not getting anywhere without these libs, 
// pretty much the point of a task runner tbh
var path = require('path');
var fs = require('fs');

// Gulp libraries & utils
var gulp = require('gulp');
var react = require('gulp-babel'); // For Grunt processing of JSX
var less = require('gulp-less');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var runSequence = require('gulp-run-sequence');
var jsValidate = require('gulp-jsvalidate');
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var replace = require('gulp-replace');
var rename = require('gulp-rename');

// Misc utils
var merge = require('merge-stream');

// Packagers
var babelify   = require('babelify');
var browserify = require('browserify');
var webpack = require('webpack');

// Config files
var config = require('./build.config.js');
var webpackConfig = require('./webpack.config.js');

// Project vars
var PHONEGAP_DIR = './' + config.phonegapDirectory;
var PHONEGAP_DEV_PORT = config.phonegapServePort;

var APP_DIR = './' + config.sourceDirectory;
var BUILD_DIR = './' + config.buildDirectory;
var LIB_DIR = './' + config.libDirectory;
var THEME_SOURCE_DIR = './' + config.themeSourceDirectory;
var THEME_BUILD_DIR = './' + config.themeBuildDirectory;

/**
 * Watch project directories for changes
 */
gulp.task('default', function() {
	gulp.watch([
		APP_DIR + '/js/**/*.jsx', // Watch for JSX/ES6 source changes in JS dir
		APP_DIR + '/js/**/*.js', // Watch for JS/ES5 source changes in JS dir
		APP_DIR + '/less/*.less', // Watch for changes in LESS dir
		APP_DIR + '/scss/*.scss' // Watch for changes in SCSS dir
		], ['build']);
});

gulp.task('build', function(cb) {
	runSequence(
		'build-app', 
		'build-template',
		cb);
});

gulp.task('build-app', function(cb) {
	runSequence(
		'clean-build', 
		'webpackify',
        'compile-less', 
		'concat-css',
		'copy-index',
		'fonts',
		cb);
});

gulp.task('build-template', function(cb) {
	runSequence(
		'clean-theme', 
		'copy-theme',
        'bundle-react',
		'compile-theme-sass',
		'fonts',
		cb);
});

gulp.task('build-phonegap', function(cb) {
	runSequence(
		'clean-build', 
		'webpackify', 
		//'compile-less', 
		//'compile-sass', 
		//'concat-css', 
		//'fonts', 
		//'copy-index',
		//'copy-resources',
		//'copy-config-xml',
		cb);
});

gulp.task('clean-build', function() {
	return gulp.src(BUILD_DIR, {read: false})
	.pipe(clean());
});

gulp.task('webpackify', function(cb) { 
	webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack', err);
		console.log('[webpack]', stats.toString({
            // output options
          }));
		cb();
	});
});


gulp.task('compile-less', function() {
	return gulp.src(APP_DIR + '/less/**/*.less')
	.pipe(plumber())
    //.pipe(flatten())
    .pipe(less({paths: BUILD_DIR + '/css/'}))
    .pipe(concat('lessed.css'))
    
    .pipe(gulp.dest(BUILD_DIR + '/css/'));
});

gulp.task('compile-sass', function() {
	//return gulp.src(APP_DIR + '/scss/fbwd-theme.scss')
	return gulp.src(APP_DIR + '/scss/**/*.scss')
	.pipe(plumber())
    //.pipe(flatten())
    .pipe(sass())
    .pipe(concat('sassed.css'))
    
    .pipe(gulp.dest(BUILD_DIR + '/css/'));
});

gulp.task('compile-theme-sass', function() {
	return gulp.src(THEME_SOURCE_DIR + '/scss/fbwd-theme.scss')
	.pipe(plumber())
    //.pipe(flatten())
    .pipe(sass())
    .pipe(concat('fbwd-theme-sassed.css'))
    
    .pipe(gulp.dest(THEME_BUILD_DIR + '/css/'));
});

gulp.task('concat-css', function() {
    var sources = config.cssIncludes;
    return gulp.src([
            //APP_DIR + '/bower/normalize-css/normalize.css',
            //APP_DIR + '/bower/snapjs/snap.css',
            //APP_DIR + '/bower/topcoat/css/topcoat-mobile-dark.css',
            //APP_DIR + '/bower/topcoat-icons/css/icomatic.css',
            BUILD_DIR + '/css/sassed.css',
            BUILD_DIR + '/css/lessed.css'
		].concat(sources))
	.pipe(plumber())
	.pipe(concat('bundle.css'))
	//.pipe(gulp.dest(PHONEGAP_DIR + '/www/css/')); // TODO: Fx to copy to PhoneGap dirs
	.pipe(gulp.dest(BUILD_DIR + '/css/')); // TODO: Fx to copy to PhoneGap dirs
});

gulp.task('fonts', function() {
	return gulp.src([
		//APP_DIR + '/bower/topcoat-icons/fonts/*'
		APP_DIR + '/fonts/*'
		])
	.pipe(gulp.dest(BUILD_DIR + '/fonts/'));
});

gulp.task('bundle-react', function() {
    return gulp.src([
            LIB_DIR + '/react/react.min.js',
            LIB_DIR + '/react-dom/react-dom.min.js'
		])
	.pipe(concat('react-bundle.js'))
	.pipe(gulp.dest(BUILD_DIR + '/js/'));
});

gulp.task('bundle-js', function() {
	var sources = config.jsIncludes;
    return gulp.src([
            //APP_DIR + '/bower/jquery/dist/jquery.min.js',
            //APP_DIR + '/bower/snapjs/snap.min.js',
            //APP_DIR + '/bower/iscroll/build/iscroll.js',
            //APP_DIR + '/build/index.js'
		].concat(sources))
	.pipe(concat('bower-bundle.js'))
	.pipe(gulp.dest(BUILD_DIR + '/js/'));
});


gulp.task('bundle-scripts', function(cb) {
	runSequence(
		'bundle-react',
		'bundle-js',
		cb);
});

gulp.task('copy-index', function() {
	return gulp.src(APP_DIR + '/index.html')
	.pipe(gulp.dest(PHONEGAP_DIR + '/www/'));
});

gulp.task('copy-resources', function() {
	return gulp.src(APP_DIR + '/res/**/*.png')
	.pipe(gulp.dest(PHONEGAP_DIR + '/www/res/'));
});

// TODO: Install theme?
gulp.task('copy-theme', function() {
	return gulp.src(THEME_SOURCE_DIR + '/**/*', { base: THEME_SOURCE_DIR } )
	.pipe(gulp.dest(THEME_BUILD_DIR));
});

gulp.task('clean-theme', function() {
	return gulp.src(THEME_BUILD_DIR, {read: false, force: true}) // Target dir is outside CWD, use force option
	.pipe(clean());
});

gulp.task('notify-me', function() {
	return gulp.src(APP_DIR + '/index.html')
	.pipe(notify({title: 'DONE', message: 'build-app complete!'}));
});

gulp.task('create', function(cb){
	runSequence('clean-app', 'create-app', 'install-plugins', cb);
});

gulp.task('clean-app', function() {
	return gulp.src(PHONEGAP_DIR, {read: false})
	.pipe(clean());
});

gulp.task('create-app', shell.task([
	'phonegap create ' + PHONEGAP_DIR
	]));

gulp.task('install-plugins', shell.task(getPhonegapPluginCommands(), {
	cwd: PHONEGAP_DIR
}));

gulp.task('serve', shell.task([
	'phonegap serve --port=' + PHONEGAP_DEV_PORT
	], {
		cwd: PHONEGAP_DIR
	}));

gulp.task('copy-config-xml', function() {
	return gulp.src(APP_DIR + '/src/config.xml')
	.pipe(replace(/{NAMESPACE}/g, config.app.namespace))
	.pipe(replace(/{VERSION}/g, config.app.version))
	.pipe(replace(/{APP_NAME}/g, config.app.name))
	.pipe(replace(/{APP_DESCRIPTION}/g, config.app.description))
	.pipe(replace(/{AUTHOR_WEBISTE}/g, config.app.author.website))
	.pipe(replace(/{AUTHOR_EMAIL}/g, config.app.author.email))
	.pipe(replace(/{AUTHOR_NAME}/g, config.app.author.name))
	.pipe(replace(/{PLUGINS}/g, getPluginsXML()))
	.pipe(replace(/{ICONS}/g, getIconsXML()))
	.pipe(replace(/{SPLASHSCREENS}/g, getSplashscreenXML()))
	.pipe(replace(/{ACCESS_ORIGIN}/g, config.app.accessOrigin))
	.pipe(replace(/{ORIENTATION}/g, config.app.orientation))
	.pipe(replace(/{TARGET_DEVICE}/g, config.app.targetDevice))
	.pipe(replace(/{EXIT_ON_SUSPEND}/g, config.app.exitOnSuspend))
	.pipe(gulp.dest(PHONEGAP_DIR + '/www/'));
});

function getPhonegapPluginCommands() {
	var commands = [];
	for(var i = 0; i < config.app.phonegapPlugins.length; i++){
		var p = config.app.phonegapPlugins[i];
		var pvars = p.vars;
		if (pvars) {
			var varstring = "";
			for (var j = 0; j < pvars.length; j++) {
				varstring += " --variable " + pvars[j];
			}
			commands.push('phonegap plugin add ' + p.installFrom + varstring);
		} else {
			commands.push('phonegap plugin add ' + p.installFrom);
		}
	}
	return commands;
}



function getPluginsXML() {
	var xml = '';
	for(var i = 0; i < config.app.phonegapPlugins.length; i++){
		var p = config.app.phonegapPlugins[i];
		var pluginXml = '<gap:plugin name="' + p.name + '"';
		if( !!p.version ){
			pluginXml += ' version="' + p.version + '"';
		}
		pluginXml += '/>' + "\n";
		xml += pluginXml;		
	}
	return xml;
}

function getIconsXML() {
	var xml = '';
	for(var i = 0; i < config.app.icons.length; i++){
		var e = config.app.icons[i];
		var eXml = '<icon src="' + e.src + '"';
		if( !!e.platform ){
			eXml += ' platform="' + e.platform + '"';
		}
		if( !!e.width ){
			eXml += ' width="' + e.width + '"';
		}
		if( !!e.height ){
			eXml += ' height="' + e.height + '"';
		}
		if( !!e.density ){
			eXml += ' density="' + e.density + '"';
		}
		eXml += '/>' + "\n";
		xml += eXml;
	}
	return xml;
}

function getSplashscreenXML() {
	var xml = '';
	for(var i = 0; i < config.app.splashscreens.length; i++){
		var e = config.app.splashscreens[i];
		var eXml = '<gap:splash src="' + e.src + '"';
		if( !!e.platform ){
			eXml += ' gap:platform="' + e.platform + '"';
		}
		if( !!e.width ){
			eXml += ' width="' + e.width + '"';
		}
		if( !!e.height ){
			eXml += ' height="' + e.height + '"';
		}
		eXml += '/>' + "\n";
		xml += eXml;
	}
	return xml;
}