# koa-generic-views
Generic view interface for koa

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
  default: 'html'
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
the MIT License (magicdawn@qq.com)