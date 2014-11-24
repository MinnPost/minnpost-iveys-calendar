/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  // Hack around jQuery
  map: {
    '*': {
      'jquery': 'jquery-noconflict'
    },
    'jquery-noconflict': {
      'jquery': 'jquery'
    }
  },
  shim: {
    'lazyload': {
      exports: 'LazyLoad'
    }
  },
  baseUrl: 'js',
  paths: {
    'requirejs': '../bower_components/requirejs/require',
    'almond': '../bower_components/almond/almond',
    'text': '../bower_components/text/text',
    'jquery': '../bower_components/jquery/dist/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'moment': '../bower_components/moment/moment',
    'jquery-noconflict': 'build/jquery-noconflict'
  }
});
