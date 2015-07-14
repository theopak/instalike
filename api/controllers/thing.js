'use strict';

var Redis = require('ioredis');
var client = Redis();

var count = [];

/**
 * Get the number of likes.
 */
exports.getLikes = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  client.get(thing, function (err, result) {
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
  client.incr(thing, function(err, result) {
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
  client.get(thing, function (err, result) {
    if (result <= 0) {
      next();
      return res.json({
        'thing': thing,
        'count': 0
      });
    }
    client.decr(thing, function(err, result) {
      next();
      return res.json({
        'thing': thing,
        'count': result
      });
    });
  });
}
