// Javascript program to draw a Voronoi diagram on a canvas element
// date: January 2021
// author: Louison Calbrix

'use strict';

import { voronoi as voronoiDiagram, distance } from './voronoi.js';

// Draw diagram on canvas using colors
const drawVoronoi = function(diagram, colors, canvas) {
    const ctx = canvas.getContext('2d');
    for (let j=0; j<diagram.length; j++)
        for (let i=0; i<diagram[j].length; i++) {
            const point = diagram[j][i];
            ctx.fillStyle = colors[point];
            ctx.fillRect(i, j, 1, 1);
        }
}

// Return an array of rgb values that makes a gradient
const gradient = function([r1, g1, b1], [r2, g2, b2], steps) {
    const colors = new Array();
    for (let i=0; i<steps; i++) {
        const r = r1 + Math.floor((r2 - r1) * i / steps);
        const g = g1 + Math.floor((g2 - g1) * i / steps);
        const b = b1 + Math.floor((b2 - b1) * i / steps);
        colors.push(`rgb(${ r },  ${ g }, ${ b })`);
    }
    return colors;
}

// Return random integer between min and max
const randInt = function(min, max) {
    if (Math.floor(min) >= Math.floor(max))
        throw new Error('randInt: max must be larger than min');
    return Math.floor(Math.random() * (max - min) + min);
}

// Return a random point between [0, 0] and [width, height]
const randomPoint = function(width, height) {
    return [randInt(0, width), randInt(0, height)];
}

// Select canvas
const canvas = document.querySelector('canvas');
const NBPOINTS = 60;
const [WIDTH, HEIGHT] = [500, 400];
canvas.width = WIDTH;
canvas.height = HEIGHT;
const COLORS = gradient([250, 224, 2], [165, 27, 1], NBPOINTS);
// const COLORS = gradient([250, 224, 2], [165, 27, 1], NBPOINTS/2)
//     .concat(gradient([165, 27, 1], [240, 186, 6], NBPOINTS/2));
const points = Array();

// get a set of random points for the voronoi diagram
while (points.length < NBPOINTS) {
    const [x, y] = randomPoint(WIDTH, HEIGHT);
    if (!points.some(([x2, y2]) => (x2 === x && y2 === y)))
        points.push([x, y]);
}

// points.sort(([x1, y1], [x2, y2]) => Math.sqrt(x1**2 + y1**2) - Math.sqrt(x2**2 + y2**2));
const MIDDLE = [WIDTH/2, HEIGHT/2];
points.sort((p1, p2) => distance(p1, MIDDLE) - distance(p2, MIDDLE));

let diagram = voronoiDiagram(points, WIDTH, HEIGHT);
drawVoronoi(diagram, COLORS, canvas);
