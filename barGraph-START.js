
// Scales and Axis (eventually use band scale for y-axis)
const width = 1100;
const height = 450;

const moveX = 40;

const barWidth = 30;

const heightScale = d3.scale.linear()
  .domain([0, 1050])
  .range([0, height]);

const reverseHeightScale = d3.scale.linear()
  .domain([0, 1050])
  .range([height, 0]);

// const categoryScale = d3.scale.ordinal()
//   .domain(d3.range(categoryLength))
//   .rangeRoundBands([0, width], .1);



const axis = d3.svg.axis()
  .ticks(20)
  .tickSize(5)
  .tickPadding(5)
  .scale(reverseHeightScale)
  .orient("left");


// Without d3.json import
const svgContainer = d3.select("section").append("svg")
.attr("class", "background")
.attr("width", width)
.attr("height", height+100)
.append("g")
.attr("class", "content")
.attr("transform", `translate(${moveX}, -10)`);

const marginSpace = 10;


// Set function to update with new data
function update(data, number) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  // Rectangles using data
  const otherRectangles = svgContainer.selectAll(".bar")
  .data(processData(data, number));

  // Updating month title
  document.querySelector("span").textContent = `${monthNames[number-1]}`;

  // Updating old elements that are present in new data
  otherRectangles.transition(t)
  .attr("x", (d, i) => categoryScale(i))
  .attr("y", (d, i) => height - heightScale(d.Cost) + 1)
  .attr("width", barWidth)
  .attr("height", (d, i) => heightScale(d.Cost) + 1)
  .attr("fill", (d, i) => colorBars(d.Cost, d.Goal, d.Color, i));

  // Creating bars
  otherRectangles.enter()
  .append("rect")
  .attr("class", "bar")
  // .attr("x", (d, i) => i * xDistance)
  .attr("x", (d, i) => categoryScale(i))
  .attr("y", (d, i) => height - heightScale(d.Cost) + 1)
  .attr("width", barWidth)
  .attr("height", 0)
  .attr("fill-opacity", 0.1)
  .transition(t)
  .attr("fill-opacity", 1)
  .attr("fill", (d, i) => colorBars(d.Cost, d.Goal, d.Color, i))
  .attr("height", (d, i) => heightScale(d.Cost) + 1);

  // Creating goal lines
  otherRectangles.enter()
  .append("line")
  .attr("class", "goalLine")
  // .attr("x1", (d, i) => i * xDistance)
  .attr("x1", (d, i) => categoryScale(i))
  .attr("y1", d => (d.Goal) ? height - heightScale(d.Goal) : null)
  // .attr("x2", (d, i) => (i * xDistance) + barWidth)
  .attr("x2", (d, i) => categoryScale(i) + barWidth)
  .attr("y2", d => (d.Goal) ? height - heightScale(d.Goal) : null)
  .attr("stroke-dasharray", 3.2)
  .attr("stroke", d => (d.Cost > d.Goal) ? "white" : "black")
  .attr("opacity", 0.4);

}


// Calling the axis
svgContainer.append("g")
  .attr("class", "yAxis")
  .attr("transform", `translate(-8, 3)`)
  .call(axis);


// Changing the data each second
let numeric = 1;
setInterval(() => {
  if (!pause) {
    update(dataset, numeric);
    numeric++;
    if (numeric > 12) {
      numeric = 1;
    }
  }
}, 1500);
