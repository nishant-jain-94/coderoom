/**
 * @fileOverview Clones all the assignments matching in the configuration
 * @author Nishant Jain
 */

const shell = require('shelljs');
const { GITLAB_URL } = require('./config/config-file.js').load();
const ProgressBar = require('cli-progress-bar');

const bar = new ProgressBar();
const urlNoProtocol = GITLAB_URL.slice(0, -1).replace(/^https?:\/\//i, '');

/**
 * Clones the assignment from gitlab
 * @param {*} assignment
 */
const clone = (assignment) => {
  const cmd = `git clone git@${urlNoProtocol}:${assignment.path_with_namespace}.git ${assignment.owner.username}`;
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
    throw Error("package 'git' could not be found");
  }
  const assignments = await require('./assignments.js').load();
  let completed = 0;
  const incrementFactor = 1 / assignments.length;
  bar.show('Cloning Assignments', completed * incrementFactor);
  assignments.forEach((assignment) => {
    removeExistingAssignment(assignment.owner.username);
    clone(assignment);
    completed += 1;
    bar.show(`Cloned ${assignment.owner.username}'s Assignment`, completed * incrementFactor);
  });
};

module.exports = {
  cloneAllAssignments,
};
