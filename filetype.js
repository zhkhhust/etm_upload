var fs = require("fs")
var magic = require('stream-mmmagic');

var input = fs.createReadStream('form.html');

magic(input, function (err, mime, output) {
  if (err) throw err;

  console.log('TYPE:', mime.type);
  console.log('ENCODING:', mime.encoding);
  //output.close()
  input.close()

  // will print the *whole* file
  //output.pipe(process.stdout);
});