import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import clipboardy from 'clipboardy';

const access = promisify(fs.access);
const copy = promisify(ncp);

export function generate(options) {
  const { name } = options;
  // console.log('generate', options);
  const currentFileUrl = import.meta.url;
  // console.log('currentFileUrl', currentFileUrl);
  // console.log('new URL(currentFileUrl).pathname', new URL(currentFileUrl).pathname);
  const templateDir = path.resolve(new URL(currentFileUrl).pathname, '../../templates', 'generate');
  // console.log('templateDir', templateDir);
  fs.readFile(`${templateDir}/WAPI.json`, 'utf8', (error, data) => {
    if (data) {
      const snippet = JSON.parse(data);
      // console.log('snippet', snippet);
      const body = Array.isArray(snippet.body) ? snippet.body.join('\n') : snippet.body;
      // console.log('body', body);
      const path = `${process.cwd()}/${name}.ts`;
      // console.log('path', path, new URL(currentFileUrl).pathname, import.meta.url, process.cwd());
      // fs.writeFile(path, body, (err) => {
      //   if (err) throw err;
      //   console.log('The file has been saved!');
      // });
      clipboardy.writeSync(body);

      console.log('%s api snippet', chalk.green.bold('DONE'));
    }
  });
}
