const opn = require('opn');
const shelljs = require('shelljs');

const openIssues = () => {
  shelljs.exec('git config --get remote.origin.url', { async: true, silent: true }, (code, stdout, stderr) => {
    if (code !== 0) {
      console.log(stderr);
    } else {
      const GITLAB_URL = `http://${stdout.split('@')[1].replace(':', '/').replace('.git', '')}/issues/new`;
      opn(GITLAB_URL, { wait: false });
    }
  });
};

module.exports = {
  openIssues,
};
