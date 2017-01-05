const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

const output = fs.createWriteStream(__dirname + '/example.zip');
const archive = archiver('zip', {
  store: true
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
});

archive.on('error', function(err) {
  throw err;
}); 

archive.pipe(output);

archive.directory('photos/');

archive.finalize();