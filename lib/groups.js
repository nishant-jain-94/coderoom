/**
 * @fileOverview List all the groups on Gitlab
 * @author Nishant Jain
 */

const Gitlab = require('gitlab');
const memoize = require('./memoize');

/**
 * listAllGroups - Lists all the groups on Gitlab
 * which are visible to the current private_token
 * @param  {Object}  credentials Object containing url, token
 * @return {Promise}             Returns promise
 */
const listAllGroups = async (credentials) => {
  const gitlab = new Gitlab(credentials);
  const groups = await new Promise((resolve) => {
    gitlab.groups.all((gitlabGroups) => {
      const groupsList = gitlabGroups.map(gitlabGroup => ({
        name: gitlabGroup.name,
        value: gitlabGroup.id,
      }));
      resolve(groupsList);
    });
  });
  return groups;
};

/**
 * Memoizes listAllGroups so that repeated calls to listAllGroups
 * returns groups from cache.
 */
const memoizedListAllGroups = memoize(listAllGroups);

module.exports = memoizedListAllGroups;
