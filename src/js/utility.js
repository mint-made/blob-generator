function rndNoBetween(x, y, decimalPlaces = 0) {
  // Generates a random number between two values x and y to a selected number of decimal places
  const randomNum = Math.random() * (y - x) + x;
  return randomNum;
}

export default rndNoBetween;
