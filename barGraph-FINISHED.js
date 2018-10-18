const dataset = [];
console.time("Getting data");
// fetch('https://gist.githubusercontent.com/alexrogers823/00de045f0858cc42e490464349824022/raw/934a543b52060e07008e799247910f9d8c91a544/expenses.json')
// fetch('https://raw.githubusercontent.com/alexrogers823/interactiveBarGraph/master/InteractiveBarGraph/month_expenses_2016.json')
fetch('https://raw.githubusercontent.com/alexrogers823/interactiveBarGraph/master/month_expenses_2016.json')
  .then(blob => blob.json())
  .then(data => {
    console.timeEnd("Getting data");
    // console.log(dataset);
    // console.log(data);
    dataset.push(...data);
    // console.log(dataset);
  });

// const categoryWords = [];
// fetch('https://raw.githubusercontent.com/alexrogers823/interactiveBarGraph/master/InteractiveBarGraph/CategoryWords.json')
//   .then(blob => blob.json())
//   .then(data => categoryWords.push(data)); //no spread because it isn't array-based JSON
//
// let categoryLabels, categoryLength;
// let dataReady = false;
// let test = async function() {
//   let fetcher = await fetch('https://gist.githubusercontent.com/alexrogers823/73335d86e2516993face9f7818bd9955/raw/89fa5fb90db60ff0949fd8af2d629b39d47d9dc6/barGraphCategories.json')
//   // const response = await fetcher.json()
//   .then(res => res.json())
//   .then(res => res)
//   .catch(err => console.error(err));
//   return fetcher
//
//   // console.log('response: ',response);
//   // return response;
// };
// console.log(test());
// console.log('dat; ',data);
// console.log('data: ',data);
  // .then(data => {
  //   // categoryLabels = Object.assign({}, data);
  //   // cateogryLabels = JSON.parse(JSON.stringify(data));
  //   categoryLabels = data;
  //   dataReady = true;
  //   console.log(categoryLabels);
  //   categoryLength =  Object.keys(categoryLabels).length;
  //   xDistance = (width - moveX)/categoryLength;
  // });


// Category labels. Find a way to add directly from month expenses data
const categoryLabels = {
  "Rent": {
    "labels": ["Rent"],
    "goal": 800,
    "color": [209, 145, 105]
  },
  "Utilities": {
    "labels": ["Util", "Utility", "Utilities"],
    "goal": 225,
    "color": [165, 20, 165]
  },
  "Phone": {
    "labels": ["Phone"],
    "goal": 65,
    "color": [70, 150, 215]
  },
  "Apparel": {
    "labels": ["Clothes"],
    "goal": 50,
    "color": [195, 195, 30]
  },
  "Supplies": {
    "labels": ["Supplies", "Rain", "Bed"],
    "goal": 150,
    "color": [42, 193, 243]
  },
  "Technology": {
    "labels": ["Tech"],
    "goal": 60,
    "color": [30, 240, 100]
  },
  "Services": {
    "labels": ["Services", "Dry Cleaning", "Eyebrows"],
    "goal": 30,
    "color": [141, 155, 20]
  },
  "Health/Gym": {
    "labels": ["Health", "Gym"],
    "goal": 50,
    "color": [164, 72, 235]
  },
  "Haircut": {
    "labels": ["Haircut"],
    "goal": 40,
    "color": [99, 196, 126]
  },
  "Groceries": {
    "labels": ["Groceries"],
    "goal": 200,
    "color": [143, 15, 166]
  },
  "Other Food": {
    "labels": ["Other Food", "Res", "Snack", "Snacks", "Coffee", "Drink"],
    "goal": 300,
    "color": [15, 242, 28]
  },
  "Gas & Parking": {
    "labels": ["Gas", "Parking"],
    "goal": 30,
    "color": [34, 38, 141]
  },
  "Insurance": {
    "labels": ["Insurance"],
    "goal": 40,
    "color": [188, 159, 198]
  },
  "Bank & Credit Card": {
    "labels": ["Credit Card", "Interest", "Atm", "Cc", "Venmo"],
    "goal": 40,
    "color": [62, 141, 138]
  },
  "Student Loans": {
    "labels": ["Student Loans"],
    "goal": 400,
    "color": [206, 117, 92]
  },
  "Vehicle Payments": {
    "labels": ["Vehicle Payments", "Motorcycle", "Car"],
    "goal": 300,
    "color": [115, 73, 238]
  },
  "Entertainment": {
    "labels": ["Movies", "Bowling"],
    "goal": 30,
    "color": [206, 18, 160]
  },
  "Subscriptions": {
    "labels": ["Subscription", "Subscriptions", "Sub", "Spotify", "Xxx"],
    "goal": 25,
    "color": [124, 232, 134]
  },
  "Travel": {
    "labels": ["Travel", "Flight"],
    "goal": 300,
    "color": [118, 55, 65]
  },
  "Public Transportation": {
    "labels": ["Uber", "Marta", "Transporation"],
    "goal": 25,
    "color": [252, 158, 155]
  },
  "Special/Seasonal": {
    "labels": ["Special", "Seasonal", "Graduation", "Gift", "Spring Break", "Recital", "Contacts"],
    "goal": null,
    "color": [227, 250, 194]
  },
  "Other": {
    "labels": ["Other"],
    "goal": null,
    "color": [100, 100, 100]
  }
}

// Scales and Axis (eventually use band scale for y-axis)
const width = 1100;
const height = 450;
const categoryLength = Object.keys(categoryLabels).length;
const moveX = 40;
let xDistance = (width - moveX)/categoryLength;
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

const categoryScale = d3.scale.linear()
  .domain([0, categoryLength])
  .range([moveX, width]); //moveX + yAxis distance

const axis = d3.svg.axis()
  .ticks(20)
  .tickSize(5)
  .tickPadding(5)
  .scale(reverseHeightScale)
  .orient("left");

const categoryAxis = d3.svg.axis()
  .ticks(categoryLength)
  .tickSize(2)
  .tickPadding(45)
  .scale(categoryScale)
  .tickFormat((d, i) => {
    categoryNames = [];
    for (let prop in categoryLabels) {
      categoryNames.push(prop);
    }
    return categoryNames[i];
  })
  .orient("bottom");

// set variable for smooth transition
const t = d3.transition().duration(750);


// Without d3.json import
const svgContainer = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height+70)
.append("g")
.attr("transform", `translate(${moveX}, -10)`);
// .call(axis);

const marginSpace = 10;


function processData(data, number) {
  let obj = data[0][`month${number}`].Expenses;
  let newDataSet = [];
  // console.log(obj);
  let totalValue = 0, totalExpenses = 0;

  for (let prop in categoryLabels) {
    let value = 0;
    for (let i = 0; i < obj.length; i++) {
      // Using only one property so that totalExpenses variable is done correctly
      if (prop === "Rent") {
        totalExpenses += obj[i].Cost;
      }
      if (categoryLabels[prop] !== "Other" && (categoryLabels[prop].labels.includes(obj[i].Category) || obj[i].Category === prop)) {
        value += obj[i].Cost;
        totalValue += obj[i].Cost;
      }
    }
    newDataSet.push({Expense: prop, Cost: value, Goal: categoryLabels[prop].goal, Color: categoryLabels[prop].color});
  }


  newDataSet[newDataSet.length-1] = {Expense: "Other", Cost: totalExpenses - totalValue, Goal: categoryLabels["Other"].goal, Color: categoryLabels["Other"].color};

  // console.log(newDataSet)
  return newDataSet;
}

// function to set colors for bars
function colorBars(ht, goal, colors, i) {
  if (goal && ht > goal) {
    return 'rgb(200, 0, 0)';
  }
  let shade = (goal) ? ht/goal : 1;
  let red = colors[0], green = colors[1], blue = colors[2];
  return `rgb(${red*shade}, ${green*shade}, ${blue*shade})`;
}


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
  .attr("x", (d, i) => i * xDistance)
  .attr("y", (d, i) => height - heightScale(d.Cost) + 1)
  .attr("width", barWidth)
  .attr("height", (d, i) => heightScale(d.Cost) + 1)
  .attr("fill", (d, i) => colorBars(d.Cost, d.Goal, d.Color, i));

  // Creating bars
  otherRectangles.enter()
  .append("rect")
  .attr("class", "bar")
  // .attr("x", (d, i) => i * xDistance)
  .attr("x", (d, i) => {
    // console.log(i);
    // console.log(xDistance);
    return i * xDistance;
  })
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
  .attr("x1", (d, i) => i * xDistance)
  .attr("y1", d => (d.Goal) ? height - heightScale(d.Goal) : null)
  .attr("x2", (d, i) => (i * xDistance) + barWidth)
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


// Calling the categorical axis
svgContainer.append("g")
  .attr("class", "categoryAxis")
  .attr("transform", `translate(${moveX/2}, ${height+5})`)
  .call(categoryAxis)
  .selectAll("text")
  .attr("transform", "rotate(45)");

let pause = false;

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

function showPause(e) {
  console.log(e);
}



const svg = document.querySelector("svg");
svg.onclick = e => {
  pause = !pause;
  // console.dir(e) //Find where offsetX and offsetY are and have dot
  showPause(e);
};

// console.log(example);
// console.log(data1);
// update(dataset, 1);
