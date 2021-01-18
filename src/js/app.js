import { svgElement } from './svgElement.js';
import { rndNoBetween, toggleGrid, markers } from './utility.js';

const svg = {
  displayMarkers: true,
  vertices: document.querySelector('#vertices-slider').value,
  initBlob() {
    // event listener to toggle the visibility of markers
    document
      .querySelector('#markers-btn')
      .addEventListener('click', function () {
        this.displayMarkers = !this.displayMarkers;
        markers.toggle();
      });
    // event listener to toggle visibility of the grid
    document.querySelector('#grid-btn').addEventListener('click', toggleGrid);
    // event listener to generate a new blob
    document
      .querySelector('#generate-btn')
      .addEventListener('click', function () {
        svg.generateBlob();
      });

    // size event listener
    const vertices = document.querySelector('#vertices-slider');
    vertices.addEventListener('input', function () {
      svg.generateBlob(vertices.value);
    });

    // Init generating a new SVG blob
    this.generateBlob(this.vertices);
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
  generateBlobPath(pointsArray, startPoint) {
    // Generate d value for path element of the blob
    const pathArray = [`M${startPoint.origin.x},${startPoint.origin.y}`];
    let bezierOrigin = startPoint;
    for (let i = 0; i < pointsArray.length; i++) {
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
  generateBlob(vertices = this.vertices) {
    markers.removeAll();
    const canvas = document.querySelector('#canvas-board');
    const blob = new svg.Blob(vertices);
    svg.generateMarkers(blob, canvas, svg.displayMarkers);
  },
  generateMarkers(blob, canvas, display = this.displayMarkers) {
    // generate svg lines for each bezier line
    blob.pointsArray.forEach((point) => {
      canvas.appendChild(
        svgElement.generateLine(
          point.bezier1.x,
          point.bezier1.y,
          point.bezier2.x,
          point.bezier2.y,
          'grey',
          display
        )
      );
      // generate svg circles for each point origin of the blob
      canvas.appendChild(
        svgElement.generateCircle(
          point.origin.x,
          point.origin.y,
          'blue',
          display
        )
      );
      // generate svg circles for each bezier point
      canvas.appendChild(
        svgElement.generateCircle(
          point.bezier1.x,
          point.bezier1.y,
          'orange',
          display
        )
      );
      canvas.appendChild(
        svgElement.generateCircle(
          point.bezier2.x,
          point.bezier2.y,
          'red',
          display
        )
      );
    });
    // generate an svg circle for the start point of the svg path.
    canvas.appendChild(
      svgElement.generateCircle(
        blob.startCoords.origin.x,
        blob.startCoords.origin.y,
        'green',
        display
      )
    );

    // select and update the svg blob path d
    const blobSVG = document.querySelector('#blob-z');
    document.querySelector('#blob-z').setAttributeNS(null, 'd', blob.d);
  },
  Blob: function (vertices) {
    this.pointsArray = svg.generateBlobCoords(vertices);
    this.startCoords = this.pointsArray[this.pointsArray.length - 1];
    this.d = svg.generateBlobPath(this.pointsArray, this.startCoords);
  },
};

// Onload functions
// const canvas = document.querySelector('#canvas-board');
// const blob = new svg.Blob(4);

// blob.pointsArray.forEach((point) => {
//   canvas.appendChild(
//     svgElement.generateLine(
//       point.bezier1.x,
//       point.bezier1.y,
//       point.bezier2.x,
//       point.bezier2.y,
//       'grey'
//     )
//   );
//   canvas.appendChild(
//     svgElement.generateCircle(point.origin.x, point.origin.y, 'blue')
//   );
//   canvas.appendChild(
//     svgElement.generateCircle(point.bezier1.x, point.bezier1.y, 'orange')
//   );
//   canvas.appendChild(
//     svgElement.generateCircle(point.bezier2.x, point.bezier2.y, 'red')
//   );
// });

// canvas.appendChild(
//   svgElement.generateCircle(
//     blob.startCoords.origin.x,
//     blob.startCoords.origin.y,
//     'green'
//   )
// );

// function createPath(d) {
//   console.log(d);
//   const path = svgBlob.createSVGElement('path');
//   path.setAttributeNS(null, 'fill', '#8A3FFC');
//   path.setAttributeNS(null, 'd', d);
//   path.setAttributeNS(null, 'transform', 'translate(100 100)');
//   return blob;
// }

// const blobby = document.querySelector('#blob-z');
// blobby.setAttributeNS(null, 'd', blob.d);

svg.initBlob();
