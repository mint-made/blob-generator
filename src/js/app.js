import rndNoBetween from './utility.js';

const svgBlob = {
  generated: [],
  userInput: {
    corners: 3,
    markers: true,
  },
  init() {
    this.corners = document.querySelector('#blob-size').value;
  },
  generatePoints(n) {
    // Generates n random points within n sections of the canvas
    // Returns n number of points in an array
    const sectionAngle = (2 * Math.PI) / n;
    const pointsArray = [];
    for (let i = 0; i < n; i++) {
      const point = {
        origin: {},
        bezier1: {},
        bezier2: {},
      };
      // Generate point origin coordinate
      let angleToOrigin = i * sectionAngle + rndNoBetween(0, sectionAngle / 3);
      let radius = rndNoBetween(40, 60);
      point.origin.x = radius * Math.sin(angleToOrigin);
      point.origin.y = radius * Math.cos(angleToOrigin);

      // Randomly generate 1st bezier point
      angleToOrigin =
        i * sectionAngle +
        rndNoBetween(sectionAngle / 3, (2 * sectionAngle) / 3);
      point.bezier1.x = radius * Math.sin(angleToOrigin);
      point.bezier1.y = radius * Math.cos(angleToOrigin);

      // Generate 2nd bezier point from the 1st bezier point.
      point.bezier2.x = point.origin.x + (point.origin.x - point.bezier1.x);
      point.bezier2.y = point.origin.y + (point.origin.y - point.bezier1.y);

      pointsArray.push(point);
    }
    return pointsArray;
  },
  translateToFixed(pointsArray, decimalPoints) {
    pointsArray.forEach((point) => {
      point.bezier1.x = point.bezier1.x.toFixed(decimalPoints);
      point.bezier1.y = point.bezier1.y.toFixed(decimalPoints);
      point.bezier2.x = point.bezier2.x.toFixed(decimalPoints);
      point.bezier2.y = point.bezier2.y.toFixed(decimalPoints);
      point.origin.x = point.origin.x.toFixed(decimalPoints);
      point.origin.y = point.origin.y.toFixed(decimalPoints);
    });
    return pointsArray;
  },
  Blob: function (vertices) {
    this.pointsArray = svgBlob.translateToFixed(
      svgBlob.generatePoints(vertices),
      0
    );
    this.start = this.pointsArray[this.pointsArray.length - 1];

    const pathArray = [`M${this.start.origin.x},${this.start.origin.y}`];
    let bezierOrigin = this.start;
    for (let i = 0; i < this.pointsArray.length; i++) {
      console.log(this.pointsArray[i]);
      // Bezier2 point from the current point
      pathArray.push(`C${bezierOrigin.bezier1.x},${bezierOrigin.bezier1.y}`);
      // Bezier1 Point from the destination point
      pathArray.push(
        `${this.pointsArray[i].bezier2.x},${this.pointsArray[i].bezier2.y}`
      );
      // Point of the destination
      pathArray.push(
        `${this.pointsArray[i].origin.x},${this.pointsArray[i].origin.y}`
      );
      bezierOrigin = this.pointsArray[i];
    }
    pathArray.push('Z');
    this.d = pathArray.join(' ');
  },
  generateSvgCircle(x, y, color = 'red', r = 1.75) {
    // Returns svg <circle> html for DOM insertion
    const circle = this.createSVGElement('circle');
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', r);
    circle.setAttributeNS(null, 'class', 'circle');
    circle.setAttributeNS(null, 'fill', color);
    circle.setAttributeNS(null, 'transform', 'translate(100 100)');
    return circle;
  },
  generateSvgLine(x1, y1, x2, y2, color = 'red') {
    //returns svg <line> html for DOM insertion
    const line = this.createSVGElement('line');
    line.setAttributeNS(null, 'x1', x1);
    line.setAttributeNS(null, 'y1', y1);
    line.setAttributeNS(null, 'x2', x2);
    line.setAttributeNS(null, 'y2', y2);
    line.setAttributeNS(null, 'class', 'line');
    line.setAttributeNS(null, 'style', `stroke:${color};stroke-width:1`);
    line.setAttributeNS(null, 'transform', 'translate(100 100)');
    return line;
  },
  createSVGElement(tag) {
    // Utility function for creating svg elements
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  },
  removeMarkers() {
    // Removes markers for the blobs bezier lines and the cicles showing the blobs points
    const circles = document.querySelectorAll('.circle');
    const lines = document.querySelectorAll('.line');
    circles.forEach((circle) => circle.remove());
    lines.forEach((line) => line.remove());
  },
};

// Onload functions
const canvas = document.querySelector('#canvas-board');

const blob = new svgBlob.Blob(4);
console.log(blob.origin);

blob.pointsArray.forEach((point) => {
  canvas.appendChild(
    svgBlob.generateSvgCircle(point.origin.x, point.origin.y, 'blue')
  );
  canvas.appendChild(
    svgBlob.generateSvgCircle(point.bezier1.x, point.bezier1.y, 'orange')
  );
  canvas.appendChild(
    svgBlob.generateSvgCircle(point.bezier2.x, point.bezier2.y, 'red')
  );
  canvas.appendChild(
    svgBlob.generateSvgLine(
      point.bezier1.x,
      point.bezier1.y,
      point.bezier2.x,
      point.bezier2.y,
      'grey'
    )
  );
});

console.log(blob.d);

canvas.appendChild(
  svgBlob.generateSvgCircle(blob.start.origin.x, blob.start.origin.y, 'green')
);

function createPath(d) {
  console.log(d);
  const path = svgBlob.createSVGElement('path');
  path.setAttributeNS(null, 'fill', '#8A3FFC');
  path.setAttributeNS(null, 'd', d);
  path.setAttributeNS(null, 'transform', 'translate(100 100)');
  return blob;
}

const blobby = document.querySelector('#blob-z');
blobby.setAttributeNS(null, 'd', blob.d);

/*
<path
          id="blob-z"
          class="blob"
          fill="#8A3FFC"
          d="M 43,26.5
          C28.9,49.3,  -27.9,49.1,   -42.2,26.2
          C-56.5,3.3,  -28.2,-42.4,  5.2,-43.3
          C28.6,-42.2,  57.1,3.6,    43,26.5
          Z"
          transform="translate(100 100)"
        />

<path
          id="blob-z"
          class="blob"
          fill="#8A3FFC"
          d="M-56,4, C-73,-32, 36,24, 25,35, C-73,-32, 21,-48, 38,-36, C-73,-32, -39,41, -56,4 Z"
          transform="translate(100 100)"
        />



*/
