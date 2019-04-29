const through2 = require('through2');

exports.append = function(properties, features) {
  return through2.obj(function(file, env, cb) {
    if (file.isBuffer() && file.extname === '.ext') {
      // change .ext to .ts or .js file
      file.extname = features.includes('typescript') ? '.ts' : '.js'
    }
    cb(null, file);
  });
};
