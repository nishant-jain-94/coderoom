const R = require('ramda');
const should = require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const configInitializer = proxyquire('../../../lib/config/config-initializer.fp', {
  inquirer: {
    prompt: questions => Promise.resolve(questions),
  },
  './config-file.fp': {
    getGlobalConfig: () => {
      const mockConfig = {
        REVIEWERS_NAME: 'Nishant Jain',
        'https://gitlab-cts.stackroute.in/': 'pKZosz1ke344Hzgxkv4E',
      };
      return mockConfig;
    },
    setConfig: config => config,
    setGlobalConfig: config => config,
  },
});

const {
  _getQuestions,
  _setConfigs,
  _promptQuestions,
} = configInitializer;

const getExpectedQuestionNames = () => {
  const expectedQuestionNames = [
    'REVIEWERS_NAME',
    'GITLAB_URL',
    'API_TOKEN',
    'INCLUDED_GROUPS',
    'EXCLUDED_GROUPS',
    'ASSIGNMENT',
  ];
  return expectedQuestionNames;
};

const getLocalMockConfig = () => {
  const mockConfig = {
    REVIEWERS_NAME: 'Nishant Jain',
    API_TOKEN: 'pKZosz1ke344Hzgxkv4E',
    GITLAB_URL: 'https://gitlab-cts.stackroute.in/',
    INCLUDED_GROUPS: [
      162,
    ],
    EXCLUDED_GROUPS: [
      163,
    ],
  };
  return mockConfig;
};

describe('Config Initializer', () => {
  it('getQuestions should get Questions', () => {
    const questions = _getQuestions();
    const questionNames = questions.map(question => question.name);
    const expectedQuestionNames = getExpectedQuestionNames();
    should.exist(questionNames);
    questionNames.should.be.an.Array();
    questionNames.length.should.be.exactly(expectedQuestionNames.length);
    questionNames.should.eql(expectedQuestionNames);
  });

  it('promptQuestions Should prompt questions', () => {
    const expectedQuestionNames = getExpectedQuestionNames();
    const getQuestionNames = questions => questions.map(question => question.name);
    const assertExpectedQuestionNames = questionNames =>
      questionNames.should.eql(expectedQuestionNames);
    R.composeP(assertExpectedQuestionNames, getQuestionNames, _promptQuestions)();
  });

  it('setConfigs should call setConfig and setGlobalConfig', () => {
    const mockConfig = getLocalMockConfig();
    const configs = _setConfigs(mockConfig);
    configs.should.be.an.Array();
    configs.length.should.be.exactly(2);
    configs[0].should.be.exactly(mockConfig);
    configs[1].should.be.exactly(mockConfig);
  });

  it('initializeConfig should call setConfigs and promptQuestions', (done) => {
    const mockConfig = getLocalMockConfig();
    const setConfigStub = sinon.stub(configInitializer, '_setConfigs').resolves(mockConfig);
    const promptQuestionsStub = sinon.stub(configInitializer, '_promptQuestions').resolves(mockConfig);
    const assertSetConfigsIsCalled = () => setConfigStub.called.should.be.true();
    const assertPromptQuestionsIsCalled = () => promptQuestionsStub.called.should.be.true();
    const callDone = () => done();
    const composeSequence = [
      callDone,
      assertPromptQuestionsIsCalled,
      assertSetConfigsIsCalled,
      configInitializer.initializeConfig,
    ];
    R.call(R.composeP(...composeSequence));
  });
});
