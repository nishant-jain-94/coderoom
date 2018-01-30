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
const { CONFIG_FILE_NAME, GLOBAL_CONFIG_FILE_NAME } = require('./file-name');

const globalConfig = require('./config-file').loadGlobalConfig();

/**
 * create .reviewrc file in the current directory
 * @param {Object} config object that contains configuration details
 */
const writeFile = (config) => {
  const yamlConfigString = YAML.stringify(config, 2);

  // Creating a Global Config containing common details to be shared between all the coderooms
  globalConfig.REVIEWERS_NAME = config.REVIEWERS_NAME;
  globalConfig[config.GITLAB_URL] = config.API_TOKEN;
  const yamlGlobalConfigString = YAML.stringify(globalConfig, 2);

  fs.writeFileSync(path.join(cwd, CONFIG_FILE_NAME), yamlConfigString);
  fs.writeFileSync(path.join(__dirname, GLOBAL_CONFIG_FILE_NAME), yamlGlobalConfigString);
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
      default: globalConfig.REVIEWERS_NAME ? globalConfig.REVIEWERS_NAME : 'Anthony Gonsalvis',
    },
    {
      type: 'input',
      name: 'GITLAB_URL',
      message: 'What is the url to the Gitlab Server?',
      default: 'https://gitlab-cts.stackroute.in/',
    },
    {
      type: 'input',
      name: 'API_TOKEN',
      message: 'What is your Gitlab API Token?',
      default: answers => (globalConfig[answers.GITLAB_URL] ? globalConfig[answers.GITLAB_URL] : ''),
      validate: input => (!input ? 'API Token cannot be undefined' : true),
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
