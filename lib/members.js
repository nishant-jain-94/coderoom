/**
 * @fileOverview Loads all the Members of the group
 */

const _ = require('lodash');
const request = require('request-promise');
const config = require('./config/config-file');

/**
 * Get all the members of the Group
 * @param  {[type]} groupId Refers to the Group on Gitlab
 * @return {[Members]}      Returns a list of Members present in a Group
 */
const getMembersOfGroupAsync = async (gitlabUrl, apiToken, groupId) => {
  const options = {
    uri: `${gitlabUrl}/api/v3/groups/${groupId}/members`,
    qs: {
      private_token: apiToken,
      per_page: 1000,
    },
    json: true,
  };
  const membersOfGroup = await request(options);
  return membersOfGroup;
};

/**
 * Loads all the members of the Groups.
 * It iterates over each group and collects all the users.
 * @return {[Members]} Refers to all the members in all the groups
 */
const load = async () => {
  const {
    API_TOKEN,
    GITLAB_URL,
    INCLUDED_GROUPS,
    EXCLUDED_GROUPS,
  } = config.load();
  const membersOfGroup = await Promise.all(INCLUDED_GROUPS.map(getMembersOfGroupAsync.bind(null, GITLAB_URL, API_TOKEN)));
  const members = [].concat(...membersOfGroup);
  // console.log(members);
  const mentorsGroup = await Promise.all(EXCLUDED_GROUPS.map(getMembersOfGroupAsync.bind(null, GITLAB_URL, API_TOKEN)));
  const mentors = [].concat(...mentorsGroup);
  const cadets = _.differenceBy(members, mentors, 'username');
  return cadets;
};

module.exports = {
  load,
};
