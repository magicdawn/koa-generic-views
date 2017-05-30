'use strict'

/**
 * Module dependencies.
 */
const debug = require('debug')('koa-generic-views')
const merge = require('lodash').merge
const fmt = require('util').format
const resolve = require('path').resolve
const dirname = require('path').dirname
const join = require('path').join
const extname = require('path').extname

/**
 * ext without `.`
 */
let ensureExt = function(ext) {
  if (ext[0] === '.') {
    return ext.substr(1)
  }

  return ext
}

/**
 * Add `render` method
 */

module.exports = function(app, opts) {
  /**
   * viewRoot defaults to `views`
   */
  let viewRoot = resolve(opts.viewRoot || 'views')

  /**
   * default extension
   */
  let defaultExt
  if (opts.defaultExt) {
    defaultExt = ensureExt(opts.defaultExt)
  } else {
    defaultExt = 'html'
  }

  /**
   * render function
   */
  app.context.render = async function(view, locals) {
    let ext = extname(view)
    if (!ext) {
      view += '.' + defaultExt
      ext = defaultExt
    }

    /**
     * decide engine
     */
    let engine = app.engines[ext]
    if (!engine) {
      // no match engine registered
      let msg = fmt('no engine registered for `.%s` file', ext)
      throw new Error(msg)
    }

    /**
     * decide view file
     */
    view = join(viewRoot, view)

    /**
     * decide locals
     */
    locals = locals || {}
    locals = merge(locals, this.state)

    /**
     * var result = await this.render('index',{});
     */
    return this.body = await engine(view, locals)
  }

  /**
   * engine map
   */

  app.engines = {}

  /**
   * add a engine
   */

  app.engine = function(ext, engine) {
    ext = ensureExt(ext)
    this.engines[ext] = engine
  }
}