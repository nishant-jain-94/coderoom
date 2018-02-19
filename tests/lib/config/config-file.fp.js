/**
 * @fileOverview Unit Tests for configFile
 * @author Nishant Jain
 */

const R = require('ramda');
const path = require('path');
const sinon = require('sinon');
const should = require('should');
const proxyquire = require('proxyquire');
const configFile = require('../../../lib/config/config-file.fp');
const mockConfig = require('../..//fixtures/load-config.json');

const {
  returnEmptyObject,
  throwConfigFileNotFound,
  yamlStringifyTo2Spaces,
  transformToGlobalConfig,
} = configFile.__private__;

const getGlobalMockConfig = () => {
  const mockGlobalConfig = {
    REVIEWERS_NAME: 'Anthony Gonsalvis',
    'https://gitlab-cts.stackroute.in/': 'pKZosz1ke344Hzgxkv4E',
  };
  return mockGlobalConfig;
};

describe('lib/config/config-file', () => {
  it('`.returnEmptyObject` Should return empty object', () => {
    const obj = returnEmptyObject();
    should.exist(obj);
    obj.should.be.empty();
  });

  it('`throwConfigFileNotFound` should throwConfigFileNotFound', () => {
    try {
      const file = throwConfigFileNotFound();
      should.not.exist(file);
    } catch (err) {
      should.exist(err);
      err.should.have.property('message');
      err.message.should.be.exactly("The configuration file .reviewrc cannot be found. Use 'coderoom initialize' command to initialize coderoom in the folder");
    }
  });

  it('`yamlStringifyTo2Spaces` should convert a config into yaml format', () => {
    const config = { foo: 'bar' };
    const yamlStringifiedConfig = yamlStringifyTo2Spaces(config);
    should.exist(yamlStringifiedConfig);
    yamlStringifiedConfig.should.be.an.instanceOf(String);
    yamlStringifiedConfig.should.be.exactly('foo: bar\n');
  });

  it('`loadConfig` should load the config object from the supplied configFile', () => {
    const yamlLoadStub = () => mockConfig;
    const proxifiedConfig = proxyquire('../../../lib/config/config-file.fp', {
      yamljs: {
        load: yamlLoadStub,
      },
    });
    const errorHandler = () => ({});
    const configFilePath = path.join(process.cwd(), 'lib/config/.reviewrc.global');
    const { loadConfig } = proxifiedConfig.__private__;
    const loadedConfig = R.call(loadConfig, errorHandler, configFilePath);
    should.exist(loadedConfig);
    loadedConfig.should.be.exactly(mockConfig);
    loadedConfig.should.be.an.instanceOf(Object);
  });

  it('`loadConfig` should execute `errorHandler` incase of configFile not found', () => {
    const yamlLoadStub = () => null;
    const proxifiedConfig = proxyquire('../../../lib/config/config-file.fp', {
      yamljs: {
        load: yamlLoadStub,
      },
    });
    const errorHandler = () => ({});
    const configFilePath = path.join(process.cwd(), 'lib/config/.reviewrc');
    const { loadConfig } = proxifiedConfig.__private__;
    const loadedConfig = R.call(loadConfig, errorHandler, configFilePath);
    should.exist(loadedConfig);
    loadedConfig.should.be.empty();
    loadedConfig.should.an.instanceOf(Object);
  });

  it('`loadConfigDefaultingToEmptyObject` should return empty object incase of config file not found and should return config if the config file is present', () => {
    const yamlLoadStub = () => mockConfig;
    const proxifiedConfig = proxyquire('../../../lib/config/config-file.fp', {
      yamljs: {
        load: yamlLoadStub,
      },
    });
    const wrongConfigFilePath = path.join(process.cwd(), 'lib/config/.reviewrc');
    const { loadConfigDefaultingToEmptyObject } = proxifiedConfig.__private__;
    const loadedConfigInCaseOfFileNotFound = R.call(
      loadConfigDefaultingToEmptyObject,
      wrongConfigFilePath,
    );
    should.exist(loadedConfigInCaseOfFileNotFound);
    loadedConfigInCaseOfFileNotFound.should.be.empty();
    loadedConfigInCaseOfFileNotFound.should.be.an.instanceOf(Object);
    const configFilePath = path.join(process.cwd(), 'lib/config/.reviewrc.global');
    const loadedConfig = R.call(loadConfigDefaultingToEmptyObject, configFilePath);
    should.exist(loadedConfig);
    loadedConfig.should.not.be.empty();
    loadedConfig.should.be.exactly(mockConfig);
    loadedConfig.should.be.an.instanceOf(Object);
  });

  it('`loadConfigDefaultingToError` should return the config if the config file path is found and throw error if its not found', () => {
    const yamlLoadStub = () => mockConfig;
    const proxifiedConfig = proxyquire('../../../lib/config/config-file.fp', {
      yamljs: {
        load: yamlLoadStub,
      },
    });
    const wrongConfigFilePath = path.join(process.cwd(), 'lib/config/.reviewrc');
    const { loadConfigDefaultingToError } = proxifiedConfig.__private__;
    try {
      const loadedConfigInCaseOfFileNotFound = R.call(
        loadConfigDefaultingToError,
        wrongConfigFilePath,
      );
      should.not.exist(loadedConfigInCaseOfFileNotFound);
    } catch (err) {
      should.exist(err);
      err.message.should.be.exactly('The configuration file .reviewrc cannot be found. Use \'coderoom initialize\' command to initialize coderoom in the folder');
    }
    const configFilePath = path.join(process.cwd(), 'lib/config/.reviewrc.global');
    const loadedConfig = R.call(loadConfigDefaultingToError, configFilePath);
    should.exist(loadedConfig);
    loadedConfig.should.be.exactly(mockConfig);
  });

  it('should transformLocalConfig', () => {
    const transformedConfig = transformToGlobalConfig(mockConfig);
    should.exist(transformedConfig);
    transformedConfig.should.not.be.empty();
    transformedConfig.should.have.property('REVIEWERS_NAME', 'Anthony Gonsalvis');
    transformedConfig.should.have.property('https://gitlab-cts.stackroute.in/', 'pKZosz1ke344Hzgxkv4E');
  });

  it('should get and set config', () => {
    const yamlMockConfigStringified = yamlStringifyTo2Spaces(mockConfig);
    const writeFileSyncStub = sinon.stub().returns(yamlMockConfigStringified);
    const proxifiedConfig = proxyquire('../../../lib/config/config-file.fp', {
      fs: {
        existsSync: () => true,
        writeFileSync: writeFileSyncStub,
      },
      yamljs: {
        load: () => mockConfig,
      },
    });
    const writtenConfig = R.call(proxifiedConfig.setConfig, mockConfig);
    should.exist(writtenConfig);
    writtenConfig.should.be.exactly(yamlMockConfigStringified);
    const fetchedConfig = R.call(proxifiedConfig.getConfig);
    should.exist(fetchedConfig);
    fetchedConfig.should.be.exactly(mockConfig);
  });

  it('should get and set global config', () => {
    const config = getGlobalMockConfig();
    const yamlMockConfigStringified = yamlStringifyTo2Spaces(config);
    const writeFileSyncStub = sinon.stub().returns(yamlMockConfigStringified);
    const proxifiedConfig = proxyquire('../../../lib/config/config-file.fp', {
      fs: {
        existsSync: () => true,
        writeFileSync: writeFileSyncStub,
      },
      yamljs: {
        load: () => mockConfig,
      },
    });
    const writtenConfig = R.call(proxifiedConfig.setGlobalConfig, mockConfig);
    should.exist(writtenConfig);
    writtenConfig.should.be.exactly(yamlMockConfigStringified);
    const fetchedConfig = R.call(proxifiedConfig.getGlobalConfig);
    should.exist(fetchedConfig);
    fetchedConfig.should.exactly(mockConfig);
  });
});
