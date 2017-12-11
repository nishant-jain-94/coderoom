/**
 * @fileOverview Loads all the Members of the group
 * @author Nishant Jain
 */

const request = require('request-promise');
const config = require('./config/config-file');

const { API_TOKEN, GITLAB_URL, GROUPS } = config.load();

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

const load = async () => {
  const membersOfGroup = await Promise.all(GROUPS.map(getMembersOfGroupAsync));
  const members = [].concat(...membersOfGroup);
  return members;
};

module.exports = {
  load,
};
