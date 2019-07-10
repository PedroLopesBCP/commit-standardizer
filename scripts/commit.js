const getCommit = require('../index').getCommitMessage;

(async () => {
  await getCommit();
})();