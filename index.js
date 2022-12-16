var obj; 
var temp;
var level =-1;
var all_states = new Set();

var margin = {top: 40, right: 30, bottom: 0, left: 90},
width_original = 900
height_original = 460
width = 900 - margin.left - margin.right,
height = 460 - margin.top - margin.bottom;
//Remove any existing data including margins in x and y axis 
function resetAll()
{
  d3.selectAll("rect").remove()
  d3.selectAll("g").remove()
}

function updateDataVerticalBarChart(dataset,flag_add_event, labelToshow){
  resetAll()
  console.log(dataset)
  const data =dataset
  const width = 900;
  const height = 450;
  const margin ={top: 80, right: 30, bottom: 50, left: 90};
  let max_value = data[data.length-1].value
  const svg = d3.select('svg')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, 550]);
  
  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.02)
  

  const y = d3.scaleLinear()
    .domain([0, max_value])
    .range([height - margin.bottom, margin.top])
  
  svg.append("g")
    .attr("fill", 'royalblue')
    .selectAll("rect")
    .data(data,d=>d.value)
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", d => y(d.value))
    .attr('title', (d) => d.value)
    .attr("id", d=>d.key)
    .attr("height", d => y(0) - y(d.value))
    .attr("width", x.bandwidth());
  
  function yAxis(g) {
      g.attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .attr("font-size", '20px')
  }
  
  function xAxis(g) {
      g.attr("transform", `translate(0,${400})`)
      .call(
        d3.axisBottom(x)
        .tickFormat(i => data[i].key)
        // .tickPadding([0])
      )
      .attr("font-size", '20px')
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-20)")
      .style("text-anchor", "end");

  }
  
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.node();

  svg.append("text")
  .attr("x", width/2)
  .attr("y", 30)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text(labelToshow);


  //Do not add event listner on the last graph 
  if(flag_add_event){
  all_rects = document.getElementsByTagName('rect');
  //Add new event listners
   for (var i = 0; i < all_rects.length; i++) {
     all_rects[i].addEventListener('click',hover,false);
 }}

}


function updateDataHorizontalBarChart(data, flag_add_event, color) {
  resetAll()
  const svg = d3.select("svg")
  let max_value = data[data.length-1].value
  // max_value+=max_value/2

  // var x = d3.scaleLinear()
  //       .domain([0 , max_value])
  //       .range([ 100, width]);

  const scaleX = d3
  .scaleLinear()
  .domain([0, data.at(data.length-1).value])
  .range([100, width_original])

  const scaleY = d3
  .scaleBand()
  .range([0, height])
  .domain(data.map(d => d.key))
  .padding(0.1) // Adds space between the bars

    svg
      .append("g")
      .call(d3.axisLeft(scaleY).tickSize(0))
      .attr("transform", `translate(${margin.left}, ${0})`)
      .style("font-size", "12px")
      .style("font-weight", "light")
      .style("fill", "#000")
      .style("stroke", "none")

   svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(scaleX))

  const bars = svg.selectAll("rect")    
    .data(data, d=>d.value);
            bars.enter()
            .append("rect")
              .attr("x", 100)
              .attr("y",  (d, i) =>  i * 28 + 10)
              .attr("width", (d) =>  scaleX(d.value))
              .attr("height", "15")
              .attr("id", d=>d.key)
              .merge(bars)    // merge
              .attr("fill", color)
              bars.exit().remove();    // remove extra elements



        if(flag_add_event){
              all_rects = document.getElementsByTagName('rect');
             //Add new event listners
              for (var i = 0; i < all_rects.length; i++) {
                all_rects[i].addEventListener('click',hover,false);
            }
          }

        }

function mapToJSON(mapObj,flagDescending){
  let arrObj = []
  //Loop over all the values in map obj
  for (let [key, value] of mapObj) {
      let entry = {
          'key':key,
          'value': value, 
      }
      arrObj.push(entry)
    }

    //Sort data in decending order
    arrObj.sort((a,b)=> {
      return   a.value - b.value;
    })
    console.log(arrObj)
    return arrObj;
}
//Get count of all the diseases
function getDiseasesCountsForStates(obj,id){
  try{
  //Set hashmap values here 
  let mapObj = new Map();
  for(let i =0 ;i<obj.length; i++)
  {
  let curr = obj[i]
   if( curr['LocationDesc']== id )
    {
      if(curr['DataValue'] != "")
      {
          if( mapObj.has(curr['Topic']))
              mapObj.set(curr['Topic'], mapObj.get(curr['Topic'])+curr['DataValue'])
          else
              mapObj.set(curr['Topic'],curr['DataValue'])
      }
    }
  };

  for( [key,value] in mapObj){
    console.log(key);
  }

  arrObj = mapToJSON(mapObj)
  return arrObj;
}
catch{
  console.log("Exception occured refresh browser");
}
 
}

//Get count of male / female per chronic disease
function getGenderRatio(obj,id){

  let mapObj = new Map();
  let male = 0 ;
  let female = 0 ;

  for(let i =0 ;i<obj.length; i++)
  {
  let curr = obj[i]

   if( curr['Topic']== id )
    {
      if(curr['DataValue'] != "")
      {
        console.log(curr['DataValue'])
      if(curr['Stratification1'] == 'Male' ){
              
               male+=curr['DataValue'];
      }
      if(curr['Stratification1'] == 'Female' ){
            female+=curr['DataValue'];
          }
      }
    }
  };
console.log(male)
console.log(female)
  const dataset = [
          {
          'key':'Male',
          'value': male, 
          },
          {
            'key':'Female',
            'value': female, 
            }
          ]
    console.log(id)
   console.log(dataset)
          arrObj = mapToJSON(mapObj)
console.log(arrObj)
  return dataset
}

function hover(ev){
  //Remove the Labels
  d3.selectAll("text").remove()
  let dataset =null;
  let id = ev.target.id
  console.log(level)
  if(level==0){
    dataset = getDiseasesCountsForStates(obj,id)
    level=1
    const labelToshow = "Different Topics (Diseases) Distribution in " + id;
    // update_data_vertical(dataset)
    updateDataVerticalBarChart(dataset, true,labelToshow)
  //  update_data(dataset,true, "#422057FF")
  }
  else if(level==1)
    {
      const labelToshow = "Gender Distribution for Topic: " + id;
      dataset = getGenderRatio(obj,id)
      console.log(dataset)
      updateDataVerticalBarChart(dataset, false,labelToshow)
      // update_data(dataset,false,"#DF6589FF")
    }

}

function loadData(){
  d3.selectAll("text").remove()
  data = []
  //use map object to store data 
  const mapObj = new Map();
  for(let i =0 ;i<obj.length; i++)
  {
      let curr = obj[i]['LocationDesc']
        if(mapObj.has(curr)){
          let currValue =   mapObj.get(curr) + obj[i]['DataValue']
          mapObj.set(curr,currValue)
        }else{
          mapObj.set(curr,obj[i]['DataValue'])
        }
  };
  let arrObj = []
  arrObj = mapToJSON(mapObj)
   arrObj= arrObj.slice(1).slice(-15)
   level=0
   updateDataHorizontalBarChart(arrObj,true, "royalblue")
}
//Fetch the data and put in global variable 
function loadDataFromSource() { 
  const svg = d3.select("#playground")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  //Data has been curated and put in this file for consumption in d3
  let url = 'https://raw.githubusercontent.com/vritansh/geochronicdisease/main/data/interactive_component.json'
  fetch(url)
  .then(res => res.json())
  .then(data => {
    obj = data;
   })
  .then(() => {
      //proess data
    for(let i =0 ;i<obj.length;i++){
      all_states.add(obj[i]['LocationDesc']) 
    } 
  });
  } 

  // Run the below code when dom is loaded 
  $(document).ready(function (){
    console.log("data load...")
    loadDataFromSource()
  });