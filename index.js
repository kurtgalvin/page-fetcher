const request = require('request');
const fs = require('fs');
const readline = require('readline');

const writeToFile = function(body, filePath, rl = null) {
  fs.writeFile(filePath, body, function (err) {
    if (err) throw err;
    fs.stat(filePath, function(err, stats) {
      if (err) throw err;
      console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
      if (rl) rl.close()
    })
  });
}

const writeToExistingFile = function(body, filePath) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('File path exists. overwrite? [Y/N] >> ', function(answer) {
    if (answer.toUpperCase() === 'Y') {
      writeToFile(body, filePath, rl);
    } else {
      rl.close()
    }
  })
}

const writeRequest = function(url, filePath) {
  request(url, (err, response, body) => {
    if (err) throw err;
    if (response.statusCode !== 200) {
      console.log(`Status Code: ${response.statusCode}`);
    } else {
      fs.exists(filePath, function(exists) {
        if (exists) {
          writeToExistingFile(body, filePath)
        } else {
          writeToFile(body, filePath);
        }
      });
    }
  });
}

const [url, filePath] = process.argv.slice(2);

writeRequest(url, filePath);