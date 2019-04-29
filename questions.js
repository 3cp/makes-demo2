module.exports = [
  // prompt to ask user for text input, the answer will be available
  // for "@echo description" in file pre-processing.
  {
    name: 'description',
    message: 'Description for this project (optional)?'
  },
  // single-select
  // answers from all single-select or multi-select becomes user selected features.
  // Unlike other prompt tool (inquirer/enquirer/prompts), the answers in "makes"
  // selections are unnamed. If user select 'nodejs', 'gitattributes' and 'babel' from
  // next three selections, the answers (selected features) are simply
  //
  //   ['nodejs', 'gitattributes', 'babel']
  //
  // comparing to the other common answers shape from inquirer/enquirer/prompts
  //
  //   {type: 'nodejs', gitattributes: true, transpiler: 'babel'}
  //
  // This list of selected features will then be used by "makes" to select relevant
  // feature folders and do conditional pre-processing.
  {
    message: 'What type of project?',
    choices: [
      {value: 'nodejs', title: 'Node.js'},
      {value: 'ruby', title: 'Ruby'}
    ]
  },
  // multi-select
  {
    multiple: true,
    message: 'Do you want some common files?',
    choices: [
      {value: 'gitignore', selected: true, title: '.gitignore'},
      {value: 'gitattributes', selected: true, title: '.gitattributes', hint: '.gitattributes file to normalize EOL char on win32.'},
      {value: 'license', title: 'LICENSE (MIT)'}
    ]
  },
  {
    if: 'license',
    name: 'author',
    message: "What's the author name to be displayed in MIT license?",
    // optional validation (only for text prompt)
    // if return value is an non-empty string, or boolean false, it's considered failed.
    validate: value => {
      if (!value.trim()) return 'Author is mandatory for license'
    }
  },
  // single-select, but only when user selected "nodejs"
  {
    if: 'nodejs',
    message: 'Do you want to use a transpiler?',
    choices: [
      // first choice has no value, means it would add any value to answers.
      // hint is an optional field for detailed explanation.
      {title: 'None', hint: 'Write plain commonjs code.'},
      {value: 'babel', title: 'Babel for ESNext', hint: 'Use next generation JavaScript, today.'},
      {value: 'typescript', title: 'TypeScript', hint: 'TypeScript is a typed superset of Javascript that compiles to plain JavaScript.'}
    ]
  }
];
