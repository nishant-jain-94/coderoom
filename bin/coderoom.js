#!/usr/bin/env node

/**
 * Main CLI which is used to run the reviewer.
 * @author Nishant Jain
 */

/* eslint no-console:off */
/* eslint global-require:off */

const usage = require('../lib/cli-usage.js');
const configInitializer = require('../lib/config/config-initializer');

const arg = process.argv[process.argv.length - 1];

switch (arg) {
  case 'initialize':
    configInitializer.initializeConfig();
    break;
  case 'members': {
    const members = require('../lib/members');
    members.load().then(membersOfGroup => console.log(membersOfGroup));
    break;
  }
  case 'clone': {
    const clone = require('../lib/clone');
    clone.cloneAllAssignments();
    break;
  }
  case 'generate-insights': {
    const insights = require('../lib/insights');
    insights.generateInsightsAsHTML();
    break;
  }
  case 'open-issue': {
    const issueOpener = require('../lib/open-issue');
    issueOpener.openIssues();
    break;
  }
  default:
    console.log(usage);
    break;
}
