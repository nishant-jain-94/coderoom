/**
 * @fileOverview Gets all the visible assignments from Gitlab
 * @author Nishant Jain
 */

const config = require('./config/config-file');
const request = require('request-promise');

const { API_TOKEN, GITLAB_URL, ASSIGNMENT } = config.load();

const load = async () => {
  const options = {
    uri: `${GITLAB_URL}/api/v3/projects?search=${ASSIGNMENT}`,
    qs: {
      private_token: API_TOKEN,
      per_page: 1000,
    },
    json: true,
  };
  const projects = await request(options);
  const assignments = projects.filter(project => project.name === ASSIGNMENT);
  return assignments;
};

module.exports = {
  load,
};
