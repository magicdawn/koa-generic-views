# koa-generic-views
Generic view interface for koa

[![Build Status](https://travis-ci.org/magicdawn/koa-generic-views.svg?branch=master)](https://travis-ci.org/magicdawn/koa-generic-views)
[![Coverage Status](https://coveralls.io/repos/magicdawn/koa-generic-views/badge.svg?branch=master)](https://coveralls.io/r/magicdawn/koa-generic-views?branch=master)

## Install
```sh
npm i koa-generic-views --save
```

## Example
```js
var koa = require('koa');
var app = koa();
var jade = require('jade');
require('koa-generic-views')(app,{
  defaultExt: 'html'
});

app.engine('jade',function(view,locals){
  return function(done){
    jade.renderFile(view,locals,done);
  };
})
```

app.engine('ext',engine);
engine should be a thunk or a Promise;

## Why
why not [koa-views](https://github.com/queckezz/koa-views)?

koa-views -> [co-views](https://github.com/tj/co-views) -> [co-render](https://github.com/tj/co-render)
-> [consolidate.js](https://github.com/tj/consolidate.js)

And only engine supported in consolidate.js supported in koa-views;

## License
MIT http://magicdawn.mit-license.org
