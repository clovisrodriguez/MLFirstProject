require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('../load-csv');
const LinearRegression = require('./linear-regression');
const plot = require('node-remote-plot');

let { features, labels, testFeatures, testLabels } = loadCSV('../data/cars.csv', {
  shuffle: true,
  splitTest: 50,
  dataColumns: [
    'cylinders',
    'displacement',
    'horsepower',
    'weight',
    'acceleration',
    'modelyear'
  ],
  labelColumns: ['mpg']
});

const regression = new LinearRegression(features, labels, {
  learningRate: 0.1,
  iterations: 5,
  batchSize: 3
});

regression.train();

plot({
  x: regression.mseHistory.reverse(),
  xLabel: 'Iteration #',
  yLabel: 'Mean Squared Error'
});

regression.predict([
  [4, 90, 48, 0.99, 21.5, 78],
  [4, 108, 75, 1.13, 15.2, 74]
])