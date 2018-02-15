/**
 * @fileOverview Loads all the Members of the group
 * @author Nishant Jain
 */
const R = require('ramda');
const request = require('request-promise-native');
const { getConfig } = require('./config/config-file.fp');

/**
 * Makes a request with the given parameters
 * @param {Options} reqOptions
 * @returns {Future}
 */
const makeRequest = reqOptions => request(reqOptions).catch(err => console.log(err));

/**
 * Build request options
 * @param {*} property
 * @param {*} config
 */
const buildReqOptsWith = (property, config) => R.map(groupId => ({
  uri: `${config.GITLAB_URL}api/v3/groups/${groupId}/members`,
  qs: {
    private_token: config.API_TOKEN,
    per_page: 1000,
  },
  json: true,
}), config[property]);

/**
 * Curried Version of `buildReqOptsWith`
 */
const curriedBuildReqOptsWith = R.curry(buildReqOptsWith);
const buildReqOptsWithInclGroups = curriedBuildReqOptsWith('INCLUDED_GROUPS');
const buildReqOptsWithExclGroups = curriedBuildReqOptsWith('EXCLUDED_GROUPS');

/**
 * Given a group it fetches all the members from it
 * @param {*} group
 */
const fetchMembers = R.compose(Promise.all.bind(Promise), R.map(makeRequest));

/**
 * Compares two objects bases on the property username
 * @param {Object} a
 * @param {Object} b
 */

const compareByUsername = (a, b) => a.username === b.username;

/**
 * Takes an array and resolves to a flattened array.
 * @param {Promise}
 */
const flattenArray = R.compose(Promise.resolve.bind(Promise), R.flatten);

/**
 * Given a set of members removes members to be excluded
 * @param {*} members
 */
const removeExcludedMembers = members => R.call(R.compose(
  R.composeP(
    Promise.resolve.bind(Promise),
    R.differenceWith(compareByUsername, members),
    flattenArray,
    fetchMembers,
  ),
  buildReqOptsWithExclGroups,
  getConfig,
));

/**
 * Gets cadets from the gitlab
 */
const getCadets = R.compose(
  R.composeP(removeExcludedMembers, flattenArray, fetchMembers),
  buildReqOptsWithInclGroups,
  getConfig,
);


module.exports = {
  getCadets,
};
