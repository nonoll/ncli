import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import { exec } from 'child_process';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  const { templateDirectory, targetDirectory } = options;
  return copy(templateDirectory, targetDirectory, {
    clobber: false
  });
}

async function initGit(options) {
  const result = await execa('git', ['init'], { cwd: options.targetDirectory });

  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize Git'));
  }

  return true;
}

async function runMockServe(options) {
  return new Promise((resolve, reject) => {
    try {
      // execa('node', ['mock'], { cwd: options.targetDirectory });
      exec('node mock', { cwd: options.targetDirectory }, (error) => {
        if (error) {
          return reject(new Error('Failed to node mock'));    
        }
        return resolve(true);
      });
    } catch (error) {
      return reject(new Error('Failed to node mock'));
    }
  });
}

export async function createMockServe(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || `${process.cwd()}/θmock-server`
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(new URL(currentFileUrl).pathname, '../../templates', 'mock-server');
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (e) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options)
    },
    {
      title: 'Install dependencies',
      task: () => projectInstall({
        cwd: options.targetDirectory
      }),
      skip: () => !options.runInstall ? 'Pass --install to automatically install' : undefined
    },
    // {
    //   title: 'Run mock-serve',
    //   task: () => runMockServe(options),
    //   skip: () => !options.runInstall ? '사용시: node mock' : undefined
    // }
  ]);

  await tasks.run();

  if (options.runInstall) {
    await runMockServe(options);
  }

  console.log('%s Project ready', chalk.green.bold('DONE'));

  return true;
}
