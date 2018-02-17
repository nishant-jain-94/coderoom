/**
 * @fileOverview Clones the Submissions of the cadets
 */
const R = require('ramda');
const shell = require('shelljs');
const Progress = require('cli-progress');
const { getCadets } = require('./members.fp');
const { getConfig } = require('./config/config-file.fp');

/**
 * A progress bar to show the status of completion
 */
const progressBar = new Progress.Bar(
  {
    stopOnComplete: true,
    format: 'Cloning Assignments [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
  },
  Progress.Presets.shades_classic,
);

/**
 * Gets a Gitlab Url from the config
 * and trims the protocol substring
 * @param {String} url
 */
const getUrlWithNoProtocol = R.compose(
  R.replace(/^https?:\/\//i, ''),
  R.slice(0, -1),
  R.prop('GITLAB_URL'),
  getConfig,
);

/**
 * Builds a git clone command for a given url,
 * assignment and a member. This function is
 * curried so that it can be partially
 * applied.
 * @param {String} url
 * @param {String} assignment
 * @param {String} member
 */
const buildCloneCmd =
  R.curry((url, assignment, member) =>
    `git clone git@${url}:${member}/${assignment}.git ${member}`);

/**
 * Builds a clone command for a given assignment and member
 * over GitlabUrl fetched from the config
 * @param {String} assignment
 * @param {String} member
 */
const buildCloneCmdWithGitlabUrl = R.call(buildCloneCmd, R.call(getUrlWithNoProtocol));

/**
 * Gets the name of the Assignment from the config.
 */
const getAssignment = R.compose(R.prop('ASSIGNMENT'), getConfig);

/**
 * Build a clone command for a given member
 * over the GitlabUrl and Assignment from the config
 * @param {String} Member
 */
const buildCloneCmdWithGitlabUrlOverAssignment = R.call(
  buildCloneCmdWithGitlabUrl,
  R.call(getAssignment),
);

/**
 * Deletes All the directories(repos) in the current working directory.
 */
const deleteExistingRepos = () => shell.rm('-Rf', '*/');


/**
 * Initializes the Progress Bar to the total length of the members.
 * And starts at 0.
 * @param {*} members
 */
const startProgressBar = members => progressBar.start(members.length, 0);

/**
 * Updates the progress bar incrementally
 */
const incrementProgressBar = () => progressBar.increment();

/**
 * Promisfies the exec command on shelljs
 * @param {*} options
 * @param {*} command
 */
const promisifiedShellExecCmd = (options, command) => new Promise((resolve, reject) => {
  shell.exec(command, options, (code, stdout, stderr) => {
    if (!code) {
      resolve(stdout);
    } else {
      const error = {
        command,
        message: R.replace(/(\r\n|\n|\r)/gm, '', stderr),
      };
      reject(error);
    }
  });
}).catch(err => console.log(err));

/**
 * Curries the exec function of the shelljs library by reversing
 * the order of the variables.
 * @param {object} options
 * @param {string} command
 */
const curriedExecCommand = R.curry(promisifiedShellExecCmd);

/**
 * Given a member it clones the assignment in the current working directory
 * @param {String} username
 */
const cloneRepo = R.compose(
  R.composeP(incrementProgressBar, curriedExecCommand({ silent: true, async: true })),
  buildCloneCmdWithGitlabUrlOverAssignment,
);

/**
 * Clones all the assignments of the cadets
 * in the current working directory
 * @param {Array} Members
 */
const cloneAllAssignments = R.compose(
  R.map(cloneRepo),
  R.flatten,
  R.takeLast(1),
  R.juxt([startProgressBar, R.identity]),
  R.pluck('username'),
);

/**
 * Checks if git is installed
 */
const checkIfGitExists = () => !shell.which('git').code;

/**
 * On calling this method it throws an error that Git doesn't exists.
 */
const throwGitDoesntExists = () => {
  throw Error("package 'git' could not be found. Coderoom depends on 'GIT'");
};

/**
 * An entry point to clone all Assignments
 */
const clone = R.ifElse(
  checkIfGitExists,
  R.compose(R.composeP(cloneAllAssignments, getCadets), deleteExistingRepos),
  throwGitDoesntExists,
);

module.exports = {
  clone,
  __private__: {
    progressBar,
    cloneRepo,
    getAssignment,
    buildCloneCmd,
    startProgressBar,
    checkIfGitExists,
    curriedExecCommand,
    deleteExistingRepos,
    cloneAllAssignments,
    getUrlWithNoProtocol,
    throwGitDoesntExists,
    incrementProgressBar,
    promisifiedShellExecCmd,
    buildCloneCmdWithGitlabUrl,
    buildCloneCmdWithGitlabUrlOverAssignment,
  },
};
