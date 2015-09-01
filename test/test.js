var koa = require('koa');
var views = require('../');
var jade = require('jade');
var request = require('supertest');
var should = require('should');
var cheerio = require('cheerio');
var assert = require('assert');

/**
 * create new koa app
 */
var createApp = function() {
  var app = koa();

  // mount app
  require('../')(app, {
    defaultExt: 'jade',
    viewRoot: __dirname + '/views'
  });

  // add jade
  app.engine('jade', function(a, b) {
    return function(done) {
      jade.renderFile(a, b, done);
    };
  });

  return app;
};

describe('koa-generic-views', function(done) {
  it('should have render/engine/engines', function(done) {
    var app = createApp();

    app.use(function * () {
      this.render.should.ok;
      yield this.render('test');
    });

    request(app.listen())
      .get('/')
      .expect(200, done);
  });

  it('should handle locals right', function(done) {
    var app = createApp();

    app.use(function * () {
      this.state.user = {
        name: 'someUserName',
        points: 1000
      };

      yield this.render('locals', {
        title: 'awesome site',
        user: {
          github: 'https://github.com/magicdawn'
        }
      });
    });

    request(app.listen())
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        var $ = cheerio.load(res.text);

        // title
        $('title').text().should.equal('awesome site');

        // locals & state
        $('ul li').length.should.equal(3);
        $('ul li').eq(0).text().should.match(/someUserName/);
        $('ul li').eq(1).text().should.match(/1000/);
        $('ul li').eq(2).text().should.match(/magicdawn/);

        // test is done
        done();
      });
  });

  it('throws when engine not registered', function(done) {
    var app = koa();

    // mount app
    views(app, {
      viewRoot: __dirname + '/views',
    });

    app.use(function * () {
      try {
        yield this.render('default');
      }
      catch (e) {
        e.message.should.match(/no engine registered/);
      }
    });

    request(app.listen())
      .get('/')
      .expect(404, done);
  });

  it('.ext or ext is ok', function(done) {
    var app = koa();
    views(app,{
      defaultExt: 'jade',
      viewRoot: __dirname + '/views'
    });

    app.engine('.jade',function(view,locals){
      return function(done){
        return jade.renderFile(view, locals, done);
      };
    });

    app.use(function * (){
      yield this.render('test');
    });

    request(app.listen())
      .get('/')
      .expect(200,done);
  });
});