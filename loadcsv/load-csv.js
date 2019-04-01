const fs = require('fs');
const _ = require('lodash');
const shuffleSeed = require('shuffle-seed');

function extractColumns(data, columnNames) {
  const headers = _.first(data);

  const indexes = _.map(columnNames, column => headers.indexOf(column));
  const extracted = _.map(data, row => _.pullAt(row, indexes));

  return extracted;
}

function loadCSV(
  filename,
  {
    converters = {},
    labelColumns = [],
    dataColumns = [],
    shuffle = true,
    splitTest = false
  }
) {
  let data = fs.readFileSync(filename, { encoding: 'utf-8' });
  data = data.split('\r\n').map(row => row.split(','));
  data = data.map(row => _.filter(row, val => val !== ''));
  const headers = _.first(data);

  data = data.map((row, index) => {
    if (index === 0) {
      return row;
    }

    return row.map((element, index) => {
      if (converters[headers[index]]) {
        const converted = converters[headers[index]](element);
        return _.isNaN(converted) ? element : converted;
      }
      const result = parseFloat(element);
      return _.isNaN(result) ? element : result;
    });
  });

  let labels = extractColumns(data, labelColumns);
  data = extractColumns(data, dataColumns);

  labels.shift();
  data.shift();

  if (shuffle) {
    data = shuffleSeed.shuffle(data, 'phrase');
    labels = shuffleSeed.shuffle(labels, 'phrase');
  }

  if (splitTest) {
    const trainSize = _.isNumber(splitTest)
      ? splitTest
      : Math.floor(data.length / 2);

    return {
      features: data.slice(trainSize),
      labels: labels.slice(trainSize),
      testFeatures: data.slice(0, trainSize),
      testLabels: data.slice(0, trainSize)
    };
  } else {
    return { data, labels };
  }
}

const load = loadCSV('data.csv', {
  labelColumns: ['value'],
  dataColumns: ['passed', 'id'],
  shuffle: true,
  splitTest: false,
  converters: {
    passed: val => (val === 'TRUE' ? 1 : 0)
  }
});

console.log(load);
