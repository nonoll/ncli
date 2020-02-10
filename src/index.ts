#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

import { aMethod } from './components/a';

clear();
console.log(
  chalk.red(
    // figlet.textSync('pizza-cli', { horizontalLayout: 'full' }),
    figlet.textSync('nonoll-cli', { horizontalLayout: 'full' })
  )
);

// aMethod('test');

program
	.version('0.0.2')
  .description("An example CLI for ordering pizza's")
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq', 'Add bbq sauce')
  .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
  .option('-C, --no-cheese', 'You do not want any cheese')
  .option('-AAA, --a', aMethod('test'))
	.parse(process.argv);
	
console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbq) console.log('  - bbq');

const cheese: string = true === program.cheese
	? 'marble'
	: program.cheese || 'no';

console.log('  - %s cheese', cheese);

if (!process.argv.slice(2).length) {
	program.outputHelp();
}