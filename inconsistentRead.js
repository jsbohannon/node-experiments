var fs = require('fs');
var cache = {};

function inconsistentRead(filename, callback) {
  if (cache[filename]) {
    callback(cache[filename]);
  } else {
    fs.readFile(filename, 'utf8', function(err, data) {
      cache[filename] = data;
      callback(data);
    });
  }
}

function createFIleReader(filename) {
  var listeners = [];
  inconsistenRead(filename, function(value) {
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

var reader1 = createFIleReader('data.')
