
// Scales and Axis (eventually use band scale for y-axis)
const width = 1100;
const height = 450;

const moveX = 40; // Space between your Y-axis and first bar

const barWidth = 30;

// === Leave this scale in tact. Fill in reverseHeightScale ===
const heightScale = d3.scale.linear()
  .domain([0, 1050])
  .range([0, height]);

const reverseHeightScale = d3.scale.linear()
  .domain([]) // Min and max value. See heightScale for reference
  .range([]); // How tall you want axis to be. See heightScale


// For Y-axis
const axis = d3.svg.axis()
  .ticks(/*number here*/) // How many ticks you want
  .tickSize(5)
  .tickPadding(5)
  .scale(reverseHeightScale)
  .orient("left");


const svgContainer = d3.select("section")
.append(/*element here*/)
.attr("class", "background")
.attr(/*attribute here*/) // You have height below. What else do you need?
.attr("height", height+100)
.append("g")
.attr("class", "content")
.attr("transform", `translate(${moveX}, -10)`);

const marginSpace = 10;

// Use this reference for data binding
// function processData(data, number) {
//   Function given in another file
// }

// Set function to update with new data
function update(data, number) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  // Rectangles using data binding
  const otherRectangles = svgContainer.selectAll(".bar")
  .data(/*data here*/); // See above for referencing data

  // Updating month title
  document.querySelector("span").textContent = `${monthNames[number-1]}`;


  // === For transition effect. Leave this as is ===
  // Updating old elements that are present in new data
  otherRectangles.transition(t)
  .attr("x", (d, i) => categoryScale(i))
  .attr("y", (d, i) => height - heightScale(d.Cost) + 1)
  .attr("width", barWidth)
  .attr("height", (d, i) => heightScale(d.Cost) + 1)
  .attr("fill", (d, i) => colorBars(d.Cost, d.Goal, d.Color, i));

  // Creating bars
  otherRectangles.enter()
  .append(/*shape here*/)
  .attr(/*class here*/)
  .attr(/*shape attr here*/, (d, i) => categoryScale(i))
  .attr(/*shape attr here*/, (d, i) => height - heightScale(d.Cost) + 1)
  .attr(/*shape attr here*/, barWidth)
  .attr("height", 0)
  // attributes below for fill and transition. Leave as is
  .attr("fill-opacity", 0.1)
  .transition(t)
  .attr("fill-opacity", 1)
  .attr("fill", (d, i) => colorBars(d.Cost, d.Goal, d.Color, i))
  .attr("height", (d, i) => heightScale(d.Cost) + 1);

  // === This creates dashed goal lines. You can leave as is ===
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
