'use strict';

module.exports.init = function(config) {
  try {
    var redisClient;
    if (process.env.MOCK_REDIS || '' !== '') {
      console.info('using redis-mock')
      var MockRedis = require('redis-mock');
      redisClient = MockRedis.createClient();
    } else {
      var Redis = require('ioredis');
      redisClient = new Redis(config);
    }

    redisClient.on('connect', function() {
      console.info('connected to redis');
    });

    redisClient.on('error', function (err) {
      console.error(err, 'Error caught from redis_client.');
    });

    return redisClient;
  } catch(e) {
    console.fatal(e, 'Unable to create redis_client targeting host %s', config.redis.host);
  }
};
