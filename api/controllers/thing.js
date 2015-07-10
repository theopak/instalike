'use strict';

var count = [];

exports.getLikes = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  var key = 'count.' + thing.toString();
  next();
  return res.json({
    'id': 0,
    'thing': thing,
    'count': count[thing] || 0
  });
};

exports.like = function(req, res, next) {
  var thing = req.swagger.params.thing.value;
  if (thing in count) {
    count[thing]++;
  } else {
    count[thing] = 1;
  }
  next();
  return res.json({
    'id': 0,
    'thing': thing,
    'count': count[thing]
  });
}
