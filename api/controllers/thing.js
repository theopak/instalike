'use strict';

var count = [];

/**
 * Get the number of likes.
 */
exports.getLikes = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  next();
  return res.json({
    'id': 0,
    'thing': thing,
    'count': count[thing] || 0
  });
};

/**
 * Increment the number of likes (by one) and then return the new count.
 */
exports.like = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  count[thing] = (count[thing] || 0) + 1;
  next();
  return res.json({
    'id': 0,
    'thing': thing,
    'count': count[thing]
  });
}
