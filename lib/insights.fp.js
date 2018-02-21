/**
 * @fileOverview Generates Insights as PDF document
 */
const R = require('ramda');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const shell = require('shelljs');
const { getCadets } = require('./members.fp');
const dateTime = require('date-time');
const Mustache = require('mustache');
const { getConfig } = require('./config/config-file.fp');

/**
 * Gets the insights template from the defined path
 * @returns {string} templateString
 */
const getInsightsTemplate = () => fs.readFileSync(path.join(__dirname, '../reports/templates/insights.mst'), 'utf8');

/**
 * Gets the name of the assignment from the config
 * @returns {string} assignmentName
 */
const getAssignment = R.compose(R.prop('ASSIGNMENT'), getConfig);

/**
 * Gets the list of cloned repositories
 * @returns {Array} listOfClonedRepositories
 */
const getClonedRepos = () => shell.ls('-d', '*/').map(assignment => assignment).map(s => s.substring(0, s.length - 1));

/**
 * Given a list of members it calculates the difference
 * of members between both the list
 * @param {Array<member>}
 * @returns {Array<member>}
 */
const getDiffBetCadetsAndClonedRepos = R.composeP(
  R.difference(R.__, R.call(getClonedRepos)),
  R.map(R.prop('username')),
  getCadets,
);

/**
 * Summarized the submission information
 * @returns {Promise<SubmissionInfo>}
 */
const getSubmissionsInfo = async () => {
  const defaultedMembers = await R.call(getDiffBetCadetsAndClonedRepos);
  const submittedMembers = getClonedRepos();
  const submissionInfo = {
    totalMembers: R.add(R.length(defaultedMembers), R.length(submittedMembers)),
    totalDefaultedMembers: R.length(defaultedMembers),
    totalSubmittedMembers: R.length(submittedMembers),
    defaultedMembers,
    submittedMembers,
    assignmentName: R.call(getAssignment),
    generatedOn: dateTime(),
  };
  return submissionInfo;
};

/**
 * Curries the to_html method of the Mustache.
 * Takes a Mustache Template and applies the object
 * onto it.
 * @param {mustacheTemplate}
 * @param {Object}
 * @returns {html} HTML as string
 */
const curriedTemplateToHtml = R.curry((temp, data) => Mustache.to_html(temp, data));

/**
 * Given submission info applies the submission info
 * to the insights template.
 * @param {SubmissionInfo}
 */
const insightsToHtml = R.call(R.compose(curriedTemplateToHtml, getInsightsTemplate));

/**
 * Generates Insight as HTML
 */
const generateInsightsAsHTML = R.composeP(
  R.compose(Promise.resolve.bind(Promise), insightsToHtml),
  getSubmissionsInfo,
);

/**
 * Creates a pdf given an html string
 * @param {string} outputPath Path where pdf is to be generated
 * @param {string} htmlString
 */
const createPDF = R.curry((outputPath, htmlString) =>
  new Promise((resolve, reject) => {
    pdf.create(htmlString)
      .toFile(outputPath, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  }));

/**
 * Generates Insights as PDF
 */
const generateInsightsAsPDF = R.composeP(
  R.call(createPDF, path.join(process.cwd(), 'insights.pdf')),
  generateInsightsAsHTML,
);

module.exports = {
  generateInsightsAsPDF,
  __private__: {
    getSubmissionsInfo,
    createPDF,
  },
};
