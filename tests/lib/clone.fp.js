const R = require('ramda');
const sinon = require('sinon');
const should = require('should');
const proxyquire = require('proxyquire');

const cloneScript = proxyquire('../../lib/clone.fp.js', {
  './members.fp': {
    getCadets: () => Promise.resolve(),
  },
  './config/config-file.fp': {
    getConfig: () => ({
      REVIEWERS_NAME: 'Nishant Jain',
      API_TOKEN: 'pKZosz1ke344Hzgxkv4E',
      GITLAB_URL: 'https://gitlab-cts.stackroute.in/',
      INCLUDED_GROUPS: [
        162,
      ],
      EXCLUDED_GROUPS: [
        163,
      ],
      ASSIGNMENT: 'BootstrapAssignment',
    }),
  },
  shelljs: {
    exec: (command, options, cb) => {
      cb(0);
    },
  },
});

describe('Clone', () => {
  it('`getAssignment` should be able to get the assignment', () => {
    const assignment = R.call(cloneScript.__private__.getAssignment);
    should.exist(assignment);
    assignment.should.be.exactly('BootstrapAssignment');
  });

  it('`buildCloneCmd` should return a command to clone repositories', () => {
    const { buildCloneCmd } = cloneScript.__private__;
    const cmd = R.call(buildCloneCmd, 'gitlab-cts.stackroute.in', 'BootstrapAssignment', 'Anthony.Gonsalvis');
    should.exist(cmd);
    cmd.should.be.exactly('git clone git@gitlab-cts.stackroute.in:Anthony.Gonsalvis/BootstrapAssignment.git Anthony.Gonsalvis');
  });

  it('`buildCloneCmdWithGitlabUrl` should return a git clone command', () => {
    const { buildCloneCmdWithGitlabUrl } = cloneScript.__private__;
    const cmd = R.call(buildCloneCmdWithGitlabUrl, 'BootstrapAssignment', 'Anthony.Gonsalvis');
    should.exist(cmd);
    cmd.should.be.exactly('git clone git@gitlab-cts.stackroute.in:Anthony.Gonsalvis/BootstrapAssignment.git Anthony.Gonsalvis');
  });

  it('`buildCloneCmdWithGitlabUrlOverAssignment` should return a cmd to clone git repository', () => {
    const { buildCloneCmdWithGitlabUrlOverAssignment } = cloneScript.__private__;
    const cmd = R.call(buildCloneCmdWithGitlabUrlOverAssignment, 'Anthony.Gonsalvis');
    should.exist(cmd);
    cmd.should.be.exactly('git clone git@gitlab-cts.stackroute.in:Anthony.Gonsalvis/BootstrapAssignment.git Anthony.Gonsalvis');
  });

  it('`getUrlWithNoProtocol` should return a url removing the protcol substring', () => {
    const { getUrlWithNoProtocol } = cloneScript.__private__;
    const url = R.call(getUrlWithNoProtocol, 'https://gitlab-cts.stackroute.in/');
    should.exist(url);
    url.should.be.exactly('gitlab-cts.stackroute.in');
  });

  it('`throwGitDoesntExists`', () => {
    const { throwGitDoesntExists } = cloneScript.__private__;
    try {
      R.call(throwGitDoesntExists);
    } catch (err) {
      should.exist(err);
      err.message.should.be.exactly("package 'git' could not be found. Coderoom depends on 'GIT'");
    }
  });

  it('`promisifiedShellExecCmd` should exec the command and return its result', (done) => {
    const { promisifiedShellExecCmd } = cloneScript.__private__;
    const exec = R.call(promisifiedShellExecCmd, {}, 'ls');

    exec.then((code) => {
      should.exist(code);
      code.should.be.exactly(0);
      done();
    });
  });

  it('`curriedExecCommand` should exec the command and return its result', (done) => {
    const { curriedExecCommand } = cloneScript.__private__;
    const exec = R.call(curriedExecCommand, {}, 'ls');

    exec.then((code) => {
      should.exist(code);
      code.should.exactly(0);
      done();
    });
  });
});
