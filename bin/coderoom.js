#!/usr/bin/env node

/**
 * Main CLI which is used to run the reviewer.
 * @author Nishant Jain
 */

/* eslint no-console:off */
/* eslint global-require:off */

const clone = require('../lib/clone');
const members = require('../lib/members');
const insights = require('../lib/insights');
const usage = require('../lib/cli-usage.js');
const configInitializer = require('../lib/config/config-initializer');

const arg = process.argv[process.argv.length - 1];

switch (arg) {
  case 'initialize':
    configInitializer.initializeConfig();
    break;
  case 'members':
    members.load().then(membersOfGroup => console.log(membersOfGroup));
    break;
  case 'clone':
    clone.cloneAllAssignments();
    break;
  case 'insights': {
    const submissionInfo = insights.submissionInfo();
    submissionInfo.then(info => console.log(info));
    break;
  }
  case 'generate-insights': {
    insights.generateInsightsAsHTML();
    break;
  }
  default:
    console.log(usage);
    break;
}
