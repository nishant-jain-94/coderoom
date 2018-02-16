/**
 * @fileOverview Opens the issues page of the assignment of the current user.
 */
const R = require('ramda');
const opn = require('opn');
const shelljs = require('shelljs');

/**
 * Gets the remote origin from the assignment
 */
const getRemoteOriginOfAssignment = () => shelljs.exec('git config --get remote.origin.url', { silent: true }).stdout;

/**
 * Transform the ssh origin to a url
 * pointing to the new issues page of
 * the current assignment
 * @param {string} origin
 * @returns {string} urlToIssuesPage
 */
const transformRemoteOriginToUrl = origin => `http://${origin.split('@')[1].replace(':', '/').replace('.git', '')}/issues/new`;

/**
 * Curries the opn function and
 * reverses the argument
 * @param {target}
 * @param {options}
 */
const curriedOpn = R.curry((options, target) => opn(target, options));

/**
 * Gets the git's remote origin and opens the issues page
 */
const openIssues = R.compose(
  R.call(curriedOpn, { wait: false }),
  transformRemoteOriginToUrl,
  getRemoteOriginOfAssignment,
);

module.exports = {
  openIssues,
};
