/**
 * @fileOverview Usage Guide for Classroom
 * @author Nishant Jain
 */

const getUsage = require('command-line-usage');

const sections = [
  {
    header: 'Coderoom',
    content: 'A Review Utility Tool for Gitlab which facilitates in code reviewing easily.',
  },
  {
    header: 'Command List',
    content: [
      { name: 'help', summary: 'Displays a usage guide' },
      { name: 'version', summary: 'Displays the version of the review utility' },
      { name: 'initialize', summary: 'Initialize the repository with runtime configuration for the review utility' },
      { name: 'clone', summary: 'Clones all the assignments in the local submissions folder' },
      { name: 'members', summary: 'Lists all the members under review in the coderoom' },
      { name: 'open-issue', summary: 'Opens the issue on the repository, when executed inside a submission' },
      { name: 'generate-insights', summary: 'Generates coderoom insights' },
    ],
  },
];

module.exports = getUsage(sections);
