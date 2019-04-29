# demo2
"makes" skeleton demo, customised questions and feature folders.

```sh
npx makes makesjs/demo2#adv
# or
npx makes makesjs/demo2#adv a_project_name
```

Same functionality as basic demo2, but this one demonstrates following advanced
features.

## Condition on folders

"makes" only treats top level feature folders name as static, any folders or files
beneath feature folders can be conditional.

For example, this demo simplified
```
nodejs/src/index.js__if_babel
nodejs/src/index.ts__if_typescript
```

To just
```
nodejs/src__if_babel_or_typescript/index.ext
```

Note we merged babel and TypeScript version of the source code into one file. The
contents of the two files were same. You can further conditionally pre-process the
content in `index.ext` if you need variation between babel/TypeScript implementations.

For example:

```
export default function() {
  // @if babel
  message = 'Hello';
  // @endif
  // @if typescript
  public message: String = 'Hello';
  // @endif
};
```

You can also use condition on multiple level of folders and file itself. All the
conditions must be satisfied for that file to be included in final write out.

For example:
```
feature-folder/test__if_jest_or_jasmine/unit__if_typescript/foo.ts__if_foo
feature-folder/test__if_jest_or_jasmine/unit__if_babel/foo.js__if_foo
```

How "makes" yields `index.ext` to `index.js` for babel, and `index.ts` for TypeScript?
Well, "makes" doesn't support conditional mutation of file name out of the box, you need
to tap into "makes" files stream processing to enable this function.

## `transforms.js` (optional)

The optional `transforms.js` can provide one or many transform streams to handle the
files streaming.

Internally, "makes" processes all skeleton files with Vinyl file object
stream, almost same as a gulp stream.

`transforms.js` can provide
1. `prepend` transform (or array of transforms) to process the raw Vinyl file objects
before "makes" sees them,
2. `append` transform (or array of transforms) to a final process on Vinyl files after
"makes" processed them, but just before "makes" writes them out to disk.

In this demo we only provided a single `append` transform in `transforms.js`.

```js
const {Transform} = require('stream');

exports.append = function(properties, features) {
  return new Transform({
    objectMode: true,
    transform: function(file, env, cb) {
      if (file.isBuffer() && file.extname === '.ext') {
        // change .ext to .ts or .js file
        file.extname = features.includes('typescript') ? '.ts' : '.js'
      }
      cb(null, file);
    }
  });
};
```

First, every unit in `append` or `prepend` is a function:
1. got input parameters of
 * `properties` the properties got from text prompts answers.
 * `features` the selected features got from select prompts answers.
 * `targetDir` the root target directory where all files will be written to, you can
   check target directory for some existing files.
 * `unattended` this will be true if user runs "makes" in silent mode (`-s`). You have
   to ensure not prompting user for any action in silent mode.
2. return a transform stream.

Here we use core Node.js stream API to create a new transform stream. For experienced
gulp user, you might be more familiar with `through2` wrapper. The above code is exactly
same as following `through2` code.

```js
const {through2} = require('through2');

exports.append = function(properties, features) {
  return through2.obj(function(file, env, cb) {
    if (file.isBuffer() && file.extname === '.ext') {
      // change .ext to .ts or .js file
      file.extname = features.includes('typescript') ? '.ts' : '.js'
    }
    cb(null, file);
  });
};
```

We recommend just use core Node.js stream API. If you use `through2`, it means your skeleton
repo has runtime dependency on `through2`, you will need to provide a package.json file to
notify "makes" about the runtime dependency. That extra dependency installation will slow down
"makes", so use runtime dependency rarely.

`package.json`

```json
{
  "dependencies": {
    "through2": "^3.0.1"
  }
}
```

For a reference on using `through2` at runtime, check [`makesjs/demo2#adv-through2`]
(https://github.com/makesjs/demo2/tree/adv-through2).

Note you can provide multiple transforms:

```js
const {Transform} = require('stream');

exports.append = [
  function(properties, features) {
    return new Transform({...});
  },
  function(properties, features) {
    return new Transform({...});
  },
  // ...
];
```
