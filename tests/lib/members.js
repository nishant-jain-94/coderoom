/* eslint no-underscore-dangle: ["error", { "allow": ["__set__"] }] */

const should = require('should');
const rewire = require('rewire');
const sinon = require('sinon');

const members = rewire('../../lib/members.js');

describe('members', () => {
  before(() => {
    // Create a mock config object
    const mockConfig = {
      load: () => ({
        API_TOKEN: 'pKZosz1ke344Hzgxkv4E',
        GITLAB_URL: 'https://gitlab-cts.stackroute.in/',
        INCLUDED_GROUPS: [
          162,
        ],
        EXCLUDED_GROUPS: [
          163,
        ],
      }),
    };

    const getMembersOfGroupAsyncStubResults = {
      cadets: new Promise(r => r([
        {
          name: 'Cadet Foo Bar',
          username: 'Cadet.Foo.Bar',
        },
      ])),
      mentors: new Promise(r => r([
        {
          name: 'Mentor Foo Bar',
          username: 'Mentor.Foo.Bar',
        },
      ])),
    };

    const getMembersOfGroupAsyncStub = sinon.stub();

    getMembersOfGroupAsyncStub.withArgs('https://gitlab-cts.stackroute.in/', 'pKZosz1ke344Hzgxkv4E', 162).returns(getMembersOfGroupAsyncStubResults.cadets);

    getMembersOfGroupAsyncStub.withArgs('https://gitlab-cts.stackroute.in/', 'pKZosz1ke344Hzgxkv4E', 163).returns(getMembersOfGroupAsyncStubResults.mentors);

    members.__set__('config', mockConfig);
    members.__set__('getMembersOfGroupAsync', getMembersOfGroupAsyncStub);
  });

  it('Should load all the members of the group', async () => {
    const cadets = await members.load();
    should.exist(cadets);
    cadets.should.be.an.instanceOf(Array);
    cadets.length.should.be.exactly(1);
    cadets[0].should.have.property('name', 'Cadet Foo Bar');
    cadets[0].should.have.property('username', 'Cadet.Foo.Bar');
  });
});
