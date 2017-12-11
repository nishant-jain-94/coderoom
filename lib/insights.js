/**
 * @fileOverview Generates Insights
 * @author Nishant Jain
 */

/* eslint no-param-reassign: ["error", { "props": false }] */

const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const shell = require('shelljs');
const members = require('./members');
const dateTime = require('date-time');
const Mustache = require('mustache');

const cwd = process.cwd();
const insightsTemplatePath = path.join(__dirname, '../reports/templates/insights.mst');
const insightsTemplate = fs.readFileSync(insightsTemplatePath, 'utf8');

const { ASSIGNMENT } = require('./config/config-file').load();

/**
 * submissionInfo gets all the information about the submissions.
 * @return {Promise} Returns totalMembers, listOfMembersYetToSubmitAssignment,
 * listOfSubmittedAssignments, totalMembersYetToSubmitAssignment, totalMembersSubmittedAssignment
 */
const submissionInfo = async () => {
  const membersOfGroup = await members.load();
  const totalMembers = membersOfGroup.length;
  const listOfSubmittedAssignments = shell.ls('-d', '*/').map(assignment => assignment);
  const setOfSubmittedAssignments = new Set(listOfSubmittedAssignments);
  const initialValue = {
    totalMembers,
    totalMembersSubmittedAssignment: 0,
    totalMembersYetToSubmitAssignment: 0,
    listOfMembersYetToSubmitAssignment: [],
    listOfMembersSubmittedAssignments: [],
  };
  const submissions = membersOfGroup.reduce((accumulator, member) => {
    if (setOfSubmittedAssignments.has(`${member.username}/`)) {
      accumulator.totalMembersSubmittedAssignment += 1;
      accumulator.listOfMembersSubmittedAssignments.push(member);
    } else {
      accumulator.totalMembersYetToSubmitAssignment += 1;
      accumulator.listOfMembersYetToSubmitAssignment.push(member);
    }
    return accumulator;
  }, initialValue);
  return submissions;
};

const generateInsightsAsHTML = async () => {
  const summary = await submissionInfo();
  summary.assignmentName = ASSIGNMENT;
  summary.generatedOn = dateTime();
  const insights = Mustache.to_html(insightsTemplate, summary);
  pdf.create(insights).toFile(path.join(cwd, 'insights.pdf'), (err, res) => {
    console.log(err);
    console.log(res);
  });
};

module.exports = {
  submissionInfo,
  generateInsightsAsHTML,
};
