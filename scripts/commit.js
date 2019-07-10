const sendToStaging = require('../index').stageAllChanges;
const getCommit = require('../index').getCommitMessage;
const commit = require('../index').commitChanges;
const push = require('../index').pushChanges;

(async () => {
  await sendToStaging();
  const commitObject = await getCommit();
  await commit(commitObject);
  await push();
})();