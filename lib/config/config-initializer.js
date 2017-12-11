/**
 * @fileOverview Config initialization wizard
 * @author Nishant Jain
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');
const inquirer = require('inquirer');
const listGroups = require('../groups');

const cwd = process.cwd();
const configFileName = require('./file-name.js');

/**
 * create .reviewrc file in the current directory
 * @param {Object} config object that contains configuration details
 */
const writeFile = (config) => {
  const yamlString = YAML.stringify(config, 2);
  fs.writeFileSync(path.join(cwd, configFileName), yamlString);
};

/**
 * Ask few questions on console
 * @returns {Promise} The Promise with the results of the questions
 */
const promptQuestions = () => {
  const questions = [
    {
      type: 'input',
      name: 'REVIEWERS_NAME',
      message: 'What is your Name?',
      default: 'Anthony Gonsalvis',
    },
    {
      type: 'input',
      name: 'API_TOKEN',
      message: 'What is your Gitlab API Token?',
      validate: input => (!input ? 'API Token cannot be undefined' : true),
    },
    {
      type: 'input',
      name: 'GITLAB_URL',
      message: 'What is the url to the Gitlab Server?',
      default: 'https://gitlab-cts.stackroute.in/',
    },
    {
      type: 'checkbox',
      name: 'GROUPS',
      message: 'Select all the teams which you would want to review?',
      choices: async (answers) => {
        const credentials = { url: answers.GITLAB_URL, token: answers.API_TOKEN };
        const groups = await listGroups(credentials);
        return groups;
      },
      when: (answers => !answers.api_token),
    },
    {
      type: 'checkbox',
      name: 'MENTORS',
      message: 'Select all the teams where mentors could be found?',
      choices: async (answers) => {
        const credentials = { url: answers.GITLAB_URL, token: answers.API_TOKEN };
        const groups = await listGroups(credentials);
        return groups;
      },
      when: (answers => !answers.api_token),
    },
    {
      type: 'input',
      name: 'ASSIGNMENT',
      message: 'What is the name of the assignment?',
      validate: input => (!input ? 'Assignment Name cannot be empty' : true),
    },
  ];
  return inquirer.prompt(questions).then(writeFile);
};

/**
 * Used to initialize config
 */
const initializeConfig = async () => {
  const config = await promptQuestions();
  return config;
};

module.exports = {
  initializeConfig,
};
