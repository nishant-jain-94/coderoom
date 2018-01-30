/**
 * @fileOverview Loads all the Members of the group
 * @author Nishant Jain
 */

const _ = require('lodash');
const request = require('request-promise');
const config = require('./config/config-file');

const {
  API_TOKEN, GITLAB_URL, GROUPS, MENTORS,
} = config.load();

/**
 * Get all the members of the Group
 * @param  {[type]} groupId Refers to the Group on Gitlab
 * @return {[Members]}      Returns a list of Members present in a Group
 */
const getMembersOfGroupAsync = async (groupId) => {
  const options = {
    uri: `${GITLAB_URL}/api/v3/groups/${groupId}/members`,
    qs: {
      private_token: API_TOKEN,
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
  const membersOfGroup = await Promise.all(GROUPS.map(getMembersOfGroupAsync));
  const members = [].concat(...membersOfGroup);
  const mentorsGroup = await Promise.all(MENTORS.map(getMembersOfGroupAsync));
  const mentors = [].concat(...mentorsGroup);
  const cadets = _.differenceBy(members, mentors, 'username');
  return cadets;
};

module.exports = {
  load,
};
