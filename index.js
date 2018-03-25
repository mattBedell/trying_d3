// Points connect to the next closest point

import * as d3 from 'd3';

const stage = document.querySelector('svg');
const svg = d3.selectAll('svg');
const circle = svg.selectAll('circle');

let data = [];
let lineP = [];

function updateCircles(data) {
  let circles = svg.selectAll('circle').data(data, (d, i) => i);

  circles
  .attr('cx', (d, i) => d[0])
  .attr('cy', (d, i) => d[1])

  circles.enter().append('circle')
  .attr('cx', (d, i) => d[0])
  .attr('cy', (d, i) => d[1])
  .attr('r', 2)
  .style('fill', 'gray')

  circles.exit().remove();
};

function updateLines(data) {
  let lines = svg.selectAll('line').data(data, (d, i) => i);
  
  lines
  .attr('x2', (d, i) => calcLines(d,i)[1][0])
  .attr('y2', (d, i) => calcLines(d,i)[1][1])

  .enter().append('line')
  .attr('x1', (d, i) => calcLines(d,i)[0][0])
  .attr('y1', (d, i) => calcLines(d,i)[0][1])
  .attr('x2', (d, i) => calcLines(d,i)[1][0])
  .attr('y2', (d, i) => calcLines(d,i)[1][1])
  .attr('stroke-width', .5)
  .attr('stroke', 'gray')
}

function calcLines(point, i) {
  let c = point;
  let c2 = [1000, 1000];

  let f = data.reduce((oldP, newP, j) => {
    if (i === j) {
      return [c, c2];
    };

    let oldDist = getDistance(point, c2);
    let newDist = getDistance(point, [newP[0], newP[1]]);

    if (newDist < oldDist) {
      c2[0] = newP[0];
      c2[1] = newP[1];
    }

    return [point, c2];
  }, [point, c2]);
  return f;
}

function getDistance(c1, c2) {
  const x = Math.pow(c2[0] - c1[0], 2);
  const y = Math.pow(c2[1] - c1[1], 2);
  return Math.sqrt((x + y));
}

stage.addEventListener('click', e => {
  const pt = stage.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;

  const {x, y} = pt.matrixTransform(stage.getScreenCTM().inverse());

  data.push([x, y]);
  updateCircles(data);
  updateLines(data);
});
