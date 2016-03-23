var fs = require('fs');
var cache = {};

function consistentRead(filename) {
  if (cache[filename]) {
    return cache[filename];
  } else {
    cache[filename] = fs.readFileSync(filename, 'utf8');
    return cache[filename];
  }
}
//what about this change?
function createFileReader(filename) {
  var listeners = [];
  consistentRead(filename, function(value) {
    listeners.forEach(function(listener) {
      listener(value);
    });
  });
  return {
    onDataReady: function(listener) {
      listeners.push(listener);
    }
  };
}

var reader1 = createFileReader('data.txt');
reader1.onDataReady(function(data) {
  console.log('First call data: ' + data);
  var reader2 = createFileReader('data.txt');
  reader2.onDataReady(function(data) {
    console.log('Second call data: ' + data);
  });
});
