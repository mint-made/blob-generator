import { svgElement } from './svgElement.js';
import { rndNoBetween, toggleGrid, markers } from './utility.js';
const gsap = window.gsap;

const d =
  'M-49.866857360976226,62.2012197780392 C-36.499557237727274,70.87649487937277 11.72244346619421,74.14018289413147 16.99765207705331,72.70120535284123 C22.27286068791241,71.26222781155099 48.65496986760411,65.69723488068041 59.030182399766844,49.74689535583017 C69.40539493192958,33.79655583097993 77.2014851677449,-7.133188776057008 73.53325657105879,-18.208816659944336 C69.86502797437267,-29.284444543831665 49.569192962419365,-47.19534501418379 36.08555493635391,-54.074677797958614 C22.601916910288452,-60.954010581733435 10.838590364209562,-67.82857615191455 -7.775996064730624,-62.51621031037292 C-26.39058249367081,-57.203844468831285 -47.871380996993906,-72.73719182283679 -60.800731266232006,-51.32990899363036 C-73.7300815354701,-29.922626164423935 -75.01049554391233,2.383288069575297 -71.84156070414237,13.797785164714272 C-68.6726258643724,25.212282259853247 -63.23415748422518,53.525944676705635 -49.866857360976226,62.2012197780392 Z';

document.querySelector('#gsap-btn').addEventListener('click', function () {
  gsap.to('#blob-z', {
    duration: 1,
    ease: 'elastic.out(1, 0.3)',
    attr: { d: d },
  });
});

const svg = {
  vertices: document.querySelector('#vertices-slider').value,
  initBlob() {
    // event listener to toggle the visibility of markers
    document
      .querySelector('#markers-btn')
      .addEventListener('click', function () {
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
      svg.generateBlob();
    });

    // Init generating a new SVG blob
    this.generateBlob();
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
      let radius = rndNoBetween(60, 80);
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
  generateBlob(vertices = document.querySelector('#vertices-slider').value) {
    markers.removeAll();
    const canvas = document.querySelector('#canvas-board');
    const blob = new svg.Blob(vertices);
    //document.querySelector('#blob-z').setAttributeNS(null, 'd', blob.d);
    gsap.to('#blob-z', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
      attr: { d: blob.d },
    });
    svg.generateMarkers(blob, canvas);
    markers.toggle();
  },
  generateMarkers(blob, canvas) {
    // generate svg lines for each bezier line
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
      // generate svg circles for each point origin of the blob
      canvas.appendChild(
        svgElement.generateCircle(point.origin.x, point.origin.y, 'blue')
      );
      // generate svg circles for each bezier point
      canvas.appendChild(
        svgElement.generateCircle(point.bezier1.x, point.bezier1.y, 'orange')
      );
      canvas.appendChild(
        svgElement.generateCircle(point.bezier2.x, point.bezier2.y, 'red')
      );
    });
    // generate an svg circle for the start point of the svg path.
    canvas.appendChild(
      svgElement.generateCircle(
        blob.startCoords.origin.x,
        blob.startCoords.origin.y,
        'green'
      )
    );
  },
  Blob: function (vertices) {
    this.pointsArray = svg.generateBlobCoords(vertices);
    this.startCoords = this.pointsArray[this.pointsArray.length - 1];
    this.d = svg.generateBlobPath(this.pointsArray, this.startCoords);
  },
};

// function createPath(d) {
//   console.log(d);
//   const path = svgBlob.createSVGElement('path');
//   path.setAttributeNS(null, 'fill', '#8A3FFC');
//   path.setAttributeNS(null, 'd', d);
//   path.setAttributeNS(null, 'transform', 'translate(100 100)');
//   return blob;
// }

svg.initBlob();
