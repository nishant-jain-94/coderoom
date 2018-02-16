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

const { generateInsightsAsPDF } = proxyquire('../../lib/insights.fp', {
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
  it('should generateInsightsAsPDF', (done) => {
    const generatedPDF = R.call(generateInsightsAsPDF);
    generatedPDF.then(() => {
      sinon.assert.calledOnce(htmlPDFFixture.createStub);
      sinon.assert.calledOnce(htmlPDFFixture.toFileStub);
      done();
    }).catch(err => should.not.exist(err));
  });
});
