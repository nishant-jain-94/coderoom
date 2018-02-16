const R = require('ramda');
const sinon = require('sinon');
const should = require('should');
const proxyquire = require('proxyquire');

const cadets = require('../fixtures/cadets.json');
const config = require('../fixtures/load-config.json');
const progressBar = require('../fixtures/progressBar');

const cloneScript = proxyquire('../../lib/clone.fp.js', {
  './members.fp': {
    getCadets: () => Promise.resolve(cadets),
  },
  './config/config-file.fp': {
    getConfig: () => config,
  },
  shelljs: {
    exec: (command, options, cb) => {
      cb(0);
    },
    rm: () => 0,
    which: R.T,
  },
  'cli-progress': progressBar,
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

  it('`deleteExistingRepos` deletes all the repos', () => {
    const { deleteExistingRepos } = cloneScript.__private__;
    const exitCode = R.call(deleteExistingRepos);
    should.exist(exitCode);
    exitCode.should.be.exactly(0);
  });

  it('`checkIfGitExists` checks if the git exists', () => {
    const { checkIfGitExists } = cloneScript.__private__;
    const exitCode = R.call(checkIfGitExists);
    should.exist(exitCode);
    exitCode.should.be.exactly(true);
  });

  it('`cloneAllAssignments` should clone a repository', (done) => {
    const { cloneAllAssignments, progressBar: progressBarStub } = cloneScript.__private__;
    const exitCode = R.call(cloneAllAssignments, cadets);
    Promise.all(exitCode).then(() => {
      sinon.assert.calledOnce(progressBarStub.startStub);
      sinon.assert.calledTwice(progressBarStub.incrementStub);
      progressBarStub.startStub.reset();
      progressBarStub.incrementStub.reset();
      done();
    });
  });

  it('`startProgressBar` should start the progressBar', () => {
    const { startProgressBar, progressBar: progressBarStub } = cloneScript.__private__;
    R.call(startProgressBar, cadets);
    sinon.assert.calledOnce(progressBarStub.startStub);
    progressBarStub.startStub.reset();
  });

  it('`incrementProgressBar` should increment the progress bar', () => {
    const { incrementProgressBar, progressBar: progressBarStub } = cloneScript.__private__;
    R.call(incrementProgressBar);
    sinon.assert.calledOnce(progressBarStub.incrementStub);
    progressBarStub.incrementStub.reset();
  });

  it('`cloneRepo` should clone a repository for a user', (done) => {
    const { cloneRepo, progressBar: progressBarStub } = cloneScript.__private__;
    const exit = R.call(cloneRepo, 'Anthony.Gonsalvis');
    exit.then(() => {
      sinon.assert.calledOnce(progressBarStub.incrementStub);
      progressBarStub.incrementStub.reset();
      done();
    });
  });

  it('`clone` should get all the cadets and clone all the repositories', (done) => {
    const { clone } = cloneScript;
    const { progressBar: progressBarStub } = cloneScript.__private__;
    const exit = R.call(clone);
    exit.then(() => {
      sinon.assert.calledOnce(progressBarStub.startStub);
      sinon.assert.calledTwice(progressBarStub.incrementStub);
      done();
    });
  });
});
