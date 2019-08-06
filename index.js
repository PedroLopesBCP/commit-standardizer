const prompts = require('prompts');
const childProcessExec = require('child_process').exec;
const util = require('util');
const exec = util.promisify(childProcessExec);

let commit = { commitType: '', commitMessage: '', commitReferences: '', pushToOrigin: false };

// Private methods ----------------------------------------------------
const mountCommit = async () => {
  const commitType = await prompts({
    type: 'select',
    name: 'value',
    message: 'Escolha o tipo de commit',
    choices: [
      { title: 'feat: Addition of new features', value: 'feat:' },
      { title: 'refactor: Changes in the code that are compatible with older versions', value: 'refactor:' },
      { title: 'fix: Bug fixes', value: 'fix:' },
      { title: 'chore: Activities that do not fit any category. Ex: bump package version', value: 'chore:' },
      { title: 'style: Changes in the styling of the application UI', value: 'style:' },
      { title: 'doc: Documentation changes', value: 'doc:' },
      { title: 'perf: Activities related to the performace of the appication', value: 'perf:' },
      { title: 'ci: Activities related do continuous integraton', value: 'ci:' },
      { title: 'breaking: Changes in the code that are not compatible with older versions', value: 'breaking:' },
    ]
  });

  const commitMessage = await prompts({
    type: 'text',
    name: 'value',
    message: 'Type in the commit message'
  });

  const commitReferences = await prompts({
    type: 'text',
    name: 'value',
    message: 'Type in the issues referenced by this commit (Optional)'
  });

  const pushToOrigin = await prompts({
    type: 'toggle',
    name: 'value',
    message: 'Do you want to push the changes to the remote repository?'
  })

  let mountedCommit = { commitType: '', commitMessage: '', commitReferences: '', pushToOrigin: true };

  if (commitType.value) {
    mountedCommit.commitType = commitType.value;
  }
  if (commitMessage.value) {
    mountedCommit.commitMessage = commitMessage.value;
  }
  if (commitReferences.value) {
    mountedCommit.commitReferences = commitReferences.value
  }
  mountedCommit.pushToOrigin = pushToOrigin.value;

  return mountedCommit;
}

async function _stageAllChanges() {
  return await exec('git add .');
}

async function _commitHandler(commitObject) {
  if (commitObject.commitReferences) {
    return commitChangesWithReferences(commitObject);
  }
  return commitChanges(commitObject);
}

/**
 * Função responsável por realizar o commit das alterações
 * @param commitObject
 */
const commitChanges = async (commitObject = { commitType: '', commitMessage: '', commitReferences: '', pushToOrigin: true }) => {
  let message = '';
  if (commitObject) {
    message = `${commitObject.commitType} ${commitObject.commitMessage}`
  } else {
    message = `${commit.commitType} ${commit.commitMessage}`
  }
  await _stageAllChanges();
  return await exec(`git commit -m "${message}"`);
}
/**
 * Função por realizar o commit referenciando alguns tickets do JIRA
 * @param commitObject 
 */
const commitChangesWithReferences = async (commitObject = { commitType: '', commitMessage: '', commitReferences: '', pushToOrigin: true }) => {
  let message = '';
  if (commitObject) {
    message = `${commitObject.commitType} ${commitObject.commitMessage}`
  } else {
    message = `${commit.commitType} ${commit.commitMessage}`
  }
  await _stageAllChanges();
  return await exec(`git commit -m "${message}" -m "${commit.commitReferences}"`);
}
// --------------------------------------------------------------------

/**
 * Função responsável por retornar o objeto do commit
 */
const getCommitMessage = async () => {
  commit = await mountCommit();
  await _commitHandler(commit);
  if (commit.pushToOrigin) {
    return pushChanges();
  }
}

/**
 * Função responsável por enviar as mudanças para o repostitório
 */
const pushChanges = async () => {
  const branch = await exec('git rev-parse --abbrev-ref HEAD');
  await exec(`git push origin ${branch.stdout}`);
}

exports.getCommitMessage = getCommitMessage;
exports.pushChanges = pushChanges;

/* TODO: Analisar necessidade dentro do fluxo atual
* exports.commitChangesWithReferences = commitChangesWithReferences;
* exports.commitChanges = commitChanges;
*/