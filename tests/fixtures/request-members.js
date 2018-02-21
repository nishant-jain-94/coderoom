/**
 * @fileOverview Fixure for the request module
 */
const sinon = require('sinon');
const cadets = require('../fixtures/cadets.json');

/**
 * Fakes the request module with a stub
 */
const request = sinon.stub().returns(Promise.resolve(cadets));

module.exports = request;
