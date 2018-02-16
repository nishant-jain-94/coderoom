/**
 * @fileOverview List all the groups on Gitlab
 * @author Nishant Jain
 */

const R = require('ramda');
const Gitlab = require('gitlab');
const { promisify } = require('util');

/**
 * Given gitlab credentials creates a new Gitlab instance
 * @param {*} credentials
 */
const getGitlabInstance = credentials => new Gitlab(credentials);

/**
 * Given a gitlab instance it fetches all the user groups
 * @param {*} gitlab
 */
const listAllGroups = gitlab => new Promise((resolve) => {
  gitlab.groups.all(groups => resolve(groups));
});

/**
 * Given a group it transforms it to a choice
 * @param {*} group
 */
const transformGroupsAsChoice = group => ({ name: group.name, value: group.id });

/**
 * Gets all the groups as choices.
 */
const getAllGroupsAsChoices = R.compose(
  R.composeP(
    R.compose(
      Promise.resolve.bind(Promise),
      R.map(transformGroupsAsChoice),
    ),
    listAllGroups,
  ),
  getGitlabInstance,
);

/**
 * Memoizes listAllGroups so that repeated calls to listAllGroups
 * returns groups from cache.
 */
module.exports = getAllGroupsAsChoices;
