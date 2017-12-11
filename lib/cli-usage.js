/**
 * @fileOverview Usage Guide for Classroom
 * @author Nishant Jain
 */

const getUsage = require('command-line-usage');

const sections = [
  {
    header: 'Coderoom',
    content: 'A Review Utility Tool for Large Teams which facilitates in reviewing the code easily',
  },
  {
    header: 'Command List',
    content: [
      { name: 'initialize', summary: 'Initialize the repository with runtime configuration for the review utility' },
      { name: 'help', summary: 'Displays a usage guide' },
      { name: 'version', summary: 'Displays the version of the review utility' },
      { name: 'clone', summary: 'Clones all the assignments in the local submissions folder' },
    ],
  },
];

module.exports = getUsage(sections);
