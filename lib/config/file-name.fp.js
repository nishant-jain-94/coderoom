/**
 * @fileOverview Returns path to local and global config for the coderoom
 */

const path = require('path');

const cwd = process.cwd();
const CONFIG_FILE_NAME = '.reviewrc';
const GLOBAL_CONFIG_FILE_NAME = '.reviewrc.global';

/**
 * Returns the local config used for coderoom
 * @returns {string} path
 */
const getPathToLocalConfig = () => path.join(cwd, CONFIG_FILE_NAME);

/**
 * Returns the global config used for coderoom
 * @returns {string} path
 */
const getPathToGlobalConfig = () => path.join(__dirname, GLOBAL_CONFIG_FILE_NAME);

module.exports = {
  getPathToLocalConfig,
  getPathToGlobalConfig,
};
