#!/usr/bin/env node

/**
 * @fileOverview Main CLI which is used to run the reviewer.
 */

/* eslint no-console:off */
/* eslint global-require:off */
const R = require('ramda');
const usage = require('../lib/cli-usage.js');
const configInitializer = require('../lib/config/config-initializer.fp');

const arg = process.argv[process.argv.length - 1];

switch (arg) {
  case 'initialize':
    configInitializer.initializeConfig();
    break;
  case 'members': {
    const { getCadets } = require('../lib/members.fp');
    R.call(R.composeP(console.log, getCadets));
    break;
  }
  case 'clone': {
    const { clone } = require('../lib/clone.fp');
    R.call(clone);
    break;
  }
  case 'generate-insights': {
    const insights = require('../lib/insights.fp');
    insights.generateInsightsAsPDF();
    break;
  }
  case 'open-issue': {
    const issueOpener = require('../lib/open-issues.fp');
    issueOpener.openIssues();
    break;
  }
  default:
    console.log(usage);
    break;
}
