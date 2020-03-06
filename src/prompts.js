import chalk from 'chalk';
import Prompts from 'prompts';

export async function prompts(options) {
  const response = await Prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?',
    validate: value => value < 18 ? `Nightclub is 18+ only` : true,
    // min: 2,
    // max: 10,
    // style: 'password',
    // initial: 0
  });

  console.log(`%s ${response.value}`, chalk.green.bold('DONE'));

  const questions = [
    // {
    //   type: 'text',
    //   name: 'dish',
    //   message: 'Do you like pizza?'
    // },
    // {
    //   type: prev => prev == 'pizza' ? 'text' : null,
    //   name: 'topping',
    //   message: 'Name a topping'
    // },
    {
      type: 'autocomplete',
      name: 'value',
      message: 'Pick your favorite actor',
      choices: [
        { title: 'Cage' },
        { title: 'Clooney', value: 'silver-fox' },
        { title: 'Gyllenhaal' },
        { title: 'Gibson' },
        { title: 'Grant' }
      ]
    },
    {
      type: 'toggle',
      name: 'value',
      message: 'Can you confirm?',
      initial: true,
      active: 'yes',
      inactive: 'no'
    },
    {
      type: 'confirm',
      name: 'value',
      message: 'Can you confirm?',
      initial: true
    },
    {
      type: 'text',
      name: 'twitter',
      message: `What's your twitter handle?`
    },
    {
      type: 'select',
      name: 'value',
      message: 'Pick a color',
      choices: [
        { title: 'Red', description: 'This option has a description', value: '#ff0000' },
        { title: 'Green', value: '#00ff00', disabled: true },
        { title: 'Blue', value: '#0000ff' }
      ],
      initial: 1
    },
    {
      type: 'multiselect',
      name: 'color',
      message: 'Pick colors',
      choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff' }
      ],
    }
  ];

  const onCancel = prompt => {
    console.log('Never stop prompting!', prompt);
    return true;
  }
  const onSubmit = (prompt, answer) => console.log(`Thanks I got ${answer} from ${prompt}`);
  const res = await Prompts(questions, { onSubmit, onCancel });
  console.log(res);

  return true;
}
