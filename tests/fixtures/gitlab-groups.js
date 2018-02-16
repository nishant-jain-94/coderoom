/**
 * @fileOverview Creates a fake Gitlab class
 * with the intent to fake groups.all
 * method of the original gitlab package.
 */
const sinon = require('sinon');
const groups = require('./groups.json');

class Gitlab {
  constructor(credentials) {
    this.credentials = credentials;
    this.allGroupsStub = sinon.stub().yields(null, groups);
    this.groups = {
      all: this.allGroupsStub,
    };
  }
}

module.exports = Gitlab;
