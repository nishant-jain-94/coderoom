/**
 * @fileOverview Unit tests for file-name.fp.js
 * @author Nishant Jain
 */
const path = require('path');
const should = require('should');
const {
  getPathToLocalConfig,
  getPathToGlobalConfig,
} = require('../../../lib/config/file-name.fp');

describe('lib/config/file-name.js', () => {
  it('Should return path to the global config', () => {
    const cwd = process.cwd();
    const expectedGlobalPath = path.join(cwd, 'lib/config/.reviewrc.global');
    const globalPath = getPathToGlobalConfig();
    should.exist(globalPath);
    globalPath.should.equal(expectedGlobalPath);
    globalPath.should.be.an.instanceOf(String);
  });

  it('Should return path to the local config', () => {
    const cwd = process.cwd();
    const expectedLocalPath = path.join(cwd, '.reviewrc');
    const localPath = getPathToLocalConfig();
    should.exist(localPath);
    localPath.should.be.an.instanceOf(String);
    localPath.should.equal(expectedLocalPath);
  });
});
