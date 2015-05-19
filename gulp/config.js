var argv = require('yargs').default('production', false).argv;

var isProduction = argv.production;
var dest = isProduction ? './public/production' : './public/development';
var src = './client';

module.exports = {
  isProduction: isProduction,

  sass: {
    src: src + '/styles/application.scss',
    dest: dest + '/styles',
    manifest: 'css-manifest.json',
    settings: {
      includePaths: [
        './node_modules/bootstrap-sass/assets/stylesheets',
        './node_modules/font-awesome/scss/'
      ]
    }
  },
  browserify: {
    src: src + '/js/App.js',
    dest: dest + '/js',
    outputName: 'App.js',
    manifest: 'js-manifest.json'
  },
  html: {
    src: src + '/*.html',
    dest: dest
  },
  fonts: {
    src: [
      './node_modules/font-awesome/fonts/*'
    ],
    dest: dest + '/fonts'
  },
  images: {
    src: src + '/images/**/*',
    dest: dest + '/images'
  },
  watch: {
    js: {
      src: ['client/js/**/*.js', '!client/**/*-spec.js'],
      tasks: isProduction ? ['watchify', 'html'] : ['watchify'] // revs only change for release mode
    },
    styles: {
      src: 'client/styles/**/*.scss',
      tasks: ['styles', 'html']
    },
    assets: {
      src: 'client/{images|fonts}}/**/*.*',
      tasks: ['fonts', 'images', 'html']
    },
    html: {
      src: 'client/**/*.html',
      tasks: ['html']
    }
  },
  clean: {
    paths: ['public']
  }
};
