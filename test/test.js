'use strict'

const Koa = require('koa')
const views = require('../')
const request = require('supertest')
const should = require('should')
const cheerio = require('cheerio')
const assert = require('assert')
const pify = require('promise.ify')
const njk = pify.all(require('nunjucks'))

// console.log(njk);

/**
 * create new koa app
 */
const createApp = function() {
  const app = new Koa()

  // mount app
  require('../')(app, {
    defaultExt: '.njk',
    viewRoot: __dirname + '/views'
  })

  // add default engine
  app.engine('.njk', njk.renderAsync)

  return app
}

describe('koa-generic-views', function() {
  it('should have render/engine/engines', async function() {
    const app = createApp()

    app.use(ctx => {
      ctx.render.should.ok
      return ctx.render('test')
    })

    const res = await request(app.listen())
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
  })

  it('should handle locals right', async function() {
    const app = createApp()

    app.use(ctx => {
      ctx.state.user = {
        name: 'someUserName',
        points: 1000
      }

      return ctx.render('locals', {
        title: 'awesome site',
        user: {
          github: 'https://github.com/magicdawn'
        }
      })
    })

    const res = await request(app.listen())
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
    const $ = cheerio.load(res.text)

    // title
    $('title').text().should.equal('awesome site')

    // locals & state
    $('ul li').length.should.equal(3)
    $('ul li').eq(0).text().should.match(/someUserName/)
    $('ul li').eq(1).text().should.match(/1000/)
    $('ul li').eq(2).text().should.match(/magicdawn/)
  })

  it('throws when engine not registered', async function() {
    const app = new Koa()

    // mount app
    views(app, {
      viewRoot: __dirname + '/views',
    })

    app.use(async ctx => {
      try {
        await ctx.render('default')
      } catch (e) {
        e.message.should.match(/no engine registered/)
      }
    })

    await request(app.listen())
      .get('/')
      .expect(404)
  })

  it('.ext or ext is ok', async function() {
    const app = new Koa()
    views(app, {
      defaultExt: '.njk',
      viewRoot: __dirname + '/views'
    })
    app.engine('njk', njk.renderAsync) // no `.` in ext

    app.use(ctx => {
      return ctx.render('test')
    })

    await request(app.listen())
      .get('/')
      .expect(200)
  })
})