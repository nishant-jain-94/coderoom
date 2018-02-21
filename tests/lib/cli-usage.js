/**
 * @fileOverview Unit tests cli-usage of coderoom
 */
const R = require('ramda');
const should = require('should');
const proxyquire = require('proxyquire');

/**
 * Stubs the commandline with an identity function
 */
const commandLineUsageStub = R.identity;

const proxiedCliUsage = proxyquire('../../lib/cli-usage', {
  'command-line-usage': commandLineUsageStub,
});

describe('cli-usage', () => {
  it('should get the cli-usage of coderoom', () => {
    should.exist(proxiedCliUsage);
    proxiedCliUsage.should.be.an.instanceOf(Array);
    proxiedCliUsage.length.should.be.exactly(2);
    proxiedCliUsage[1].content.length.should.be.exactly(6);
  });
});
