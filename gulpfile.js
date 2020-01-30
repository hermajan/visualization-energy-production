const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const gulpSass = require("gulp-sass");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");

const uglifyes = require("uglify-es");
const composer = require("gulp-uglify/composer");
const uglify = composer(uglifyes, console);

const files = {
	scss: {
		path: "assets/scss/**/*.scss"
	},
	js: {
		libs: [
			"node_modules/jquery/dist/jquery.min.js",
			"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
			"node_modules/@hermajan/booty/js/booty.js",
			"node_modules/d3/dist/d3.js", "node_modules/d3-queue/build/d3-queue.js",
			"node_modules/plotly.js-dist/plotly.js",
			"node_modules/datatables.net/js/jquery.dataTables.min.js", "node_modules/datatables.net-dt/js/dataTables.dataTables.min.js",
			"assets/js/**/*.js"
		],
		path: "assets/js/**/*.js"
	}
};

// Compiles the SCSS files into CSS
function sass() {
	return gulp.src(files.scss.path)
		.pipe(sourcemaps.init()) // initializes sourcemaps first
		.pipe(gulpSass({outputStyle: "compressed"}).on("error", gulpSass.logError)) // compiles SCSS to CSS and minifies CSS files
		.pipe(autoprefixer()) // adds vendor prefixes to CSS rules
		.pipe(sourcemaps.write(".")) // writes sourcemaps file in current directory
		.pipe(gulp.dest("dist")); // puts final CSS in dist folder
}

// Concatenates and uglifies JS files
function javascript() {
	return gulp.src(files.js.libs, {sourcemaps: true, strict: true})
		.pipe(concat("script.js"))
		.pipe(uglify())
		.pipe(gulp.dest("dist", {sourcemaps: "."}));
}

// Watch SCSS and JS files for changes
function watch() {
	gulp.watch([files.scss.path, files.js.path], gulp.parallel(sass, javascript));
}

// Export the default Gulp task so it can be run
exports.default = gulp.series(
	gulp.parallel(sass, javascript),
	watch
);
