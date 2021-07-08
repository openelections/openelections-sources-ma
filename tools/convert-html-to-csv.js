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
  var rows = parseChelmsfordStyleHTML(htmlString);

  if (rows.length < 0) {
    // TODO: Try something else.
  }

  dropEmptyColumns(rows).forEach(writeRow);
}

function writeRow(csvRow) {
  process.stdout.write(csvRow.map(quote).join(',') + '\n');
}

function parseChelmsfordStyleHTML(htmlString) {
  var rows = [];
  var $ = cheerio.load(htmlString);
  var tables = $('.t');
  for (let tableIndex = 0; tableIndex < tables.length; ++tableIndex) {
    let csvRow = [];
    let leftmostColumnData = [];
    let leftmostColumnDataComplete = false;
    let table = tables[tableIndex];

    for (let childIndex = 0; childIndex < table.childNodes.length; ++childIndex) {
      var child = table.childNodes[childIndex];

      if (!leftmostColumnDataComplete &&
        child.type === 'tag' &&
        child.attribs &&
        child.attribs.class &&
        (child.attribs.class.indexOf('ws1') !== -1 ||
        child.attribs.class.indexOf('ws2') !== -1)) {
        
        leftmostColumnDataComplete = true;
        csvRow.push(leftmostColumnData.join(''));

        addParentAndChildValuesToArray(child, csvRow);
      }
      else {
        addParentAndChildValuesToArray(child, leftmostColumnData);
      }
    }

    if (!leftmostColumnDataComplete) {
      csvRow.push(leftmostColumnData.join(''));      
    }
    rows.push(csvRow);
  }

  return rows;
}

function addParentAndChildValuesToArray(parent, valuesArray) {
  if (parent.type === 'text') {
    valuesArray.push(parent.data);
  }
  else if (parent.type === 'tag') {
    for (let childIndex = 0; childIndex < parent.childNodes.length; ++childIndex) {
      addParentAndChildValuesToArray(parent.childNodes[childIndex], valuesArray);
    }
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

function dropEmptyColumns(rows) {
  var occupiedColumnIndexes = [];
  rows.forEach(checkColsInRow);
  return rows.map(rowWithoutEmptyColumns);

  function checkColsInRow(row) {
    var startCol = 0;
    if (occupiedColumnIndexes.length > 0) {
      startCol = occupiedColumnIndexes[occupiedColumnIndexes.length - 1] + 1;
    }
    for (var i = startCol; i < row.length; ++i) {
      let val = row[i];
      if (val !== undefined) {
        if (typeof val === 'string' && val.trim() !== '') {
          occupiedColumnIndexes.push(i);
        }
      }
    }
  }

  function rowWithoutEmptyColumns(row) {
    var newRow = [];
    for (var j = 0; j < occupiedColumnIndexes.length; ++j) {
      newRow.push(row[occupiedColumnIndexes[j]] || '');
    }
    return newRow;
  }
}
