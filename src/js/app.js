const svgBlob = {
  generated: [],
  userInput: {
    size: 0,
  },
  Blob: function (id) {
    this.id = id;
  },
  Square: function (id) {},
  generate() {
    this.userInput.size = document.querySelector('#blob-size').value;
    const rectangle = document.querySelector('#rectangle');
    console.log(rectangle);
    rectangle.setAttribute('width', this.userInput.size * 10);
  },
};
