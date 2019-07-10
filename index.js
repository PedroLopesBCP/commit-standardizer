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
      { title: 'feat: Implementação de novas funcionalidades', value: 'feat:' },
      { title: 'refactor: Refatorações de código com retrocompatibilidade', value: 'refactor:' },
      { title: 'fix: Correção de bugs', value: 'fix:' },
      { title: 'chore: Atividades diversas', value: 'chore:' },
      { title: 'style: Ajustes de estilo', value: 'style:' },
      { title: 'doc: Atividades referentes a documentação do projeto', value: 'doc:' },
      { title: 'perf: Melhorias de performance', value: 'perf:' },
      { title: 'ci: Alterações referentes integração contínua', value: 'ci:' },
      { title: 'breaking: Refatorações de código sem suporte a versões anteriores', value: 'breaking:' },
    ]
  });

  const commitMessage = await prompts({
    type: 'text',
    name: 'value',
    message: 'Digite a mensagem do commit'
  });

  const commitReferences = await prompts({
    type: 'text',
    name: 'value',
    message: 'Insira as issues que serão referenciadas separadas por vírgula. Ex: SDK-1770, SDK-1771'
  });

  const pushToOrigin = await prompts({
    type: 'toggle',
    name: 'value',
    message: 'Enviar as alterações para o repositório remoto?'
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
  commitChanges(commitObject);
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