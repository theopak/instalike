'use strict';

var should = require('should');
var request = require('supertest');
var server = require('../../../index');

var baseUrl = 'http://localhost:7001/';
var thingHash = 'thingHash';
var deployment = {
  'id': 0,
  'thing': thingHash,
  'count': 0
};

describe("controllers", function() {
  describe("thing", function() {

    it('should exist', function(done) {
      should.exist(server);
      done();
    });

    describe("GET /{thing}", function() {
      it("Should return a count of 0 for a new Thing", function(done) {
        request(baseUrl)
          .get(thingHash)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            var body = res.body;
            body.should.have.property('id', 0);
            body.should.have.property('thing', thingHash);
            body.should.have.property('count', 0);
            done();
        });
      });
    });

    describe("POST /{thing}", function() {
      it("Should increment the counter for a Thing", function(done) {
        request(baseUrl)
          .post(thingHash)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            var body = res.body;
            body.should.have.property('count', 1);
            done();
          });
      });
    });

    describe("GET /{thing}", function() {
      it("Should return an accurate count for an existing Thing", function(done) {
        request(baseUrl)
          .get(thingHash)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            var body = res.body;
            body.should.have.property('id', 0);
            body.should.have.property('thing', thingHash);
            body.should.have.property('count', 1);
            done();
        });
      });
    });

  });
});
