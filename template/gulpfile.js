'use strict';

var gulp = require( 'gulp' ),
	del = require('del'),
	clean = require('gulp-clean'),
	prettify = require('gulp-prettify'),
	less = require( 'gulp-less' ),
	jade = require('gulp-jade'),
    useref = require('gulp-useref'),
    debug = require('gulp-debug'),
    merge = require('merge-stream'),
    gulpif = require( 'gulp-if'),
    log = require( 'fancy-log'),
    replace = require('gulp-replace'),
	wiredep = require('wiredep').stream;

// dist:clean
gulp.task( 'dist:clean', function () {
	return del( 'dist/**' , { force:true } );
} );
// 
gulp.task( 'dist:copy', function () {
	var streams = [];
	streams.push(
		gulp.src( './app/images/placeholders/**/*.*' )
			.pipe( gulp.dest( './dist/images' ) )
	);
	streams.push(
		gulp.src( './app/images/partners/*.*' )
			.pipe( gulp.dest( './dist/images/partners' ) )
	);
	streams.push(
		gulp.src( './app/images/*.*' )
			.pipe( gulp.dest( './dist/images' ) )
	);
	streams.push(
		gulp.src( './app/less/**/*.*' )
			.pipe( gulp.dest( './dist/less' ) )
	);
	streams.push(
		gulp.src( './app/jade/**/*.*' )
			.pipe( gulp.dest( './dist/jade' ) )
	);
	streams.push(
		gulp.src( './app/js/**/*.*' )
			.pipe( gulp.dest( './dist/js' ) )
	);
	streams.push(
		gulp.src( './app/email.php' )
			.pipe( gulp.dest( './dist' ) )
	);
	streams.push(
		gulp.src( [
				'./app/bower_components/bootstrap/fonts/*.*',
				'./app/bower_components/font-awesome/fonts/*.*',
				'./app/fonts/*.*',
			] )
			.pipe( gulp.dest( './dist/fonts' ) )
	);
	return merge( streams );
} );
// dist:less:replace-settings-include
gulp.task( 'dist:less:replace-settings-include', function () {
	return gulp.src( './dist/less/*.less' )
		.pipe( replace( '@import "settings.less";', '' ) )
		.pipe( gulp.dest( './dist/less' ) );
} );
// dist:less:replace-background-images
gulp.task( 'dist:less:replace-background-images', function () {
	return gulp.src( './dist/less/template/backgrounds.less' )
		.pipe( replace( /\/big-images\/\w{1,2}(.{4})/g, '/2250x1500.png' ) )
		.pipe( gulp.dest( './dist/less/template' ) );
} );
// dist:less:remove-settings-file
gulp.task( 'dist:less:remove-settings-file', function () {
	return del( './dist/less/settings.less' );
} );
// dist:less:generate-css
gulp.task( 'dist:less:generate-css', function () {
	return gulp.src( './dist/less/*.less' )
		.pipe( less() )
		.pipe( gulp.dest( './dist/css' ) );
} );
// dist:less
gulp.task( 'dist:less', gulp.series(
		'dist:less:replace-settings-include',
		'dist:less:replace-background-images',
		'dist:less:remove-settings-file',
		'dist:less:generate-css'
	), function () {} );
// dist:jade:replace-settings-include
gulp.task( 'dist:jade:replace-settings-include', function () {
	var streams = [];
	streams.push(
		gulp.src( './dist/jade/includes/scripts.jade' )
			.pipe( replace( 'script(type="text/javascript" src="js/settings.js")', '' ) )
			.pipe( gulp.dest( './dist/jade/includes' ) )
	);
	streams.push(
		gulp.src( './dist/jade/*.jade' )
			.pipe( replace( '<!-- Settings start -->', '' ) )
			.pipe( replace( 'include includes/settings.jade', '' ) )
			.pipe( replace( '<!-- Settings end -->', '' ) )
			.pipe( gulp.dest( './dist/jade' ) )
	);
	return merge( streams );
} );
// dist:jade:image-placeholders
gulp.task( 'dist:jade:image-placeholders', function () {
	return gulp.src( './dist/jade/**/*.jade' )
		.pipe( replace( /\/big-images\/\w{1,2}(.{4})/g, '/2250x1500.png' ) )
		.pipe( replace( /\/faces\/\w{1,2}(.{4})/g, '/700x700.png' ) )
		.pipe( gulp.dest( './dist/jade' ) );
} );
// dist:jade:remove-settings-file
gulp.task( 'dist:jade:remove-settings-file', function () {
	return del( './dist/jade/includes/settings.jade' );
} );
// dist:jade:generate-html
gulp.task( 'dist:jade:generate-html', function () {
	var YOUR_LOCALS = {};
	return gulp.src( './dist/jade/*.jade' )
		.pipe( jade( { locals: YOUR_LOCALS } ) )
		.pipe( prettify( { unformatted: [] } ) )
		.pipe( gulp.dest( './dist' ) );
} );
// dist:jade
gulp.task( 'dist:jade', gulp.series(
		'dist:jade:replace-settings-include',
		'dist:jade:image-placeholders',
		'dist:jade:remove-settings-file',
		'dist:jade:generate-html'
	), function () {} );
// dist:bower
gulp.task( 'dist:bower', function () {
	return gulp.src( './dist/*.html' )
		.pipe( wiredep( { directory: 'app/bower_components' } ) )
		.pipe( useref() )
		.pipe( gulp.dest( './dist' ) );
} );
// dist:remove-js-files
gulp.task( 'dist:remove-js-files', function () {
	var files = ['vendor.js','template.js','framework.js'],
		in_array = function ( value, array ) {
			for( let i = 0; i < array.length; i++ ) {
				if( value == array[i] ) {
					return true;
				}
			}
			return false;
		},
		check_file = function ( file ) {
			return ! in_array( file.path.split(/[\\/]/).pop(), files );
		};
	return gulp.src( './dist/js/*.js' )
		.pipe( gulpif( check_file, clean() ) );
} );
// dist:remove-less
gulp.task( 'dist:remove-less', function () {
	return del( './dist/less' );
} );
// dist:remove-jade
gulp.task( 'dist:remove-jade', function () {
	return del( './dist/jade' );
} );
// dist:intendation
gulp.task( 'dist:intendation', function () {
	return gulp.src( './dist/*.html' )
		.pipe( replace( '  ', '	' ) )
		.pipe( gulp.dest( './dist' ) );
} );
// dist
gulp.task( 'dist', gulp.series(
		'dist:clean',
		'dist:copy',
		'dist:less',
		'dist:jade',
		'dist:bower',
		'dist:remove-js-files',
		'dist:remove-less',
		'dist:remove-jade',
		'dist:intendation'
	), function () {} );