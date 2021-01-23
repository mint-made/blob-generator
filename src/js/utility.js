function rndNoBetween(x, y, decimalPlaces = 0) {
  // Generates a random number between two values x and y to a selected number of decimal places
  const randomNum = Math.random() * (y - x) + x;
  return randomNum;
}
const markers = {
  toggle() {
    // Toggles visibility for markers of points and bezier lines
    document.querySelectorAll('.circle, .line').forEach((marker) => {
      marker.classList.toggle('display-none');
    });
  },
  removeAll() {
    // Removes markers for points and bezier lines
    document.querySelectorAll('.circle, .line').forEach((marker) => {
      marker.remove();
    });
  },
};
const codeSnippet = {
  toggle() {
    // Toggles visibility for the code snippets
    document
      .querySelectorAll(
        '#code-snippet-colored-container, #code-snippet-container'
      )
      .forEach((marker) => {
        marker.classList.toggle('display-none');
      });
  },
};
function translateToFixed(pointsArray, decimalPoints) {
  pointsArray.forEach((point) => {
    point.bezier1.x = point.bezier1.x.toFixed(decimalPoints);
    point.bezier1.y = point.bezier1.y.toFixed(decimalPoints);
    point.bezier2.x = point.bezier2.x.toFixed(decimalPoints);
    point.bezier2.y = point.bezier2.y.toFixed(decimalPoints);
    point.origin.x = point.origin.x.toFixed(decimalPoints);
    point.origin.y = point.origin.y.toFixed(decimalPoints);
  });
  return pointsArray;
}

export { rndNoBetween, translateToFixed, markers, codeSnippet };
