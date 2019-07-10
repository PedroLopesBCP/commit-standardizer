const sendToStaging = require('../src/index').stageAllChanges;
const getCommit = require('../src/index').getCommitMessage;
const commit = require('../src/index').commitChanges;
const push = require('../src/index').pushChanges;

(async () => {
  await sendToStaging();
  const commitObject = await getCommit();
  await commit(commitObject);
  await push();
})();