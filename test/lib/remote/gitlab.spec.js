'use strict';

var Promise = require('bluebird');

var _ = require('lodash');
var fecom = require('../../../lib/fecom');
var bootstrap = require('../../../lib/bootstrap');
var gitlabRepo = require('../../../lib/remote/gitlab');

describe('remote gitlab', function () {
  beforeAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  describe('validate', function () {
    describe('icefox0801/comp_valid_version@1.1.2', function () {
      it('should return valid component.json', function (done) {
        gitlabRepo.validate('icefox0801', 'comp_valid_version', '1.1.2')
          .then(function (json) {
            expect(json.version).toBe('1.1.2');
            expect(json.name).toBe('comp_valid_version');
            done();
          });
      });
    });
    describe('icefox0801/comp_valid_version@1.0.99', function () {
      it('should return empty string', function (done) {
        Promise
          .try(function () {
            return gitlabRepo.validate('icefox0801', 'comp_valid_version', '1.0.99');
          })
          .catch(function (err) {
            expect(err.message).toEqual('"component.json" not found in icefox0801/comp_valid_version');
            done();
          });
      });
    });
  });
  describe('getLatestTag', function () {
    describe('icefox0801/comp_valid_version', function () {
      it('should return tag 1.1.2', function (done) {
        gitlabRepo.getLatestTag('icefox0801', 'comp_valid_version')
          .then(function (tag) {
            expect(tag.name).toBe('1.1.2');
            done();
          });
      });
    });
  });
  describe('getComponentJson', function () {});
  describe('getDependencies', function () {
    describe('icefox0801/comp_deps', function () {
      fit('should return valid dependencies tree', function (done) {
        gitlabRepo.getDependencies('icefox0801', 'comp_deps', '1.0.0')
          .then(function (tree) {
            var expected = [
              'icefox0801/comp_deps@1.0.0',
              'icefox0801/comp_sub_a@1.0.1',
              'icefox0801/comp_sub_a@1.1.0',
              'icefox0801/comp_sub_b@1.0.1'
            ];
            expect(_.flattenDeep(tree).map(fecom.stringify).sort()).toEqual(expected);
            done();
          });
      });
    });
  });
});
