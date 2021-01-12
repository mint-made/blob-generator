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
      const rnd = Math.random() / 3 + 1;
      console.log(rnd);
      console.log(item.point.x);
      item.point.x = item.point.x * rnd;
      item.point.y = item.point.y * rnd;
      console.log('x', item.point.x);
    });
    this.start = this.path[2].point;
    this.d = `M ${this.start.x},${this.start.y}
        C${this.path[0].bez1.x},${this.path[0].bez1.y},${this.path[0].bez2.x},${this.path[0].bez2.y},${this.path[0].point.x},${this.path[0].point.y}
        C${this.path[1].bez1.x},${this.path[1].bez1.y},${this.path[1].bez2.x},${this.path[1].bez2.y},${this.path[1].point.x},${this.path[1].point.y}
        C${this.path[2].bez1.x},${this.path[2].bez1.y},${this.path[2].bez2.x},${this.path[2].bez2.y},${this.path[2].point.x},${this.path[2].point.y}
        Z`;
  },
  generate() {
    this.userInput.corners = document.querySelector('#blob-size').value;
    const svgBlob = document.querySelector('#blob-z');
    const blobA = new this.Blob(3);
    console.log(svgBlob.getAttribute('d'));
    console.log(blobA.d);
    svgBlob.setAttribute('d', blobA.d);
    // svgBlob.setAttribute(
    //   'd',
    //   `M 43,26.5
    // C28.9,49.3,  -27.9,49.1,   -44.2,26.2
    // C-56.5,3.3,  -28.2,-42.4,  -5.2,-43.3
    // C28.6,-42.2,  57.1,3.6,    43,26.5
    // Z`
    // );
  },
};
