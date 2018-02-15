const path = require('path');

const cwd = process.cwd();
const CONFIG_FILE_NAME = '.reviewrc';
const GLOBAL_CONFIG_FILE_NAME = '.reviewrc.global';

const getPathToLocalConfig = () => path.join(cwd, CONFIG_FILE_NAME);
const getPathToGlobalConfig = () => path.join(__dirname, GLOBAL_CONFIG_FILE_NAME);

module.exports = {
  getPathToLocalConfig,
  getPathToGlobalConfig,
};
