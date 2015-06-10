# koa-generic-views
Generic view interface for koa

[![Build Status](https://travis-ci.org/magicdawn/koa-generic-views.svg?branch=master)](https://travis-ci.org/magicdawn/koa-generic-views)
[![Coverage Status](https://coveralls.io/repos/magicdawn/koa-generic-views/badge.svg?branch=master)](https://coveralls.io/r/magicdawn/koa-generic-views?branch=master)

## Install
```sh
npm i koa-generic-views --save
```

## API
```js
var views = require('koa-generic-views');
views(app,options);
```
### Options

- viewRoot: set the root path
- defaultExt: set the default extension


## Example
```js
var koa = require('koa');
var app = koa();
var jade = require('jade');
require('koa-generic-views')(app,{
  defaultExt: 'jade'
});

app.engine('jade',function(view,locals){
  return function(done){
    jade.renderFile(view,locals,done);
  };
});

app.use(function *(){
  yield this.render('template');
});
```

app.engine('ext',engine);
engine should return a thunk or a Promise
so use `Promise.promisify` with bluebird is also supported.

## Why
why not [koa-views](https://github.com/queckezz/koa-views)?

koa-views -> [co-views](https://github.com/tj/co-views) -> [co-render](https://github.com/tj/co-render)
-> [consolidate.js](https://github.com/tj/consolidate.js)

Any engine not supported in consolidate need to PR to consolidate.I hate centerlized.

## License
MIT http://magicdawn.mit-license.org
