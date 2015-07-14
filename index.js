'use strict';

var swaggerTools = require('swagger-tools');
var fs = require('fs');
var yaml = require('js-yaml');
var express = require('express');
var Redis = require('ioredis');

var app = express();
module.export = app;

// Configuration
var env = app.get('env'); // Express `app.get('env')` defaults to 'development'.
var options = {
  port: process.env.PORT || 8080,
  appRoot: __dirname,                           // required for swagger-node
  validateResponse: false,                      // swaggerValidator() default false
  apiDocs: '/swagger.json',                     // swaggerUi() default '/api-docs'
  swaggerUi: '/docs',                           // swaggerUi() default '/docs'
  controllers: './api/controllers',             // swaggerRouter() default {}
  useStubs: env == 'development' ? true : false // swaggerRouter() default false
};

// Express.js server
var swaggerResource = yaml.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf-8'));
swaggerTools.initializeMiddleware(swaggerResource, function(middleware) {
  // Enable CORS for development purposes, but not in production
  if (env != 'production') {
    console.log('CORS allowed (this option is enabled when node ENV is not production.');
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  // It's possible to serve the frontend as static files from this node.js instance.
  app.use('/button', express.static('./dist/button'));
  app.use('/demo', express.static('./dist'));

  // Connect swagger middleware. `swaggerMetadata` must come before any other swagger-tools middleware.
  app.use(middleware.swaggerMetadata()); // Interpret Swagger resources and attach metadata to request
  app.use(middleware.swaggerValidator()); // Validate Swagger requests
  app.use(middleware.swaggerRouter(options)); // Route validated requests to appropriate controller
  app.use(middleware.swaggerUi(options)); // Serve the Swagger documents and Swagger UI

  // Emit errors as events to a log
  app.on('after', function(req, resp, route, err) {
    if (err) {
      console.error(err);
    }
  });

  // Start server
  app.listen(options.port, function(err) {
    if (err) {
      console.error(err);
    }
    console.log('\n===\nserver started\n', options);
  });
});
