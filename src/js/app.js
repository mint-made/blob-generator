import { svgElement } from './svgElement.js';
import { rndNoBetween, toggleGrid, toggleMarkers } from './utility.js';

const svg = {
  generated: [],
  userInput: {
    corners: 3,
  },
  initBlob() {
    this.corners = document.querySelector('#blob-size').value;
    document
      .querySelector('#markers-btn')
      .addEventListener('click', toggleMarkers);
    document.querySelector('#grid-btn').addEventListener('click', toggleGrid);
    document
      .querySelector('#generate-btn')
      .addEventListener('click', function () {
        alert('clicked');
      });
  },
  generateBlobCoords(n) {
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
  generateBlobPath(pointsArray, start) {
    // Generate d value for path element of the blob
    const pathArray = [`M${start.origin.x},${start.origin.y}`];
    let bezierOrigin = start;
    for (let i = 0; i < pointsArray.length; i++) {
      console.log(pointsArray[i]);
      // Bezier2 point from the current point
      pathArray.push(`C${bezierOrigin.bezier1.x},${bezierOrigin.bezier1.y}`);
      // Bezier1 Point from the destination point
      pathArray.push(`${pointsArray[i].bezier2.x},${pointsArray[i].bezier2.y}`);
      // Point of the destination
      pathArray.push(`${pointsArray[i].origin.x},${pointsArray[i].origin.y}`);
      bezierOrigin = pointsArray[i];
    }
    pathArray.push('Z');
    return pathArray.join(' ');
  },
  Blob: function (vertices) {
    this.pointsArray = svg.generateBlobCoords(vertices);
    this.startCoords = this.pointsArray[this.pointsArray.length - 1];
    this.d = svg.generateBlobPath(this.pointsArray, this.startCoords);
  },
};

// Onload functions
function generate() {
  const canvas = document.querySelector('#canvas-board');
}
const canvas = document.querySelector('#canvas-board');

const blob = new svg.Blob(4);
console.log(blob.origin);

blob.pointsArray.forEach((point) => {
  canvas.appendChild(
    svgElement.generateLine(
      point.bezier1.x,
      point.bezier1.y,
      point.bezier2.x,
      point.bezier2.y,
      'grey'
    )
  );
  canvas.appendChild(
    svgElement.generateCircle(point.origin.x, point.origin.y, 'blue')
  );
  canvas.appendChild(
    svgElement.generateCircle(point.bezier1.x, point.bezier1.y, 'orange')
  );
  canvas.appendChild(
    svgElement.generateCircle(point.bezier2.x, point.bezier2.y, 'red')
  );
});

console.log(blob.d);

canvas.appendChild(
  svgElement.generateCircle(
    blob.startCoords.origin.x,
    blob.startCoords.origin.y,
    'green'
  )
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

svg.initBlob();
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
