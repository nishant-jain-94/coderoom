/**
 * @fileOverview Unit Test for open issues
 */
const R = require('ramda');
const sinon = require('sinon');
const should = require('should');
const proxyquire = require('proxyquire');
const proxiedOpn = require('../fixtures/opn.js');

/**
 * Creates a stub function to get the git
 * remote origin url.
 */
const stubbedExec = sinon.stub().returns({
  stdout: 'git@gitlab-cts.stackroute.in:Anthony.Gonsalvis/BootstrapAssignment.git',
});

const { openIssues } = proxyquire('../../lib/open-issues.fp.js', {
  opn: proxiedOpn,
  shelljs: {
    exec: stubbedExec,
  },
});

describe('Open Issues', () => {
  it('should open the issues page', () => {
    const result = R.call(openIssues);
    should.exist(result);
    result.pageOpened.should.be.exactly(true);
  });
});
