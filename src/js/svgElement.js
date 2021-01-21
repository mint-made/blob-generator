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
  generateCircle(x, y, color = 'red', display, r = 1.5) {
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
  generateBlobHTMLString(pathDValue) {
    const blobHTMLString = `<svg viewBox="0 0 200 200">
  <path fill="#8A3FFC" d="${pathDValue}" transform="translate(100 100)"/>
</svg>`;
    return blobHTMLString;
  },
};

export { svgElement };
