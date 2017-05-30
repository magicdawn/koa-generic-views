# koa-generic-views
> generic view interface for koa

[![Build Status](https://img.shields.io/travis/magicdawn/koa-generic-views.svg?style=flat-square)](https://travis-ci.org/magicdawn/koa-generic-views)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/koa-generic-views.svg?style=flat-square)](https://codecov.io/gh/magicdawn/koa-generic-views)
[![npm version](https://img.shields.io/npm/v/koa-generic-views.svg?style=flat-square)](https://www.npmjs.com/package/koa-generic-views)
[![npm downloads](https://img.shields.io/npm/dm/koa-generic-views.svg?style=flat-square)](https://www.npmjs.com/package/koa-generic-views)
[![npm license](https://img.shields.io/npm/l/koa-generic-views.svg?style=flat-square)](http://magicdawn.mit-license.org)

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

// reutrn plain values
app.engine('jade', function(view,locals){
  return jade.renderFile(view, locals) // sync render, do not use in production
});

// or Promise
app.engine('jade',function(views,locals){
  return new Promise(function(resolve,reject){
    jade.renderFile(views,locals,function(err,res){
      if(err){
        return reject(err);
      }
      resolve(res);
    })
  })
});

// or simply use bluebird, Promise.promisify
var Promise = require('bluebird');
app.engine('jade',Promise.promisify(jade.renderFile,jade));

app.use(ctx => {
  return this.render('template');
});
```

app.engine('ext',engine);
engine should return a value or a Promise
so use `Promise.promisify` with bluebird is also supported.


## Why
why not [koa-views](https://github.com/queckezz/koa-views)?

koa-views -> [co-views](https://github.com/tj/co-views) -> [co-render](https://github.com/tj/co-render)
-> [consolidate.js](https://github.com/tj/consolidate.js)

Any engine not supported in consolidate need to PR to consolidate.I hate centerlized.

## Changelog
[CHANGELOG.md](CHANGELOG.md)

## License
the MIT License http://magicdawn.mit-license.org