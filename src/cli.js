import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
    '--git': Boolean,
    '--yes': Boolean,
    '--install': Boolean,
    '-git': '--git',
    '-y': '--yes',
    '-i': '--install'
    },
    {
      argv: rawArgs.slice(2)
    }
  );

  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript';

  const { skipPrompts, git, template } = options;
  
  if (skipPrompts) {
    return {
      ...options,
      template: template || defaultTemplate
    }
  }

  const questions = [];
  if (!template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate
    });
  }

  if (!git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repogitory?',
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: template || answers.template,
    git: git || answers.template
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  // console.log(options);
  options = await promptForMissingOptions(options);
  // console.log(options);
  await createProject(options);
}
