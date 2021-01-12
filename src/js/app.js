const svgBlob = {
  generated: [],
  userInput: {
    corners: 3,
  },
  Blob: function (corners) {
    this.corners = corners;
    this.start = { x: 43, y: 26.5 };
    this.path = [
      {
        point: { x: -42.2, y: 26.2 },
        bez1: { x: 28.9, y: 49.3 },
        bez2: { x: -27.9, y: 49.1 },
      },
      {
        point: { x: -5.2, y: -43.3 },
        bez1: { x: -56.5, y: 3.3 },
        bez2: { x: -28.2, y: -42.4 },
      },
      {
        point: { x: 43, y: 26.5 },
        bez1: { x: 28.6, y: -42.2 },
        bez2: { x: 57.1, y: 3.6 },
      },
    ];
    this.path.forEach((item) => {
      const rnd = Math.random() / 10 + 1;
      item.point.x = item.point.x * rnd;
      item.point.y = item.point.y * rnd;
    });
    this.start = this.path[2].point;
    this.d = `M ${this.start.x},${this.start.y}
        C${this.path[0].bez1.x},${this.path[0].bez1.y},${this.path[0].bez2.x},${this.path[0].bez2.y},${this.path[0].point.x},${this.path[0].point.y}
        C${this.path[1].bez1.x},${this.path[1].bez1.y},${this.path[1].bez2.x},${this.path[1].bez2.y},${this.path[1].point.x},${this.path[1].point.y}
        C${this.path[2].bez1.x},${this.path[2].bez1.y},${this.path[2].bez2.x},${this.path[2].bez2.y},${this.path[2].point.x},${this.path[2].point.y}
        Z`;
  },
  generate() {
    this.clearCanvas();
    this.userInput.corners = document.querySelector('#blob-size').value;
    const svgBlob = document.querySelector('#blob-z');
    const canvasBoard = document.querySelector('#canvas-board');
    const blobA = new this.Blob(3);
    svgBlob.setAttribute('d', blobA.d);
    blobA.path.forEach((item) => {
      const svgCircle = this.generateSvgCircle(item.point.x, item.point.y);
      canvasBoard.appendChild(svgCircle);
    });
  },
  generateSvgCircle(x, y, r = 1, color = 'red') {
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
  createSVGElement(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  },
  clearCanvas() {
    const circles = document.querySelectorAll('.circle');
    circles.forEach((item) => {
      item.remove();
    });
  },
};
