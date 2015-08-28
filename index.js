'use strict';

var swaggerTools = require('swagger-tools');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var express = require('express');
var Redis = require('./lib/redis.js');

/**
 * Configure instances of this process via environment variables.
 */
var options = module.exports.options = {
  port: process.env.PORT || 8089,
  node_env: process.env.NODE_ENV,
  swaggerResource: path.join(__dirname, './api/swagger/swagger.yaml'),
  appRoot: __dirname,                           // required for swagger-node
  validateResponse: false,                      // swaggerValidator() default false
  controllers: path.join(__dirname, '/api/controllers'),// swaggerRouter() default {}
  useStubs: process.env.NODE_ENV == 'development' ? true : false,// mocks. swaggerRouter() default false
  apiDocs: '/api/v1/swagger.json',              // swaggerUi() default '/api-docs'
  swaggerUi: '/docs',                           // swaggerUi() default '/docs'
  redis: {                                      // required for ./lib/redis.js
    port: process.env.REDIS_PORT_6379_TCP_PORT || 6379,
    host: process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1'
  }
};

/**
 * This is important for testing.
 */
var app = express();
module.exports = app;
var redisClient = Redis.init(options.redis);
app.set('redis', redisClient);

// Express.js server
var swaggerResource = yaml.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf-8'));
swaggerTools.initializeMiddleware(swaggerResource, function(middleware) {
  // Emit errors as events to a log
  app.on('after', function(req, resp, route, err) {
    if (err) {
      console.error(err);
    }
  });

  // Register handlers to execute when app is closing
  process.on('exit', function(){console.log('(exit pid %d)', process.pid)});

  // Enable CORS for development purposes, but not in production
  if (process.env.NODE_ENV != 'production') {
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
    console.log('CORS allowed (this option is enabled when node process.env is not \'production\').');
  }

  // Connect swagger middleware. `swaggerMetadata` must come before any other swagger-tools middleware.
  app.use(middleware.swaggerMetadata()); // Interpret Swagger resources and attach metadata to request
  app.use(middleware.swaggerValidator()); // Validate Swagger requests
  app.use(middleware.swaggerRouter(options)); // Route validated requests to appropriate controller
  app.use(middleware.swaggerUi(options)); // Serve the Swagger documents and Swagger UI

  // It's possible to serve the frontend as static files from this node.js instance
  app.use('/', express.static('./dist'));

  // Start server
  app.listen(options.port, function(err) {
    console.log('\n===== express.js app (pid %d) =====\n%s\n', process.pid, __dirname, options);
    if (err) {
      console.error(err);
    }
  });
});
