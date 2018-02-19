const R = require('ramda');
const should = require('should');
const proxyquire = require('proxyquire');
const proxiedGitlab = require('../fixtures/gitlab-groups');

const groupLoader = proxyquire('../../lib/groups.fp.js', {
  gitlab: proxiedGitlab,
});

describe('Groups', () => {
  it('should load all the groups as choices', (done) => {
    const load = R.call(groupLoader, { url: 'http://gitlab-cts.stackroute.in', token: 'ThisIsAToken' });
    load.then((groups) => {
      should.exist(groups);
      groups.should.be.a.instanceOf(Array);
      groups[0].should.have.properties(['name', 'value']);
      done();
    }).catch(err => done(err));
  });
});
