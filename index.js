/**
 * Module dependencies.
 */
var debug = require('debug')('koa-generic-views');
var assign = require('lodash').assign;
var fmt = require('util').format;
var resolve = require('path').resolve;
var dirname = require('path').dirname;
var join = require('path').join;
var extname = require('path').extname;

/**
 * Add `render` method
 */
module.exports = function(app, opts) {
  /**
   * viewRoot defaults to `views`
   */
  var viewRoot = resolve(opts.viewRoot || 'views');

  /**
   * default extension
   */
  var defaultExt;
  if (opts.defaultExt) {
    if (opts.defaultExt[0] !== '.') {
      defaultExt = opt.defaultExt + '.'
    } else {
      defaultExt = opts.defaultExt;
    }
  } else {
    defaultExt = '.html';
  }

  /**
   * render function
   */
  app.context.render = function * (view, locals) {
    var ext = extname(view);
    if (!ext) {
      view += defaultExt;
    }

    /**
     * decide engine
     */
    ext = ext || defaultExt;
    var engine = app.engines[ext];
    if (!engine) {
      var engineName = ext.slice(1);
      engine = app.engines[ext] = require(engineName);
    }

    /**
     * decide view file
     */
    view = join(viewRoot, view);

    /**
     * decide locals
     */
    locals = locals || {};
    this.state = this.state || {};
    locals = assign(locals,this.state);

    /**
     * var result = yield this.render('index',{});
     */
    return this.body = yield new Promise(function(resolve, reject) {
      engine(view, locals, function(err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  };

  /**
   * engine map
   */
  app.engines = {};

  /**
   * add a engine
   */
  app.engine = function(ext, engine) {

    if (ext[0] !== '.') {
      ext += '.';
    }

    this.engines[ext] = engine;
  };
};