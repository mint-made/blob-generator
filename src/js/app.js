const svgBlob = {
  generated: [],
  userInput: {
    corners: 3,
    markers: true,
  },
  Blob: function (corners) {
    this.corners = corners;
    this.start = { x: 43, y: 26 };
    this.path = [
      {
        point: { x: -42, y: 26 },
        bez1: { x: 28, y: 49 },
        bez2: { x: -27, y: 49 },
      },
      {
        point: { x: -5.2, y: -43 },
        bez1: { x: -56, y: 3.3 },
        bez2: { x: -28, y: -42 },
      },
      {
        point: { x: 43, y: 26 },
        bez1: { x: 28, y: -42 },
        bez2: { x: 57, y: 3 },
      },
    ];
    this.path.forEach((item) => {
      const rnd = Math.random() / 10 + 1;
      item.point.x = (item.point.x * rnd).toFixed(0);
      item.point.y = (item.point.y * rnd).toFixed(0);
    });
    this.start = this.path[2].point;
    this.d = `M ${this.start.x},${this.start.y}
        C${this.path[0].bez1.x},${this.path[0].bez1.y},${this.path[0].bez2.x},${this.path[0].bez2.y},${this.path[0].point.x},${this.path[0].point.y}
        C${this.path[1].bez1.x},${this.path[1].bez1.y},${this.path[1].bez2.x},${this.path[1].bez2.y},${this.path[1].point.x},${this.path[1].point.y}
        C${this.path[2].bez1.x},${this.path[2].bez1.y},${this.path[2].bez2.x},${this.path[2].bez2.y},${this.path[2].point.x},${this.path[2].point.y}
        Z`;
  },
  generate() {
    this.removeMarkers();
    this.userInput.corners = document.querySelector('#blob-size').value;
    const svgBlob = document.querySelector('#blob-z');
    const canvasBoard = document.querySelector('#canvas-board');
    const blobA = new this.Blob(3);
    svgBlob.setAttribute('d', blobA.d);
    for (i = 0; i < 3; i++) {
      const svgCircle = this.generateSvgCircle(
        blobA.path[i].point.x,
        blobA.path[i].point.y
      );
      canvasBoard.appendChild(svgCircle);
      const svgLine1 = this.generateSvgLine(
        blobA.path[i].point.x,
        blobA.path[i].point.y,
        blobA.path[i].bez2.x,
        blobA.path[i].bez2.y
      );
      canvasBoard.appendChild(svgLine1);
      if (i < 1) {
        const svgLine2 = this.generateSvgLine(
          blobA.start.x,
          blobA.start.y,
          blobA.path[i].bez1.x,
          blobA.path[i].bez1.y
        );
        canvasBoard.appendChild(svgLine2);
      }
      if (i > 0) {
        const svgLine2 = this.generateSvgLine(
          blobA.path[i - 1].point.x,
          blobA.path[i - 1].point.y,
          blobA.path[i].bez1.x,
          blobA.path[i].bez1.y
        );
        canvasBoard.appendChild(svgLine2);
      }
    }
    console.log(blobA);
    canvasBoard.appendChild(
      this.generateSvgCircle(blobA.start.x, blobA.start.y, 'green')
    );
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
  generateSvgLine(x1, y1, x2, y2) {
    //returns svg <line> html for DOM insertion
    const line = this.createSVGElement('line');
    line.setAttributeNS(null, 'x1', x1);
    line.setAttributeNS(null, 'y1', y1);
    line.setAttributeNS(null, 'x2', x2);
    line.setAttributeNS(null, 'y2', y2);
    line.setAttributeNS(null, 'class', 'line');
    line.setAttributeNS(null, 'style', 'stroke:rgb(255,0,0);stroke-width:1');
    line.setAttributeNS(null, 'transform', 'translate(100 100)');
    return line;
  },
  createSVGElement(tag) {
    // Utility function for creating svg elements
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  },
  removeMarkers() {
    const circles = document.querySelectorAll('.circle');
    const lines = document.querySelectorAll('.line');
    circles.forEach((circle) => circle.remove());
    lines.forEach((line) => line.remove());
  },
};

// Onload functions
svgBlob.generate();
const canvas = document.querySelector('#canvas-board');
canvas.appendChild(svgBlob.generateSvgCircle(0, 0, 'black'));
