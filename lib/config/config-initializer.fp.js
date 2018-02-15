/**
 * @fileOverview Config initialization wizard
 * @author Nishant Jain
 */
const R = require('ramda');
const inquirer = require('inquirer');
const listGroups = require('../groups.fp');
const { getGlobalConfig, setConfig, setGlobalConfig } = require('./config-file.fp');

this._getQuestions = () => {
  const questions = [
    {
      type: 'input',
      name: 'REVIEWERS_NAME',
      message: 'What is your Name?',
      default: getGlobalConfig().REVIEWERS_NAME ? getGlobalConfig().REVIEWERS_NAME : 'Anthony Gonsalvis',
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
      default: answers => (getGlobalConfig()[answers.GITLAB_URL] ? getGlobalConfig()[answers.GITLAB_URL] : ''),
      validate: input => (!input ? 'API Token cannot be undefined' : true),
    },
    {
      type: 'checkbox',
      name: 'INCLUDED_GROUPS',
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
      name: 'EXCLUDED_GROUPS',
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
  return questions;
};

/**
 * Ask questions on console
 * @returns {Promise} The Promise with the results of the questions
 */
this._setConfigs = R.juxt([setConfig, setGlobalConfig]);
this._promptQuestions = R.compose(inquirer.prompt, this._getQuestions);
this.initializeConfig = () => R.call(R.composeP(this._setConfigs, this._promptQuestions));

module.exports = this;
