# In Bloom — Interactive Flower Garden

## Project Overview

**In Bloom** is an interactive digital flower garden that explores the relationship between nature, creativity, and digital interaction.

The website allows visitors to experience an animated flower environment and explore flower customization through interactive elements.

## Live Website

You can access the project here:

**[Visit In Bloom — Interactive Website](https://foreveryoung0122.github.io/)**

## Source Code

The complete project files and original source code are available in the public GitHub repository:

**[GitHub Repository — In Bloom](https://github.com/foreveryoung0122/foreveryoung0122.github.io)**

You can explore the HTML, JavaScript, and other project assets directly in the repository.

## Technical Notes

### Why the Website May Not Work When Opened Locally

This project uses JavaScript ES Modules and Three.js to create its interactive 3D flower animations.

When opening `index.html` directly by double-clicking the file, the browser uses the `file://` protocol. Due to browser security restrictions, JavaScript modules and their imported resources may not load correctly in this environment.

As a result, some interactive features and animations may not display as expected.

The website is therefore hosted on **GitHub Pages**, where it runs over HTTPS and can load its JavaScript modules and related resources correctly.

### Running the Project Locally

If you would like to run the project on your computer, please use a local development server instead of opening the HTML file directly.

For example, with Python installed:

```bash
python3 -m http.server 8000
```

Run this command inside the project folder, then visit:

http://localhost:8000/

This allows the browser to load the website through HTTP rather than directly from the local file system.

## Technologies

- HTML
- CSS
- JavaScript (ES Modules)
- Three.js
- WebGL

## Access

The live website is publicly accessible through GitHub Pages, and the source code is publicly available on GitHub for review.

Thank you for visiting **In Bloom**!
