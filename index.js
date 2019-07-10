const prompts = require('prompts');
const childProcessExec = require('child_process').exec;
const util = require('util');
const exec = util.promisify(childProcessExec);

/**
 * Função responsável por montar o objeto com os atributos do commit
 */
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
    message: 'Insira os tickets referenciados separados por vírgula'
  });

  let mountedCommit = {};

  if (commitType.value) {
    mountedCommit.commitType = commitType.value;
  }
  if (commitMessage.value) {
    mountedCommit.commitMessage = commitMessage.value;
  }
  if (commitReferences.value) {
    mountedCommit.commitReferences = commitReferences.value
  }

  return mountedCommit;

}

let commit = {};

/**
 * Função responsável por enviar as alterações realizadas
 */
const stageAllChanges = async () => {
  await exec('git add .');
}
/**
 * Função responsável por retornar o objeto do commit
 */
const getCommitMessage = async () => {
  commit = await mountCommit();
  return commit;
}
/**
 * Função responsável por realizar o commit das alterações
 */
const commitChanges = async (commitObject) => {
  let message = '';
  if (commitObject) {
    message = `${commitObject.commitType} ${commitObject.commitMessage}`
  } else {
    message = `${commit.commitType} ${commit.commitMessage}`
  }
  await exec(`git commit -m "${message}"`);
}
/**
 * Função por realizar o commit referenciando alguns tickets do JIRA
 */
const commitChangesWithReferences = async () => {
  const message = `${commit.commitType} ${commit.commitMessage}`
  await exec(`git commit -m "${message}" -m "${commit.commitReferences}"`);
}
/**
 * Função responsável por enviar as mudanças para o repostitório
 */
const pushChanges = async () => {
  const branch = await exec('git rev-parse --abbrev-ref HEAD');
  await exec(`git push origin ${branch.stdout}`);
}

exports.stageAllChanges = stageAllChanges;
exports.mountCommit = mountCommit;
exports.getCommitMessage = getCommitMessage;
exports.commitChangesWithReferences = commitChangesWithReferences;
exports.commitChanges = commitChanges;
exports.pushChanges = pushChanges;