import { svgElement } from './svgElement.js';
import { rndNoBetween, markers, translateToFixed } from './utility.js';
const gsap = window.gsap;

const svg = {
  colorScheme: {
    start: '#43aa8b',
    blob: '#8A3FFC',
    origin: '#011627',
    bezier1: '#f46036',
    bezier2: '#9e2a2b',
    bezierLines: 'grey',
  },
  vertices: document.querySelector('#vertices-slider').value,
  initBlob() {
    // event listener to toggle the visibility of markers
    document
      .querySelector('#markers-btn')
      .addEventListener('click', function () {
        markers.toggle();
      });
    // event listener to generate a new blob
    document
      .querySelector('#generate-btn')
      .addEventListener('click', function () {
        svg.generateBlob();
      });

    // size event listener
    const vertices = document.querySelector('#vertices-slider');
    vertices.addEventListener('input', function () {
      svg.generateBlob(this.vertices, true);
    });
    // Init generating a new SVG blob
    this.generateBlob();
  },
  generateBlobCoords(n) {
    // Generates n random point origins within n sections of the canvas each with two bezier points
    const sectionAngle = (2 * Math.PI) / n;
    const pointsArray = [];
    for (let i = 0; i < n; i++) {
      const point = {
        origin: {},
        bezier1: {},
        bezier2: {},
      };
      const MIN_RADIUS = 60;
      const MAX_RADIUS = 75;
      // Bezier line length reduces as n increases to ensure Bezier lines do not cross and cause points in the blob
      const BEZIER_LENGTH = (2 * Math.PI * (MIN_RADIUS * 0.85)) / (2 * n);
      // Randomly generates an origin point within a specific section of the canvas
      let angleToOrigin = i * sectionAngle + rndNoBetween(0, sectionAngle / 3);
      const radius = rndNoBetween(MIN_RADIUS, MAX_RADIUS);
      point.origin.x = radius * Math.sin(angleToOrigin);
      point.origin.y = radius * Math.cos(angleToOrigin);

      // Angle to origin is increased to generate a point in an adjacent section of the canvas
      angleToOrigin =
        i * sectionAngle +
        rndNoBetween(sectionAngle / 3, (2 * sectionAngle) / 3);
      const sectionPoint = {};
      sectionPoint.x = radius * Math.sin(angleToOrigin);
      sectionPoint.y = radius * Math.cos(angleToOrigin);
      // Distance of bezier point to the point is calculated
      const distanceFromOrigin = {};
      distanceFromOrigin.x = sectionPoint.x - point.origin.x;
      distanceFromOrigin.y = sectionPoint.y - point.origin.y;
      distanceFromOrigin.hypotenuse = Math.sqrt(
        Math.pow(distanceFromOrigin.x, 2) + Math.pow(distanceFromOrigin.y, 2)
      );
      // Calculate the scale factor to standardise the length of the Bezier lines
      const scaleFactor = BEZIER_LENGTH / distanceFromOrigin.hypotenuse;

      // Generate Bezier points (BEZIER_LENGTH) from the point origin, using the scale factor
      point.bezier1.x = point.origin.x + distanceFromOrigin.x * scaleFactor;
      point.bezier1.y = point.origin.y + distanceFromOrigin.y * scaleFactor;
      point.bezier2.x = point.origin.x - distanceFromOrigin.x * scaleFactor;
      point.bezier2.y = point.origin.y - distanceFromOrigin.y * scaleFactor;

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
  generateBlob(
    vertices = document.querySelector('#vertices-slider').value,
    newNumberOfVertices
  ) {
    markers.removeAll();
    const canvas = document.querySelector('#canvas-board');
    let blob = new svg.Blob(vertices);
    if (newNumberOfVertices) {
      document.querySelector('#blob-svg').setAttributeNS(null, 'd', blob.d);
    } else {
      gsap.to('#blob-svg', {
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
        attr: { d: blob.d },
      });
    }
    svg.generateMarkers(blob, canvas);

    //markers.toggle();
    // Display SVG HTML code for the blob
    document.querySelector('#code-snippet').innerHTML = blob.svgString;
    // Display colored SVG HTML code for the blob
    document.querySelector('#code-snippet-colored').innerHTML =
      blob.coloredSVGString;
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
          this.colorScheme.bezierLines
        )
      );
      // generate svg circles for each point origin of the blob
      canvas.appendChild(
        svgElement.generateCircle(
          point.origin.x,
          point.origin.y,
          this.colorScheme.origin
        )
      );
      // generate svg circles for each bezier point
      canvas.appendChild(
        svgElement.generateCircle(
          point.bezier1.x,
          point.bezier1.y,
          this.colorScheme.bezier1
        )
      );
      canvas.appendChild(
        svgElement.generateCircle(
          point.bezier2.x,
          point.bezier2.y,
          this.colorScheme.bezier2
        )
      );
    });
    // generate an svg circle for the start point of the svg path.
    canvas.appendChild(
      svgElement.generateCircle(
        blob.startCoords.origin.x,
        blob.startCoords.origin.y,
        this.colorScheme.start
      )
    );
  },
  Blob: function (vertices, colorScheme = svg.colorScheme) {
    this.pointsArray = translateToFixed(svg.generateBlobCoords(vertices), 0);
    this.startCoords = this.pointsArray[this.pointsArray.length - 1];
    this.d = svg.generateBlobPath(this.pointsArray, this.startCoords);
    this.svgString = svgElement.generateSVGString(this.d);
    this.coloredSVGString = svgElement.generateColoredSVGString(
      this.pointsArray,
      this.startCoords,
      colorScheme
    );
  },
};

svg.initBlob();
