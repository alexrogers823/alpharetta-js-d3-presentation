const dataset = [];

// set variable for smooth transition
const t = d3.transition().duration(750);

let categoryLabels;
let categoryLength;
let xDistance;
let categoryScale;
let categoryAxis;
let pause = false;

function showPause(e) {
  console.log(e);
}




// Array of JSON data with Category data
const requestSites = [
  'https://raw.githubusercontent.com/alexrogers823/interactiveBarGraph/master/month_expenses_2016.json',
  'https://gist.githubusercontent.com/alexrogers823/73335d86e2516993face9f7818bd9955/raw/89fa5fb90db60ff0949fd8af2d629b39d47d9dc6/barGraphCategories.json'];

function fetchData(url) {
  return fetch(url).then(blob => blob.json());
}

const arrayOfPromises = requestSites.map(site => fetchData(site));
Promise.all(arrayOfPromises)
  .then(arrayOfResults => {
    console.log(arrayOfResults);
    dataset.push(...arrayOfResults[0]);
    categoryLabels = arrayOfResults[1];
  })
  .then(() => {
    // Set all dependant variables after resolved promise
    categoryLength = Object.keys(categoryLabels).length;
    xDistance = (width - moveX)/categoryLength;

    categoryScale = d3.scale.linear()
      .domain([0, categoryLength])
      .range([0, width - moveX]); //moveX + yAxis distance

    categoryAxis = d3.svg.axis()
      .ticks(categoryLength+1)
      .tickSize(2)
      .tickPadding(60)
      .scale(categoryScale)
      .tickFormat((d, i) => createCategoryNames(d, i))
      .orient("bottom");

    // Calling the categorical axis
    svgContainer.append("g")
      .attr("class", "categoryAxis")
      .attr("transform", `translate(${moveX/2}, ${height+5})`)
      .call(categoryAxis)
      .selectAll("text")
      .attr("transform", "rotate(45)");
  });

// Makes category names for ticks in Axis
function createCategoryNames(d, i) {
  let categoryNames = ["."];
  for (let prop in categoryLabels) {
    categoryNames.push(prop);
  }
  return categoryNames[i];
}

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

  // Setting the "other" category from leftover totalValue
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
