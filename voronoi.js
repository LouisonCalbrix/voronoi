// Javascript program to compute a voronoi diagram
// date: January 2021
// author: Louison Calbrix

'use strict';

// value for points when the cell to which they belong hasn't been computed yet
const NA = -1;

// Return the distance between two points
const distance = function([x1, y1], [x2, y2]) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

// Return the voronoi diagram in the form of a 2D array
const voronoi = function(points, width, height) {
    const vorArray = new Array(height);
    for (let i=0; i<height; i++)
        vorArray[i] = new Array(width).fill(NA);

    // Closure:
    // Return the closest point among the points array
    const getClosest = function([x, y]) {
        if (vorArray[y][x] === NA) {
            const distances = points.map(point => distance(point, [x, y]));
            let min = 0;
            distances.forEach((dist, i) => { if (dist<distances[min]) min = i; });
            vorArray[y][x] = min;
        }
        return vorArray[y][x];
    }

    // Add the whole picture as the first quadrant
    const quadrants = new Array({
        x: 0, 
        y: 0,
        width,
        height
    });
    // As long as all the quadrants haven't been processed
    while (quadrants.length !== 0) {
        const {x, y, width, height} = quadrants.shift();
        const [upperLeft, upperRight, bottomLeft, bottomRight] = 
            [[x, y], [x+width-1, y], [x, y+height-1], [x+width-1, y+height-1]];
        const closest1 = getClosest(upperLeft);

        if (closest1 === getClosest(upperRight) &&
            // assign all points in the current quadrant to the same cell
            closest1 === getClosest(bottomLeft) &&
            closest1 === getClosest(bottomRight)) {
            for (let j=y; j<y+height; j++)
                for (let i=x; i<x+width; i++)
                    vorArray[j][i] = closest1;
        } else {
            // divide current quadrant into four smaller ones and recursively process
            const subWidth1 = Math.floor(width/2);
            const subWidth2 = width - subWidth1;
            const subHeight1 = Math.floor(height/2);
            const subHeight2 = height - subHeight1;
            if (subWidth1 !== 0) {
                if (subHeight1 !== 0)
                    quadrants.push({
                        x: x,
                        y: y,
                        width: subWidth1,
                        height: subHeight1
                    });
                quadrants.push({
                    x: x,
                    y: y+subHeight1,
                    width: subWidth1,
                    height: subHeight2
                });
            }
            if (subHeight1 !== 0)
                quadrants.push({
                    x: x+subWidth1,
                    y: y,
                    width: subWidth2,
                    height: subHeight1
                });
            quadrants.push({
                x: x+subWidth1,
                y: y+subHeight1,
                width: subWidth2,
                height: subHeight2
            });
        }
    }

    return vorArray;
}

export { voronoi, distance };
