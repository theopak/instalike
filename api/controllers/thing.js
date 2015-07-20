'use strict';

var app = require('../../index.js');
var redisClient = app.get('redis');

var count = [];

/**
 * Get the number of likes.
 */
exports.getLikes = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  redisClient.get(thing, function (err, result) {
    next();
    return res.json({
      'thing': thing,
      'count': parseInt(result) || 0
    });
  });
};

/**
 * Increment the number of likes (by one) and then return the new count.
 */
exports.like = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  redisClient.incr(thing, function(err, result) {
    next();
    return res.json({
      'thing': thing,
      'count': result
    });
  });
}

/**
 * Decrement the number of likes (by one) and then return the new count.
 */
exports.unlike = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  redisClient.get(thing, function (err, result) {
    if (result <= 0) {
      next();
      return res.json({
        'thing': thing,
        'count': 0
      });
    }
    redisClient.decr(thing, function(err, result) {
      next();
      return res.json({
        'thing': thing,
        'count': result
      });
    });
  });
}
