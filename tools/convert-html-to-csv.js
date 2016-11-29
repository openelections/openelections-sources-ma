/* global process */

var fs = require('fs');
var sb = require('standard-bail')();
var cheerio = require('cheerio');

if (process.argv.length < 3) {
  console.error('Usage: node tools/convert-html-to-csv.js <path to html file> > your-new.csv');
  process.exit();
}

var htmlFilePath = process.argv[2];

fs.readFile(htmlFilePath, sb(parseHTML, logError));

function parseHTML(htmlString) {
  var $ = cheerio.load(htmlString);
  var tables = $('.t');
  for (let tableIndex = 0; tableIndex < tables.length; ++tableIndex) {
    let csvRow = [];
    let table = tables[tableIndex];

    if (table.childNodes && table.childNodes.length > 0) {
      let label = table.childNodes[0].data;
      csvRow.push(quote(label));
    }

    let valuesContainers = $('.ws1', table);

    if (valuesContainers.length > 0) {
      let valuesContainer = valuesContainers[0];
      if (valuesContainer.childNodes) {
        for (let valueIndex = 0; valueIndex < valuesContainer.childNodes.length; ++valueIndex) {
          let possibleValue = valuesContainer.childNodes[valueIndex];
          if (possibleValue.type === 'text') {
            csvRow.push(quote(possibleValue.data));
          }
        }
      }
    }
    process.stdout.write(csvRow.join(',') + '\n');
  }
}

function logError(error) {
  if (error) {
    console.error(error, error.stack);
  }
}

function quote(s) {
  return '"' + s + '"';
}
