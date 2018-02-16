/**
 * @fileOverview Unit tests getCadets for members.fp.js
 */

const should = require('should');
const proxyquire = require('proxyquire');
const config = require('../fixtures/load-config.json');
const proxiedRequest = require('../fixtures/request-members');

/**
 * Requires getCadets by mocking
 * 1. getConfig present in the config-file
 * by mock config.
 * 2. request-promise-native by request-members
 * which returns cadets
 */
const { getCadets } = proxyquire('../../lib/members.fp', {
  './config/config-file.fp': {
    getConfig: () => config,
  },
  'request-promise-native': proxiedRequest,
});

describe('members', () => {
  it('should getCadets', (done) => {
    const cadetsP = getCadets();
    cadetsP.then((cadets) => {
      should.exist(cadets);
      cadets.should.be.an.instanceOf(Array);
      /**
       * Since proxied request libary returns same
       * list of cadets for both included and excluded groups,
       * the list should be empty.
       */
      cadets.should.be.empty();
      done();
    });
  });
});
