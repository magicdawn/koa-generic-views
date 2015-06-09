var koa = require('koa');
var app = koa();
var jade = require('jade');

// mount app
require('../')(app, {
  defaultExt: 'jade',
  viewRoot: __dirname
});

// add jade
app.engine('jade', function(a, b) {
  return function(done) {
    jade.renderFile(a, b, done);
  };
});

app.use(function * () {
  yield this.render('test');
});

// exports app
module.exports = app;

if (require.main === module) {
  app.listen(3000);
}