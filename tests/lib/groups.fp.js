const R = require('ramda');
const should = require('should');
const proxyquire = require('proxyquire');
const proxiedGitlab = require('../fixtures/gitlab-groups');
const proxiedGitlabWithNoGroups = require('../fixtures/gitlab-groups-none');

describe('Groups', () => {
  it('should load all the groups as choices', (done) => {
    const groupLoader = proxyquire('../../lib/groups.fp.js', {
      gitlab: proxiedGitlab,
    });
    const load = R.call(groupLoader, { url: 'http://gitlab-cts.stackroute.in', token: 'ThisIsAToken' });
    load.then((groups) => {
      should.exist(groups);
      groups.should.be.a.instanceOf(Array);
      groups[0].should.have.properties(['name', 'value']);
      done();
    });
  });

  it('should throw an error if the groups doesnt exists', (done) => {
    const groupLoader = proxyquire('../../lib/groups.fp.js', {
      gitlab: proxiedGitlabWithNoGroups,
    });
    const load = R.call(groupLoader, { url: 'http://gitlab-cts.stackroute.in', token: 'ThisIsAToken' });
    load.catch((err) => {
      should.exist(err);
      err.message.should.be.exactly('No Groups found');
      done();
    });
  });
});
