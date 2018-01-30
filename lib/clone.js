/**
 * @fileOverview Clones all the assignments matching in the configuration
 * @author Nishant Jain
 */

const shell = require('shelljs');
const { GITLAB_URL, ASSIGNMENT } = require('./config/config-file.js').load();
const memberLoader = require('./members.js');
const ProgressBar = require('cli-progress-bar');

const bar = new ProgressBar();
// Removes the protocol, in this case removes `https`
const urlWithNoProtocol = GITLAB_URL.slice(0, -1).replace(/^https?:\/\//i, '');

/**
 * Clones the assignment from gitlab
 * @param {*} member
 */
const clone = (member) => {
  const cmd = `git clone git@${urlWithNoProtocol}:${member}/${ASSIGNMENT}.git ${member}`;
  const statusCode = shell.exec(cmd).code;
  return statusCode;
};

/**
 * Removes the assignment to make sure that the git clones doesn't throw error.
 * @param {*} directory
 */
const removeExistingAssignment = (directory) => {
  const statusCode = shell.rm('-rf', directory).code;
  return statusCode;
};

/**
 * Clones all the assignments which the reviewer is a part of
 */
const cloneAllAssignments = async () => {
  if (!shell.which('git')) {
    throw Error("package 'git' could not be found. Coderoom depends on 'GIT'");
  }
  const members = await memberLoader.load();
  let completed = 0;
  const incrementFactor = 1 / members.length;
  bar.show('Cloning Assignments', completed * incrementFactor);
  members.forEach(({ username }) => {
    removeExistingAssignment(username);
    clone(username);
    completed += 1;
    bar.show(`Cloned ${username}'s Assignment`, completed * incrementFactor);
  });
};

module.exports = {
  cloneAllAssignments,
};
