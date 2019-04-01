require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('../load-csv');
const LogisticRegressions = require('./logistic-regression');
const plot = require('node-remote-plot');

const { features, labels, testFeatures, testLabels } = loadCSV(
  '../data/cars.csv',
  {
    dataColumns: ['horsepower', 'displacement', 'weight'],
    labelColumns: ['passedemissions'],
    shuffle: true,
    splitTest: 50,
    converters: {
      passedemissions: value => (value === 'TRUE' ? 1 : 0)
    }
  }
);

const regression = new LogisticRegressions(features, labels, {
  learningRate: 0.5,
  iterations: 30,
  batchSize: 3,
  decisionBoundary: 0.47
});

regression.train();

console.log(regression.test(testFeatures, testLabels));

plot({
  x: regression.costHistory.reverse()
})