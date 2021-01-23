const svgElement = {
  createElement(tag) {
    // returns an svg elements with the tag provided
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  },

  generateLine(x1, y1, x2, y2, color = 'red', display) {
    //returns svg <line> html for DOM insertion
    const line = this.createElement('line');
    line.setAttributeNS(null, 'x1', x1);
    line.setAttributeNS(null, 'y1', y1);
    line.setAttributeNS(null, 'x2', x2);
    line.setAttributeNS(null, 'y2', y2);
    line.setAttributeNS(null, 'class', 'line');
    line.setAttributeNS(null, 'style', `stroke:${color};stroke-width:1`);
    line.setAttributeNS(null, 'transform', 'translate(100 100)');
    if (display === false) {
      line.classList.add('display-none');
    }
    return line;
  },
  generateCircle(x, y, color = 'red', display, r = 2.5) {
    // Returns svg <circle> html for DOM insertion
    const circle = this.createElement('circle');
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', r);
    circle.setAttributeNS(null, 'class', 'circle');
    circle.setAttributeNS(null, 'fill', color);
    circle.setAttributeNS(null, 'transform', 'translate(100 100)');
    if (display === false) {
      circle.classList.add('display-none');
    }
    return circle;
  },
  generateSVGString(pathDValue, colorScheme) {
    const blobHTMLString = `&lt;svg viewBox="0 0 200 200"&gt;
    &lt;path fill="${colorScheme.blob}" d="${pathDValue}" transform="translate(100 100)"/&gt;
    &lt;/svg&gt;`;
    return blobHTMLString;
  },
  generateColoredSVGString(pointsArray, startPoint, colorScheme) {
    let svgStringArray = [
      `&lt;svg viewBox="0 0 200 200"&gt;
    &lt;path fill="<span style="background-color:${colorScheme.blob}">${colorScheme.blob}</span>" d="M<span style="background-color:${colorScheme.start}">${startPoint.origin.x},${startPoint.origin.y}</span>`,
    ];

    // Loop through points array inserting colored spans for the different points
    let bezierOrigin = startPoint;
    for (let i = 0; i < pointsArray.length; i++) {
      // Bezier2 point from the current point
      svgStringArray.push(
        `C<span style="background-color:${colorScheme.bezier1}">${bezierOrigin.bezier1.x},${bezierOrigin.bezier1.y}</span>`
      );
      // Bezier1 Point from the destination point
      svgStringArray.push(
        `<span style="background-color:${colorScheme.bezier2}">${pointsArray[i].bezier2.x},${pointsArray[i].bezier2.y}</span>`
      );
      // Point of the destination
      svgStringArray.push(
        `<span style="background-color:${colorScheme.origin}">${pointsArray[i].origin.x},${pointsArray[i].origin.y}</span>`
      );
      bezierOrigin = pointsArray[i];
    }

    svgStringArray.push(`Z" transform="translate(100 100)"/&gt;
    &lt;/svg&gt;`);
    return svgStringArray.join(' ');
  },
};

export { svgElement };
