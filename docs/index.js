

var obj; 
var temp;
var all_states = new Set();
var margin = {top: 40, right: 30, bottom: 0, left: 90},
width = 770 - margin.left - margin.right,
height = 460 - margin.top - margin.bottom;

function update_data(data, flag_add_event) {
  const svg = d3.select("svg")
 
 max = data[data.length-1].value

  var x = d3.scaleLinear()
    .domain([0, max])
    .range([ 100, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");


  const bars = svg.selectAll("rect")    
    .data(data, d=>d.value);
            bars.enter()
            .append("rect")
            // .transition()
            // .duration(3000)
              .attr("x", 100)
              .attr("y",  (d, i) =>  i * 25 + 10)
              // .attr("width", d =>  d.value%100+1 )
              .attr("width", function(d) { 
                let width= x(d.value);
              console.log(width)
              return width;
              })
              .attr("height", "20")
              .attr("id", d=>d.key)
              .merge(bars)    // merge
              .transition()
              .duration(2000)
   
              .attr("fill", "#00c698")
              
              bars.exit().remove();    // remove extra elements
             
              svg.selectAll("text")
              .data(data, d=>d.value)
              .enter()
              .append("text")
               // Add your code below this line
              .attr("x", 0)
              .attr("y", (d, i) => i * 25 + 23 )
              .attr("fill", "red")
              .text((d)=>d.key)

        if(flag_add_event){
              all_rects = document.getElementsByTagName('rect');
             //Add new event listners
              for (var i = 0; i < all_rects.length; i++) {
                all_rects[i].addEventListener('click',hover,false);
            }
          }
  }


function hover(ev){
  //Remove the Labels
  d3.selectAll("text").remove()
  let id = ev.target.id
  let mapObj = new Map();
  let male = 0 ;
  let female = 0 ;

  for(let i =0 ;i<obj.length; i++)
  {
  let curr = obj[i]
   if( curr['LocationDesc']== id )
    {
      if(curr['DataValue'] != "")
      {
      if(curr['StratificationCategory1'] == 'Gender' && curr['Stratification1'] == 'Male' )
          male+=curr['DataValue'];
          else
          female+=curr['DataValue'];
      }
    }
  };

  const dataset = [
          {
          'key':'male',
          'value': male, 
          },
          {
            'key':'female',
            'value': female, 
            }
          ]

  update_data(dataset,false)
  
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
  let min = Number.MIN_VALUE
  for (let [key, value] of mapObj) {
      let entry = {
          'key':key,
          'value': value, 
      }
      arrObj.push(entry)
    }
    console.log(arrObj)

    arrObj.sort((a,b)=> {
      return a.value - b.value;
    })
  
   arrObj= arrObj.slice(1).slice(-15)

    update_data(arrObj,true)
}



function count() { 
  const svg = d3.select("#playground")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  counter = counter + 1;
  console.log("working fine ")
  let url = 'https://raw.githubusercontent.com/vritansh/geochronicdisease/main/data/output.json'
  fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("sample")
    obj = data;
    console.log(data)
   })
  .then(() => {
      //proess data
    for(let i =0 ;i<obj.length;i++){
      all_states.add(obj[i]['LocationDesc']) 
    } 
  });
  } 
  var counter = 0;
  
  // this code is run when DOM is loaded
  $(document).ready(function (){
      count()
  });

