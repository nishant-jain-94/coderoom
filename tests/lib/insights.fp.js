/**
 * @fileOvervier Unit Tests for Insights
 */
const R = require('ramda');
const sinon = require('sinon');
const should = require('should');
const proxyquire = require('proxyquire');
const htmlPDFFixture = require('../fixtures/html-pdf');
const shellJSFixture = require('../fixtures/shell.js');
const cadetsFixtures = require('../fixtures/cadets.json');
const configFixtures = require('../fixtures/load-config.json');
const log = require('../../logger')('insights');

const insights = proxyquire('../../lib/insights.fp', {
  'html-pdf': {
    create: htmlPDFFixture.create,
  },
  './members.fp': {
    getCadets: () => Promise.resolve(cadetsFixtures),
  },
  './config/config-file.fp': {
    getConfig: () => configFixtures,
  },
  shelljs: shellJSFixture,
});

describe('Insights', () => {
  it('Should get the submission info', (done) => {
    const { getSubmissionsInfo } = insights.__private__;
    const submissionInfoP = R.call(getSubmissionsInfo);
    const submissionInfoProps = [
      'totalMembers',
      'totalDefaultedMembers',
      'totalSubmittedMembers',
      'defaultedMembers',
      'submittedMembers',
      'generatedOn',
      'assignmentName',
    ];
    submissionInfoP.then((submissionInfo) => {
      should.exist(submissionInfo);
      submissionInfo.should.have.properties(submissionInfoProps);
      submissionInfo.totalMembers.should.be.exactly(2);
      submissionInfo.totalDefaultedMembers.should.be.exactly(0);
      submissionInfo.totalSubmittedMembers.should.be.exactly(2);
      submissionInfo.defaultedMembers.should.be.empty();
      submissionInfo.submittedMembers.should.not.be.empty();
      submissionInfo.assignmentName.should.be.exactly('BootstrapAssignment');
      done();
    }).catch(err => log.error(err));
  });

  it('should generateInsightsAsPDF', (done) => {
    const generatedPDF = R.call(insights.generateInsightsAsPDF);
    generatedPDF.then(() => {
      sinon.assert.calledOnce(htmlPDFFixture.createStub);
      sinon.assert.calledOnce(htmlPDFFixture.toFileStub);
      done();
    }).catch(err => should.not.exist(err));
  });
});
