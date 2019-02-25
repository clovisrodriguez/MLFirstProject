const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function distance(pointA, pointB) {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => [distance(_.initial(row), point), _.last(row)])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function minMax(data, featureCount) {
  const clonendData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = clonendData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonendData.length; j++) {
      clonendData[j][i] = (clonendData[j][i] - min) / (max - min);
    }
  }

  return clonendData;
}

function runAnalysis() {
  const testSetSize = 10;
  const k = 10;

  _.range(0, 3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last()]);
    const [testSet, trainingSet] = splitDataset(
      minMax(outputs, 3),
      testSetSize
    );
    const accuracy = _.chain(testSet)
      .filter(
        testPoint => knn(trainingSet, _.initial(data), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log(`for feature of ${feature} Accuracy: %${accuracy * 100}`);
  });
}
