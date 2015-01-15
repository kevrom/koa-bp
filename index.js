'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var jade = require('koa-jade');
var parse = require('co-busboy');
var views = require('co-views');
var path = require('path');

var app = koa();


app.use(function *(next) {
	yield next;
	console.log('End of request');
});

app.use(function *(next) {
	console.log('Render function');
	var render = views('server/views', {
		default: 'jade',
		map: {
			html: 'swig',
			md: 'hogan'
		}
	});
	this.render = render;
	yield next;
});

app.use(route.get('/', indexController));

function * indexController() {
	console.log('index');
	if (this.method !== 'GET') { return yield next; }
	this.body = yield this.render('layout');
}

app.use(serve(path.join(__dirname, '/public')));

app.listen(3000, function() {
	console.log('Now listening on ', this);
});
