'use strict';

describe('ShiftOnTapApp module', function() {
  beforeEach(module('ShiftOnTapApp'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
