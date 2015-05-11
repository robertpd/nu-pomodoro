var argv = require('yargs').argv;

var dest = './public/assets';
var src = './client';
var isRelease = !!argv.release;

module.exports = {
  isRelease: isRelease,

  sass: {
    src: src + '/styles/application.scss',
    dest: dest + '/styles',
    manifest: 'css-manifest.json',
    settings: {
      includePaths: [
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
    dest: './public'
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
      tasks: isRelease ? ['watchify', 'html'] : ['watchify'] // revs only change for release mode
    },
    styles: {
      src: 'client/styles/**/*.sass',
      tasks: ['styles', 'html']
    },
    assets: {
      src: 'client/{images|fonts}}/**/*.*',
      tasks: ['fonts', 'images', 'html']
    }
  },
  clean: {
    paths: ['public']
  }
};
