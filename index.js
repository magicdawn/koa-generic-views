'use strict'

/**
 * Module dependencies.
 */
const debug = require('debug')('koa-generic-views')
const _merge = require('lodash.merge')
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

  const viewRoot = resolve(opts.viewRoot || 'views')

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
    const ctx = this

    let ext = extname(view)
    if (!ext) {
      view += '.' + defaultExt
      ext = defaultExt
    }

    /**
     * decide engine
     */
    const engine = app.engines[ext]
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

    locals = _merge({}, app.locals, ctx.state, locals)

    // add cache
    const isEmpty = val => val === null || typeof val === 'undefined'
    if (isEmpty(locals.cache)) {
      if (!isEmpty(opts.cache)) {
        locals.cache = opts.cache
      } else {
        locals.cache = process.env.NODE_ENV === 'production'
      }
    }

    /**
     * var result = await this.render('index',{});
     */

    const text = await engine(view, locals)
    this.type = 'html'
    this.body = text
    return text
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