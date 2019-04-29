# makes-demo2
"makes" skeleton demo, customised questions and feature folders.

## Customised questions
Questions are defined in `questions.js` (optional), it needs to be in plain commonjs
 format ("makes" does not support any kind of transpiling babel/TypeScript).

"makes" only provides two kind of prompts.

### text prompt

Like the first one in `questions.js`, a text prompt needs a "name" field and a
"message" field.

    {
      name: 'description',
      message: 'Description for this project (optional)?'
    }

Optionally, you can also supply a "default" field like `default: 'Default description.'`
which will be used as the default answer of this prompt.

"makes" also provides one default text prompt out of the box, prepended to your
customised questions list. This auto prepend only happens when you did not provide
a question asking for `name: 'name'`.

    {
      name: 'name',
      message: 'Please name this new project:',
      default: 'my-app',
    }

This means you can define your own question on project `'name'` with customised `message`
(the question end user sees) and customised `default` value. Your customised `'name'`
question does not even need to be the first question.

### select prompt

In this demo, there are two single-select prompts, and one multi-select prompt. You can
not change the default value of single-select, it's always default to first choice. You
can mark default value for multi-select by setting `selected: true` on the choices.

Select prompt doesn't need a "name" field, answers from all single-select or multi-select
become user selected features. Unlike other prompt tool (inquirer/enquirer/prompts),
the answers in "makes" selections are unnamed. If user select 'nodejs', 'gitattributes',
and 'babel', then the answers (selected features) are simply

    ['nodejs', 'gitattributes', 'babel']

comparing to the other common used shape from inquirer/enquirer/prompts

    {type: 'nodejs', gitattributes: true, transpiler: 'babel'}

This list of selected features will then be used by "makes" to select relevant feature
folders and do conditional pre-processing.

### How "makes" uses the answers

"makes" groups answers for all text prompts into an object like this:

    {
      name: 'my-app',
      description: 'Project description',
      author: 'Me'
    }

These named properties are **only for `@echo` pre-processing**, you can find various `@echo`
in files under `common/` and `nodejs/` folders.

"makes" groups answers for select prompts into a simple array called selected features:

    ['nodejs', 'gitattributes', 'babel']

This feature list is used by "makes" to
1. select targetd feature folders, the above feature list will select folder
`common/` and `nodejs/`.
2. use in condition expression.
 * in questions themself (see the if conditions in questions and question choices).
 * in conditional file, e.g. `common/.gitattributes__if_gitattributes`.
 * in conditional content pre-process, e.g. in `common/README.md` `// @if nodejs`.

### Condition expression

All conditional logic in "makes" are handled by same expression engine, you can use same expression
1. in question or choice of question.

    if: 'babel || typescript'

2. in conditional file (use `and`, `or`, `not` because `&&`, `||`, `!` are not friendly in file name)

    common/some-file.xxx__if_babel_or_typescript

3. in content pre-process

```
// @if babel || typescript
This only appears when user selected babel or typescript
// @endif
```
