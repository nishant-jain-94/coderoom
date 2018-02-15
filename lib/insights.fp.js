const R = require('ramda');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const shell = require('shelljs');
const { getCadets } = require('./members.fp');
const dateTime = require('date-time');
const Mustache = require('mustache');
const { getConfig } = require('./config/config-file.fp');


const insightsTemplatePath = path.join(__dirname, '../reports/templates/insights.mst');

const getInsightsTemplate = () => fs.readFileSync(insightsTemplatePath, 'utf8');

const getAssignment = R.compose(R.prop('ASSIGNMENT'), getConfig);

const getClonedRepos = () => shell.ls('-d', '*/').map(assignment => assignment);

const compareByUserName = (x, y) => x.username === y.username;

const getDiffInCadetsByUsername = R.composeP(R.differenceWith(compareByUserName), getCadets);

const getDefaultMembers = R.compose(getDiffInCadetsByUsername, getClonedRepos);

const getSubmissionsInfo = async () => {
  const defaultedMembers = await R.call(getDefaultMembers);
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

const curriedTemplateToHtml = R.curry(Mustache.to_html.bind(Mustache));

const insightsToHtml = R.compose(curriedTemplateToHtml, getInsightsTemplate);

const generateInsightsAsHTML = R.composeP(
  R.compose(Promise.resolve.bind(Promise), insightsToHtml), 
  getSubmissionsInfo,
);

const generateInsightsAsPDF = async () => {
  const insightsHTML = await generateInsightsAsHTML();
  pdf.create(insightsHTML).toFile(path.join(process.cwd(), 'insights.pdf'), (err, res) => {
    console.log(err);
    console.log(res);
  });
};

module.exports = {
  generateInsightsAsPDF,
};
