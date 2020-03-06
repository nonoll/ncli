import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';
import { generate } from './generate';
import { prompts } from './prompts';
import { serve } from './serve';
import { createMockServe } from './mock-serve';
import { promptTest } from './test';

import Prompts from 'prompts';

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
  // console.log('args.slice(2)', args.slice(2));
  const [ command, type = '', name = `${+new Date()}` ] = args.slice(2);
  let useCommand = `${command || ''}`.toLowerCase();

  if (!useCommand) {
    // const { selectedCommand } = await inquirer.prompt([
    const { selectedCommand } = await Prompts([
      {
        type: 'select',
        name: 'selectedCommand',
        message: '입력하신 기능이 없습니다, 사용하실 기능을 선택하세요.',
        choices: [
          { title: 'serve', description: '사용할 서버를 선택합니다.', value: 'serve' },
          { title: 'gen', description: 'generate', value: 'gen' }
        ],
        initial: 0
      }
      // {
      //   type: 'list',
      //   name: 'selectedCommand',
      //   message: '입력하신 기능이 없습니다, 사용하실 기능을 선택하세요.',
      //   choices: ['serve', 'gen'],
      //   default: 'serve'
      // }
    ]);
    useCommand = selectedCommand;
  }

  switch (useCommand) {
    case 'prompts':
    case 'pr':
      prompts({ command, type, name });
      break;

    case 'test':
      promptTest({ command, type, name });
      break;

    case 'serve':
      const { serverType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'serverType',
          message: '사용하실 서버타입을 선택하세요.',
          choices: ['StaticServer', 'APIMockServer'],
          default: 'StaticServer'
        }
      ]);
      // let mockOptions = parseArgumentsIntoOptions(args);
      // console.log(options);
      // mockOptions = await promptForMissingOptions(mockOptions);
      if (serverType === 'APIMockServer') {
        await createMockServe({ serverType, runInstall: true });
      } else {
        serve({ command, type, name });
      }
      break;

    // case 'serve':
    //   serve({ command, type, name });
    //   break;

    case 'gen':
    case 'generate':
      generate({ command, type, name });
      break;

    default:
      let options = parseArgumentsIntoOptions(args);
      // console.log(options);
      options = await promptForMissingOptions(options);
      // console.log(options);
      await createProject(options);
      break;
  }
}
