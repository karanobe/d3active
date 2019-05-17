const SETTINGS     = require('./gulp-settings.js')
const GULP         = require('gulp')
const SASS         = require('gulp-sass')
const CONCAT       = require('gulp-concat')
const UGLIFYCSS    = require('gulp-uglifycss')
const BABEL        = require('gulp-babel')
const NOTIFY       = require('gulp-notify')
const PLUMBER      = require('gulp-plumber')
const BROWSER_SYNC = require('browser-sync').create()
const SOURCEMAPS   = require('gulp-sourcemaps')
const POSTCSS      = require('gulp-postcss')
const AUTOPREFIXER = require('autoprefixer')
const CLEAN        = require('del')
const IMAGEMIN     = require('gulp-imagemin')
const WAIT         = require('gulp-wait')
const CACHE        = require('gulp-cache')
const posthtml = require('gulp-posthtml');
const sugarSrcset = require('posthtml-sugar-srcset')
const responsive = require('gulp-responsive');

function handleError(error) {
	console.log(SETTINGS)
	this.emit('end')
}

const POSTCSS_PLUGINS = [AUTOPREFIXER({ browsers: ['last 4 version', 'ie >= 10', 'Android 4'] })]

function server(done) {
	BROWSER_SYNC.init({
		server: {
			baseDir: './' + SETTINGS.dist.root,
			directory: true,
			reloadOnRestart: true
		},
		port: 3010
	})
	done();
}

function img_resize(done) {
	return GULP.src(SETTINGS.src.img + '**/*.+(png|jpg|gif|svg)')
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(WAIT(500))
	.pipe(responsive({
		'*': [{
			rename: { suffix: '' },
		},{
			width: 768,
			rename: { suffix: '-768w' },
		}, {
			width: 992,
			rename: { suffix: '-992w' },
		}, {
			width: 1200,
			rename: { suffix: '-1200w' },
		}, {
			width: '200%',
			rename: { suffix: '@2x' },
		}, {
			width: '300%',
			rename: { suffix: '@3x' },
		}],
	}, {
		withoutEnlargement: false,
		// errorOnEnlargement: false,
		errorOnUnusedImage: false,
		errorOnUnusedConfig: false,
	}))
	.pipe(GULP.dest('./' + SETTINGS.dist.img))
}

function img(done) {
	return GULP.src(SETTINGS.src.img + '**/*.+(png|jpg|gif|svg)')
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(WAIT(500))
	.pipe(responsive({
		'*': [{
			rename: { suffix: '' },
		},{
			width: 768,
			rename: { suffix: '-768w' },
		}, {
			width: 992,
			rename: { suffix: '-992w' },
		}, {
			width: 1200,
			rename: { suffix: '-1200w' },
		}, {
			width: '200%',
			rename: { suffix: '@2x' },
		}, {
			width: '300%',
			rename: { suffix: '@3x' },
		}],
	}, {
		withoutEnlargement: false,
		// errorOnEnlargement: false,
		errorOnUnusedImage: false,
		errorOnUnusedConfig: false,
	}))
	.pipe(CACHE(IMAGEMIN()))
	.pipe(GULP.dest('./' + SETTINGS.dist.img))
}

function sass_dev() {
	return GULP.src([
		SETTINGS.src.scss + '**/*.+(scss|sass)',
		'!' + SETTINGS.src.scss + '**/_*.+(scss|sass)'
		])
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(WAIT(500))
	.pipe(SOURCEMAPS.init())
	.pipe(SASS({outputStyle: 'expanded'}))
	.pipe(POSTCSS(POSTCSS_PLUGINS))
	.pipe(CONCAT('style.css'))
	.pipe(SOURCEMAPS.write('./'))
	.pipe(GULP.dest('./' + SETTINGS.dist.css))
	.pipe(BROWSER_SYNC.reload({stream: true}))
}

function sass_dist() {
	return GULP.src([
		SETTINGS.src.scss + '**/*.+(scss|sass)',
		'!' + SETTINGS.src.scss + '**/_*.+(scss|sass)'
		])
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(CONCAT('style.css'))
	.pipe(SASS({outputStyle: 'compressed'}))
	.pipe(POSTCSS(POSTCSS_PLUGINS))
	.pipe(GULP.dest('./' + SETTINGS.dist.css))
}

function sass_production() {
	return GULP.src([
		SETTINGS.src.scss + '**/*.+(scss|sass)',
		'!' + SETTINGS.src.scss + '**/_*/',
		'!' + SETTINGS.src.scss + '**/_*/**/*',
		'!' + SETTINGS.src.scss + '**/_*.+(scss|sass)'
		])
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(CONCAT('style.css'))
	.pipe(SASS({outputStyle: 'compressed'}))
	.pipe(POSTCSS(POSTCSS_PLUGINS))
	.pipe(GULP.dest('./' + SETTINGS.dist.css))
}

function build_js(done) {
	return GULP.src(SETTINGS.src.js + '**/*.js')
	.pipe(BABEL({
		plugins: ['@babel/transform-runtime']
	}))
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(GULP.dest('./' + SETTINGS.dist.js))
}

function fonts() {
	return GULP.src(SETTINGS.src.fonts + '**/*')
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(GULP.dest('./' + SETTINGS.dist.fonts))
}

function html() {
	return GULP.src(SETTINGS.src.root + '**/*.html')
	.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
	.pipe(posthtml([
		sugarSrcset()
		]))
	.pipe(GULP.dest('./' + SETTINGS.dist.root))
}

function clean(done) {
	CLEAN.sync('./' + SETTINGS.dist.root);
	done();
}

function browserSyncReload(done) {
	BROWSER_SYNC.reload();
}

function watchFiles() {
	GULP.watch('./' + SETTINGS.src.scss + '**/*.+(scss|sass)', GULP.series(sass_dev))
	GULP.watch('./' + SETTINGS.src.root + '**/*.html', GULP.series(html)).on('change', browserSyncReload)
	GULP.watch('./' + SETTINGS.src.js + '**/*', GULP.series(build_js)).on('change', browserSyncReload)
	GULP.watch('./' + SETTINGS.src.fonts + '**/*.*', GULP.series(fonts)).on('change', browserSyncReload)
	GULP.watch('./' + SETTINGS.src.img + '**/*.+(png|jpg|gif|svg)', GULP.series(img_resize))
}

const production = GULP.series(clean, GULP.series(sass_production, html, img, build_js, fonts));
const dist = GULP.series(clean, GULP.series(sass_dist, html, img, build_js, fonts));
const watch = GULP.parallel(server, watchFiles);
const dev = GULP.series(clean, GULP.series(sass_dev, build_js, html, img_resize, fonts), watch);

exports.production = production;
exports.dist = dist;
exports.watch = watch;
exports.dev = dev;