/**
 * @fileOverview Fixture for opn package
 */
const sinon = require('sinon');

/**
 * Stubs the open function of the opn npm package
 */
const opn = sinon.stub().returns({ pageOpened: true });

module.exports = opn;
