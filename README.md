## Blob Generator - Web app to randomly create SVG blobs (2021)

### Project Context

Instead of drawing out blobs for use in design and web development, this web app can randomly generate a SVG blob for the user, with a specific number of vertices, displaying the code for them to copy and showing markers to help users better understand Bezier curves. This project was inspired by the [Blob Maker](https://www.blobmaker.app/) by [creative labs](https://zcreativelabs.com/).

### Project Overview

The app allows a user to specify how many vertices the blob will have (<em>n</em>) and the app will generate a blob with this number of Bezier lines. It does this by randomly generating <em>n</em> number of points, with each point having two Bezier points next to it. With these points, the app calculates a path <em>d</em> for the SVG blob element. The app also allows the user to view the points and Bezier lines generated, so they can better understand the makeup of the code for the SVG blob.

### Technologies Utilized

- SVG
- Bezier Lines
- GSAP animation
- HTML / CSS
- JavaScript

### Inspiration

[Blob Maker](https://www.blobmaker.app/) by [creative labs](https://zcreativelabs.com/)

### Attribution

[GSAP by GreenSock](https://greensock.com/gsap/)
