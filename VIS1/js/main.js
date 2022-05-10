var svg;
var svg_2;
var width;
var height;
var innerHeight;
var innerWidth;
var margin = { top: 100, right: 400, bottom: 100, left: 100 };
var width2;
var height2;
var innerHeight2;
var innerWidth2;
var margin2 = { top: 150, right: 150, bottom: 70, left: 100 };
var margin3 = { top: 100, right: 400, bottom: 100, left: 100 };
var width3;
var height3;
var data1
var vis2Val;
var dataByGen2;
var dataforVis2_H;
var dataforVis2_D;
let gender="Total_Deaths"
document.addEventListener('DOMContentLoaded', function() {
    svg = d3.select('#svg1');
    svg_2 = d3.select('#svg2');
    svg3=d3.select('#svg3');
    width = +svg.style('width').replace('px','');
    height = +svg.style('height').replace('px','');
    width2 = +svg.style('width').replace('px','');
    height2 = +svg.style('height').replace('px','');
    width3 = +svg.style('width').replace('px','');
    height3 = +svg.style('height').replace('px','');
    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;
    innerWidth3 = width3 - margin3.left - margin3.right;
    innerHeight3 = height3 - margin3.top - margin3.bottom;
    // Load both files before doing anything else
    Promise.all([d3.csv('VIS1/preprocessed_data/Death_Counter.csv'),
                 d3.csv('VIS1/preprocessed_data/vis2PercentagesData.csv'),
                 d3.csv('VIS1/preprocessed_data/vis3DataWithMean.csv')])
            .then(function(values){
      
      data1=values[0]
      vis2Val=values[1];
      data3=values[2];
      data1.forEach(d => {
        d["Female_Deaths"] = +d["Female_Deaths"]
        d["Male_Deaths"] = +d["Male_Deaths"]
        d["Total_Deaths"] = +d["Total_Deaths"]
      })

      data3.forEach(d => {
        d["MALE_HOSPITALIZED"] = +d["MALE_HOSPITALIZED"]
        d["MALE_DEAD"] = +d["MALE_DEAD"]
        d["FEMALE_HOSPITALIZED"] = +d["FEMALE_HOSPITALIZED"]
        d["FEMALE_DEAD"]=+d["FEMALE_DEAD"]
        d["TOTAL_HOSPITALIZED"]=+d["TOTAL_HOSPITALIZED"]
        d["TOTAL_DEAD"]=+d["TOTAL_DEAD"]
        d["MH_7Day_Mean"]=+d["MH_7Day_Mean"]
        d["MD_7Day_Mean"]=+d["MD_7Day_Mean"]
        d["FH_7Day_Mean"]=+d["FH_7Day_Mean"]
        d["FD_7Day_Mean"]=+d["FD_7Day_Mean"]
        d["TH_7Day_Mean"]=+d["TH_7Day_Mean"]
        d["TD_7Day_Mean"]=+d["TD_7Day_Mean"]
      })
      drawLinechart();
      drawvis2();
      drawvis3();
    })
  
  });
  


function drawLinechart()
{svg.select('g').remove();
let country=d3.select('#countries').property('value') 
var checked_gender = document.querySelector('input[name = "gender"]:checked').value;
//console.log(checked_gender)
 if(checked_gender=="male")
{
    gender="Male_Deaths"
}
else if(checked_gender=="female")
{
    gender="Female_Deaths"
}
else
{
    gender="Total_Deaths"
}
//console.log(gender)

// console.log(country)

if(country!='allCountries')
{data2=data1.filter(d=> d['Country']==country)
//console.log(data2)
var xScale = d3.scaleTime()
                    .domain(d3.extent(data2, function(d) { 
                        return new Date(d["Date"]); 
                      }))
                    .range([0,innerWidth]);
// console.log(d3.min(data2,d=>d[0]["Date"]))
// console.log(d3.max(data2,d=>d[0]["Date"]))

max_val =  d3.max(data2, d => d[gender])

var yScale = d3.scaleLinear()
                    .domain([0, max_val]) 
                    .range([innerHeight,0]);
var keys = [country]
var colorScale = d3.scaleOrdinal()
                    .domain(keys)
                    .range(['coral']) 
var g = svg.append('g')
                    .attr('transform', 'translate('+margin.left+', '+margin.top+')');      

g.append('g')
            .call(d3.axisLeft(yScale));
g.append('g')
                .attr('transform',`translate(0,${innerHeight})`) 
                .call(d3.axisBottom(xScale)
                )              
div = d3.select("body").append("div")
                .attr("class", "tooltip-donut")
                .style("opacity", 0); 
                
var singleLine = d3.line()
                          .x(d => xScale(new Date(d["Date"])))
                          .y(d => yScale(d[gender])) 
                                 
g.append('path')
                .datum(data2)  
                .attr('class','singleLine')      
                .style('fill','none')
                .style('stroke',function(d){return colorScale(country)})
                .style('stroke-width','2')
                .attr('d', singleLine)
size=20          

g.selectAll("circles1")
              .data(data2)
              .enter()
              .append('circle')
              .attr('cx', d => xScale(new Date(d["Date"])))
              .attr('cy', d => yScale(d[gender]))
              .attr('r', 3.5)
              .style('fill', d=>colorScale(country))
              .on('mouseover', function(d) {
                div.transition()
                       .duration(50)
                       .style("opacity", 1);
                let num =  'Country: '+d['Country']+'<br>Deaths: '+ d[gender];
                div.html(num)
                       .style("left", (d3.event.pageX + 20) + "px")
                       .style("top", (d3.event.pageY - 30) + "px");
              //console.log('mouseover on ' + country);
            })
            .on('mouseout', function(d,i) {
              div.transition()
                       .duration('50')
                       .style("opacity", 0);
              //console.log('mouseout on ' + country);
            })

g.selectAll("mycircle")
                .data(keys)
                .enter()
                .append("circle")
                  .attr("cx", 800)
                  .attr("cy", function(d,i){ return i*20-5}) 
                  .attr("r", 10)
                  .style("fill", function(d){ return colorScale(d)})

g.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 800 + 25)
                .attr("y", function(d,i){ return i*20}) 
                .style("fill", function(d){ return colorScale(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
}
else
{
  countries= ['Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand','Turkey','Venezuela','Yemen']
  arr2=data1.filter(d=>countries.includes(d['Country']))
  max_val =  d3.max(arr2, d => d[gender])
  //console.log(max_val)
  var xScale = d3.scaleTime()
                    .domain(d3.extent(data1, function(d) { 
                        return new Date(d["Date"]); 
                      }))
                    .range([0,innerWidth]);
  var yScale = d3.scaleLinear()
                    .domain([0, max_val]) 
                    .range([innerHeight,0]);  
  var colorScale = d3.scaleOrdinal()
                    .domain(countries)
                    .range(['red','violet','indigo','mediumorchid','blue','darksalmon','orange','green','chocolate','royalblue','yellow'])  
  var g = svg.append('g')
                    .attr('transform', 'translate('+margin.left+', '+margin.top+')');
  div = d3.select("body").append("div")
                    .attr("class", "tooltip-donut")
                    .style("opacity", 0);                    
                    
  for(let i in countries)
  {
    country=countries[i]
    data2=data1.filter(d=> d['Country']==country)
    var singleLine = d3.line()
                          .x(d => xScale(new Date(d["Date"])))
                          .y(d => yScale(d[gender]))            
    g.append('path')
                .datum(data2)  
                .attr('class','singleLine')      
                .style('fill','none')
                .style('stroke',function(d){return colorScale(country)})
                .style('stroke-width','2')
                .attr('d', singleLine)
    g.selectAll("circles1")
              .data(data2)
              .enter()
              .append('circle')
              .attr('cx', d => xScale(new Date(d["Date"])))
              .attr('cy', d => yScale(d[gender]))
              .attr('r', 3.5)
              .style('fill', d=>colorScale(country))
              .on('mouseover', function(d) {
                div.transition()
                       .duration(50)
                       .style("opacity", 1);
                let num =  'Country: '+d['Country']+'<br>Deaths: '+ d[gender];
                div.html(num)
                       .style("left", (d3.event.pageX + 20) + "px")
                       .style("top", (d3.event.pageY - 30) + "px");
              //console.log('mouseover on ' + country);
            })
            .on('mouseout', function(d,i) {
              div.transition()
                       .duration('50')
                       .style("opacity", 0);
              //console.log('mouseout on ' + country);
            })

  }
  g.append('g')
            .call(d3.axisLeft(yScale));
g.append('g')
                .attr('transform',`translate(0,${innerHeight})`) 
                .call(d3.axisBottom(xScale)
                ) 
  // g.selectAll("myrect")
  // .data(countries)
  // .enter()
  // .append("rect")
  //   .attr("x", 800)
  //   .attr("y", function(d,i){ return i*25-15}) 
  //   .attr("width", 20)
  //   .attr("height", 20)
  //   .style("fill", function(d){ return colorScale(d)})
  g.selectAll("mycircle")
                .data(countries)
                .enter()
                .append("circle")
                  .attr("cx", 800)
                  .attr("cy", function(d,i){ return i*25-5}) 
                  .attr("r", 10)
                  .style("fill", function(d){ return colorScale(d)})

g.selectAll("mylabels")
  .data(countries)
  .enter()
  .append("text")
  .attr("x", 800 + 25)
  .attr("y", function(d,i){ return i*25}) 
  .style("fill", function(d){ return colorScale(d)})
  .text(function(d){ return d})
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
}
g.append('text')
                .attr('x',innerWidth/2)
                .attr('y',innerHeight+50)
                .text("Date");
g.append('text')
                .attr('transform','rotate(-90)')
                .attr('y','-50px')
                .attr('x',-innerHeight/2)
                .attr('text-anchor','middle')
                .text("Deaths")                

}

function drawvis2(){
  var men = 0;
  svg_2.selectAll('g').remove();
  let country=d3.select('#countries').property('value') 
  var checked_gender = document.querySelector('input[name = "gender"]:checked').value;
  //filter by gender
  if(checked_gender=="male"){
    men = 1;
    dataByGen2 = vis2Val.filter(d=> d['Gender']=="M")}
  else if(checked_gender=="female"){
    dataByGen2 = vis2Val.filter(d=> d['Gender']=="F")}
  else if(checked_gender=="all"){
    dataByGen2 = vis2Val.filter(d=> d['Gender']=="T")}
  //filter by country
  if(country=='allCountries'){
    var data2byCoun=dataByGen2.filter(d=> d['Country']=="All countries")}
  else{
    var data2byCoun=dataByGen2.filter(d=> d['Country']==country)}
  //filter hospitalised and dead
  dataforVis2_H = data2byCoun.filter(d=> d['Condition']=="H");
  dataforVis2_D = data2byCoun.filter(d=> d['Condition']=="D");
  console.log(dataforVis2_D);
  //filter 0 values 
  dataforVis2_H = dataforVis2_H.filter(d=> ((d['0-30-per']!=0) || (d['30-60-per']!=0) || (d['>60-per']!=0)));
  dataforVis2_D = dataforVis2_D.filter(d=> ((d['0-30-per']!=0) || (d['30-60-per']!=0) || (d['>60-per']!=0)));
  console.log(dataforVis2_D);

  innerWidth2 = width2 - margin2.left - margin2.right;
  innerHeight2 = height2 - margin2.top - margin2.bottom;

  var g = svg_2.append("g")
            .attr("width", innerWidth2 + margin2.left + margin2.right)
            .attr("height", innerHeight2 + margin2.top + margin2.bottom)
            .attr("transform","translate(" + margin2.left + "," + margin2.top + ")");
  // x axis    
  var xscale = d3.scaleLinear()
            .domain([0, 100])
            .range([ 0, innerWidth2/2 ]);
  // for dead chart 
  var xscale2 = d3.scaleLinear()
            .domain([0, 100])
            .range([ 550, 550+innerWidth2/2 ]);

  var xAxis = d3.axisTop(xscale)
        .tickFormat(x=>x+"%");
  var xAxis2 = d3.axisTop(xscale2)
        .tickFormat(x=>x+"%");

  svg_2.append("g")
        .attr("transform",`translate(${margin2.left},${margin2.top})`)
        .call(xAxis);
  svg_2.append("g")
        .attr("transform",`translate(${margin2.left},${margin2.top})`)
        .call(xAxis2);
  // Add y axis
  var yscale = d3.scaleBand()
          .domain(dataforVis2_H.map(d => d.Symptom))
          .range([0,innerHeight2])
          .padding([0.1])

  var yAxis = d3.axisLeft(yscale);    
  svg_2.append("g")
    .attr("transform",`translate(${margin2.left},${margin2.top})`)
    .call(yAxis);

  console.log("check check");
  var stackVal = d3.stack()
        .keys(["0-30-per","30-60-per",">60-per"])(dataforVis2_H);
  var stackVal2 = d3.stack()
        .keys(["0-30-per","30-60-per",">60-per"])(dataforVis2_D);

  var plotV = svg_2.append("g")
                .attr("transform",`translate(${margin2.left},${margin2.top})`)
                .selectAll("g").data(stackVal);
  var plotV2 = svg_2.append("g")
                .attr("transform",`translate(${margin2.left},${margin2.top})`)
                .selectAll("g").data(stackVal2);

  var div = d3.select("body").append("div")
                .attr("class", "tooltip-donut")
                .style("opacity", 0);
   
    //color scale
   if (men == 1){
    colorScale = d3.scaleOrdinal()
      .domain(dataforVis2_H.map(d => d.Symptom))
      .range(['#663399','#ee82ee','#9370d8']);
    colorScale2 = d3.scaleOrdinal()
      .domain(dataforVis2_H.map(d => d.Symptom))
      .range(['#b8860b','#ffd700','#cd853f']);
  }
  else{
    colorScale = d3.scaleOrdinal()
      .domain(dataforVis2_H.map(d => d.Symptom))
      .range(['#ee82ee','#9370d8','#663399']);
    colorScale2 = d3.scaleOrdinal()
      .domain(dataforVis2_H.map(d => d.Symptom))
      .range(['#ffd700','#cd853f','#b8860b']);
  }

  function countVal(d) {
    if(d.data["0-30-per"] == (d[1]-d[0]))
    { return d.data["0-30"];}
    else if(d.data["30-60-per"] == (d[1]-d[0])) 
    { return d.data["30-60"];}
    else 
    {
      /*var x = d[1]-d[0];
      x = parseFloat(x).toFixed(8);
      console.log("x:"+x);
      if(d.data[">60-per"] == x)
      {
        var temp = d.data[">60"]
        return temp;
      }*/
        return d.data[">60"]
    }
  }

  function stackB(divt){
        divt.append("g")
          .attr("fill",d => colorScale(d.key))
          .attr('key', d => d.key)
          .selectAll("rect").data(d=>d).join("rect")
          .attr("width",d=> xscale(d[1])-xscale(d[0]))
          .attr("height",yscale.bandwidth())
          .attr("x",0).attr("x",d=>xscale(d[0]))
          .attr("y",d=>yscale(d.data.Symptom))
          .on('mouseover', function(d){
            div.transition().duration(500)
            div.html("Count : "+ countVal(d) +"<br>"+" Percentage: "+ parseFloat(d[1]-d[0]).toFixed(5) +"<br>")
                    .style("left",(d3.event.pageX)+"px")
                    .style("top",(d3.event.pageY)+"px")
                    .style("opacity",1);
          })
          .on('mouseout', function(d) {
            div.transition().duration(500).style("opacity",0);
          }) 
  }
  function stackB2(divt){
       divt.append("g")
        .attr("fill",d => colorScale2(d.key))
        .attr('key', d => d.key)
        .selectAll("rect").data(d=>d).join("rect")
        .attr("width",d=> xscale2(d[1])-xscale2(d[0]))
        .attr("height",yscale.bandwidth())
        .attr("x",0).attr("x",d=>xscale2(d[0]))
        .attr("y",d=>yscale(d.data.Symptom)) 
        .on('mouseover', function(d){
          div.transition().duration(500)
          div.html("Count : "+ countVal(d) +"<br>"+" Percentage: "+ parseFloat(d[1]-d[0]).toFixed(5) +"<br>")
                  .style("left",(d3.event.pageX)+"px")
                  .style("top",(d3.event.pageY)+"px")
                  .style("opacity",1);
        })
        .on('mouseout', function(d) {
          div.transition().duration(500).style("opacity",0);
        })
  }
  
  svg_2.append('text').attr('x',20).attr('y',50).text('Symptoms')
      .style("font-weight", 'bold').style('fill','black').style('font-size', "20px");
  svg_2.append('text').attr('x',300).attr('y',50).text('Hospitalized')
      .style("font-weight", 'bold').style('fill','black').style('font-size', "20px");
  svg_2.append('text').attr('x',850).attr('y',50).text('Dead')
      .style("font-weight", 'bold').style('fill','black').style('font-size', "20px");
  //
  svg_2.append("rect").attr("x",150).attr("y",90).attr('width','25').attr('height','25')
      .style("fill", "#663399").attr('stroke','black').attr("stroke-width", 1);
  svg_2.append("rect").attr("x",300).attr("y",90).attr('width','25').attr('height','25')
      .style("fill", "#ee82ee").attr('stroke','black').attr("stroke-width", 1);
  svg_2.append("rect").attr("x",450).attr("y",90).attr('width','25').attr('height','25')
      .style("fill", "#9370d8").attr('stroke','black').attr("stroke-width", 1);
  svg_2.append("rect").attr("x",700).attr("y",90).attr('width','25').attr('height','25')
      .style("fill", "#b8860b").attr('stroke','black').attr("stroke-width", 1);
  svg_2.append("rect").attr("x",850).attr("y",90).attr('width','25').attr('height','25')
      .style("fill", "#ffd700").attr('stroke','black').attr("stroke-width", 1);
  svg_2.append("rect").attr("x",1000).attr("y",90).attr('width','25').attr('height','25')
      .style("fill", "#cd853f").attr('stroke','black').attr("stroke-width", 1);
  //
  svg_2.append('text').attr('x',190).attr('y',100).text('Age: 0 to 30')
      .style('fill','red').style("font-weight", 'bold').style('font-size', "12px");
  svg_2.append('text').attr('x',340).attr('y',100).text('Age: 30 to 60')
      .style('fill','red').style("font-weight", 'bold').style('font-size', "12px");
  svg_2.append('text').attr('x',490).attr('y',100).text('Age: > 60')
      .style('fill','red').style("font-weight", 'bold').style('font-size', "12px");
  svg_2.append('text').attr('x',740).attr('y',100).text('Age: 0 to 30')
      .style('fill','red').style("font-weight", 'bold').style('font-size', "12px");
  svg_2.append('text').attr('x',890).attr('y',100).text('Age: 30 to 60')
      .style('fill','red').style("font-weight", 'bold').style('font-size', "12px");
  svg_2.append('text').attr('x',1040).attr('y',100).text('Age: > 60')
      .style('fill','red').style("font-weight", 'bold').style('font-size', "12px");

  plotV.join(
    divt => stackB(divt)
    )
  plotV2.join(
    divt => stackB2(divt)
    )
}

function drawvis3()
{
  svg3.select('g').remove();
  let country=d3.select('#countries').property('value') 
  var checked_gender = document.querySelector('input[name = "gender"]:checked').value;
  //console.log(checked_gender)
   if(checked_gender=="male")
  {
  gender2="MH_7Day_Mean"
  if(country!='allCountries')
  {data_vis3=data3.filter(d=> d['COUNTRY']==country)
  var xScale = d3.scaleTime()
                      .domain(d3.extent(data_vis3, function(d) { 
                          return new Date(d["DATE"]); 
                        }))
                      .range([0,innerWidth3+200]);
  
  max_val =  d3.max(data_vis3, d => d['MALE_HOSPITALIZED'])
  var yScale = d3.scaleLinear()
                      .domain([0, max_val]) 
                      .range([innerHeight3,0]);
  var keys = ['Dead','Hospitalized']
  var colorScale = d3.scaleOrdinal()
                      .domain(keys)
                      .range(['red','green']) 
  g = svg3.append('g')
                      .attr('transform', 'translate('+margin3.left+', '+margin3.top+')');      
              
  div = d3.select("body").append("div")
                  .attr("class", "tooltip-donut")
                  .style("opacity", 0);
  g.selectAll('rect1')
                  .data(data_vis3)
                  .join(
                    enter => enter
                    .append('rect')
                    .attr('y', d => yScale(d["MALE_HOSPITALIZED"]))
                    .attr('x', d => xScale(new Date(d["DATE"])))
                    .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                    .attr('height', 0)
                    .style('opacity',0.2)
                    .style('fill','blue')
                    .call(enter => enter.transition()
                                        .duration(2000)
                                        .attr('height', function(d) {
                                          return  innerHeight3-yScale(d["MALE_HOSPITALIZED"])
                                      })
                          )
                  );
                  
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender2])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Hospitalized')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
                  
  g.selectAll("circles1")
                .data(data_vis3)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(new Date(d["DATE"])))
                .attr('cy', d => yScale(d[gender2]))
                .attr('r', 3.5)
                .style('fill', d=>colorScale('Hospitalized'))
                .on('mouseover', function(d) {
                  div.transition()
                         .duration(50)
                         .style("opacity", 1);
                  let num =  'Country: '+d['COUNTRY']+'<br>Hospitalized: '+ d[gender2];
                  div.html(num)
                         .style("left", (d3.event.pageX + 20) + "px")
                         .style("top", (d3.event.pageY - 30) + "px");
              })
              .on('mouseout', function(d,i) {
                div.transition()
                         .duration('50')
                         .style("opacity", 0);
              })
  
  gender3="MD_7Day_Mean"
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender3])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Dead')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
  g.selectAll("circles1")
                  .data(data_vis3)
                  .enter()
                  .append('circle')
                  .attr('cx', d => xScale(new Date(d["DATE"])))
                  .attr('cy', d => yScale(d[gender3]))
                  .attr('r', 3.5)
                  .style('fill', d=>colorScale('Dead'))
                  .on('mouseover', function(d) {
                    div.transition()
                           .duration(50)
                           .style("opacity", 1);
                    let num =  'Country: '+d['COUNTRY']+'<br>Dead: '+ d[gender3];
                    div.html(num)
                           .style("left", (d3.event.pageX + 20) + "px")
                           .style("top", (d3.event.pageY - 30) + "px");
                })
                .on('mouseout', function(d,i) {
                  div.transition()
                           .duration('50')
                           .style("opacity", 0);
                })
  
    
  }
  
  else
  { 
    country='All Countries'
    data_vis3=data3.filter(d=> d['COUNTRY']==country)
  var xScale = d3.scaleTime()
                      .domain(d3.extent(data_vis3, function(d) { 
                          return new Date(d["DATE"]); 
                        }))
                      .range([0,innerWidth3+200]);
  
  max_val =  d3.max(data_vis3, d => d['MALE_HOSPITALIZED'])
  var yScale = d3.scaleLinear()
                      .domain([0, max_val]) 
                      .range([innerHeight3,0]);
  var keys = ['Dead','Hospitalized']
  var colorScale = d3.scaleOrdinal()
                      .domain(keys)
                      .range(['red','green']) 
  g = svg3.append('g')
                      .attr('transform', 'translate('+margin3.left+', '+margin3.top+')');      
              
  div = d3.select("body").append("div")
                  .attr("class", "tooltip-donut")
                  .style("opacity", 0);
  g.selectAll('rect1')
                  .data(data_vis3)
                  .join(
                    enter => enter
                    .append('rect')
                    .attr('y', d => yScale(d["MALE_HOSPITALIZED"]))
                    .attr('x', d => xScale(new Date(d["DATE"])))
                    .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                    .attr('height', 0)
                    .style('opacity',0.2)
                    .style('fill','blue')
                    .call(enter => enter.transition()
                                        .duration(2000)
                                        .attr('height', function(d) {
                                          return  innerHeight3-yScale(d["MALE_HOSPITALIZED"])
                                      })
                          )
                  ); 
                  
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender2])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Hospitalized')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
                  
  g.selectAll("circles1")
                .data(data_vis3)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(new Date(d["DATE"])))
                .attr('cy', d => yScale(d[gender2]))
                .attr('r', 3.5)
                .style('fill', d=>colorScale('Hospitalized'))
                .on('mouseover', function(d) {
                  div.transition()
                         .duration(50)
                         .style("opacity", 1);
                  let num =  'Country: '+d['COUNTRY']+'<br>Hospitalized: '+ d[gender2];
                  div.html(num)
                         .style("left", (d3.event.pageX + 20) + "px")
                         .style("top", (d3.event.pageY - 30) + "px");
              })
              .on('mouseout', function(d,i) {
                div.transition()
                         .duration('50')
                         .style("opacity", 0);
              })
  
  gender3="MD_7Day_Mean"
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender3])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Dead')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
  g.selectAll("circles1")
                  .data(data_vis3)
                  .enter()
                  .append('circle')
                  .attr('cx', d => xScale(new Date(d["DATE"])))
                  .attr('cy', d => yScale(d[gender3]))
                  .attr('r', 3.5)
                  .style('fill', d=>colorScale('Dead'))
                  .on('mouseover', function(d) {
                    div.transition()
                           .duration(50)
                           .style("opacity", 1);
                    let num =  'Country: '+d['COUNTRY']+'<br>Dead: '+ d[gender3];
                    div.html(num)
                           .style("left", (d3.event.pageX + 20) + "px")
                           .style("top", (d3.event.pageY - 30) + "px");
                })
                .on('mouseout', function(d,i) {
                  div.transition()
                           .duration('50')
                           .style("opacity", 0);
                })
    }
  }
  
  else if(checked_gender=="female")
  {
  gender2="FH_7Day_Mean"
  if(country!='allCountries')
  {data_vis3=data3.filter(d=> d['COUNTRY']==country)
  var xScale = d3.scaleTime()
                      .domain(d3.extent(data_vis3, function(d) { 
                          return new Date(d["DATE"]); 
                        }))
                      .range([0,innerWidth+200]);
  
  max_val =  d3.max(data_vis3, d => d['FEMALE_HOSPITALIZED'])
  var yScale = d3.scaleLinear()
                      .domain([0, max_val]) 
                      .range([innerHeight,0]);
  var keys = ['Dead','Hospitalized']
  var colorScale = d3.scaleOrdinal()
                      .domain(keys)
                      .range(['red','green']) 
  g = svg3.append('g')
                      .attr('transform', 'translate('+margin.left+', '+margin.top+')');      
              
  div = d3.select("body").append("div")
                  .attr("class", "tooltip-donut")
                  .style("opacity", 0);
  g.selectAll('rect1')
                  .data(data_vis3)
                  .join(
                    enter => enter
                    .append('rect')
                    .attr('y', d => yScale(d["FEMALE_HOSPITALIZED"]))
                    .attr('x', d => xScale(new Date(d["DATE"])))
                    .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                    .attr('height', 0)
                    .style('opacity',0.2)
                    .style('fill','blue')
                    .call(enter => enter.transition()
                                        .duration(2000)
                                        .attr('height', function(d) {
                                          return  innerHeight-yScale(d["FEMALE_HOSPITALIZED"])
                                      })
                          )
                  ); 
                  
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender2])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Hospitalized')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
                  
  g.selectAll("circles1")
                .data(data_vis3)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(new Date(d["DATE"])))
                .attr('cy', d => yScale(d[gender2]))
                .attr('r', 3.5)
                .style('fill', d=>colorScale('Hospitalized'))
                .on('mouseover', function(d) {
                  div.transition()
                         .duration(50)
                         .style("opacity", 1);
                  let num =  'Country: '+d['COUNTRY']+'<br>Hospitalized: '+ d[gender2];
                  div.html(num)
                         .style("left", (d3.event.pageX + 20) + "px")
                         .style("top", (d3.event.pageY - 30) + "px");
              })
              .on('mouseout', function(d,i) {
                div.transition()
                         .duration('50')
                         .style("opacity", 0);
              })
  
  gender3="FD_7Day_Mean"
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender3])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Dead')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
  g.selectAll("circles1")
                  .data(data_vis3)
                  .enter()
                  .append('circle')
                  .attr('cx', d => xScale(new Date(d["DATE"])))
                  .attr('cy', d => yScale(d[gender3]))
                  .attr('r', 3.5)
                  .style('fill', d=>colorScale('Dead'))
                  .on('mouseover', function(d) {
                    div.transition()
                           .duration(50)
                           .style("opacity", 1);
                    let num =  'Country: '+d['COUNTRY']+'<br>Dead: '+ d[gender3];
                    div.html(num)
                           .style("left", (d3.event.pageX + 20) + "px")
                           .style("top", (d3.event.pageY - 30) + "px");
                })
                .on('mouseout', function(d,i) {
                  div.transition()
                           .duration('50')
                           .style("opacity", 0);
                })
  
    
  }
  
  else
  { 
    country='All Countries'
    data_vis3=data3.filter(d=> d['COUNTRY']==country)
  var xScale = d3.scaleTime()
                      .domain(d3.extent(data_vis3, function(d) { 
                          return new Date(d["DATE"]); 
                        }))
                      .range([0,innerWidth+200]);
  
  max_val =  d3.max(data_vis3, d => d['FEMALE_HOSPITALIZED'])
  var yScale = d3.scaleLinear()
                      .domain([0, max_val]) 
                      .range([innerHeight,0]);
  var keys = ['Dead','Hospitalized']
  var colorScale = d3.scaleOrdinal()
                      .domain(keys)
                      .range(['red','green']) 
  g = svg3.append('g')
                      .attr('transform', 'translate('+margin.left+', '+margin.top+')');      
              
  div = d3.select("body").append("div")
                  .attr("class", "tooltip-donut")
                  .style("opacity", 0);
  g.selectAll('rect1')
                  .data(data_vis3)
                  .join(
                    enter => enter
                    .append('rect')
                    .attr('y', d => yScale(d["FEMALE_HOSPITALIZED"]))
                    .attr('x', d => xScale(new Date(d["DATE"])))
                    .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                    .attr('height', 0)
                    .style('opacity',0.2)
                    .style('fill','blue')
                    .call(enter => enter.transition()
                                        .duration(2000)
                                        .attr('height', function(d) {
                                          return  innerHeight-yScale(d["FEMALE_HOSPITALIZED"])
                                      })
                          )
                  ); 
                  
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender2])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Hospitalized')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
                  
  g.selectAll("circles1")
                .data(data_vis3)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(new Date(d["DATE"])))
                .attr('cy', d => yScale(d[gender2]))
                .attr('r', 3.5)
                .style('fill', d=>colorScale('Hospitalized'))
                .on('mouseover', function(d) {
                  div.transition()
                         .duration(50)
                         .style("opacity", 1);
                  let num =  'Country: '+d['COUNTRY']+'<br>Hospitalized: '+ d[gender2];
                  div.html(num)
                         .style("left", (d3.event.pageX + 20) + "px")
                         .style("top", (d3.event.pageY - 30) + "px");
              })
              .on('mouseout', function(d,i) {
                div.transition()
                         .duration('50')
                         .style("opacity", 0);
              })
  
  gender3="FD_7Day_Mean"
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender3])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Dead')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
  
  g.selectAll("circles1")
                  .data(data_vis3)
                  .enter()
                  .append('circle')
                  .attr('cx', d => xScale(new Date(d["DATE"])))
                  .attr('cy', d => yScale(d[gender3]))
                  .attr('r', 3.5)
                  .style('fill', d=>colorScale('Dead'))
                  .on('mouseover', function(d) {
                    div.transition()
                           .duration(50)
                           .style("opacity", 1);
                    let num =  'Country: '+d['COUNTRY']+'<br>Dead: '+ d[gender3];
                    div.html(num)
                           .style("left", (d3.event.pageX + 20) + "px")
                           .style("top", (d3.event.pageY - 30) + "px");
                })
                .on('mouseout', function(d,i) {
                  div.transition()
                           .duration('50')
                           .style("opacity", 0);
                })
    }
  }
  
  else
  {
  gender2="TH_7Day_Mean"
  if(country!='allCountries')
  {data_vis3=data3.filter(d=> d['COUNTRY']==country)
  var xScale = d3.scaleTime()
                      .domain(d3.extent(data_vis3, function(d) { 
                          return new Date(d["DATE"]); 
                        }))
                      .range([0,innerWidth+200]);
  
  max_val =  d3.max(data_vis3, d => d['TOTAL_HOSPITALIZED'])
  //console.log(max_val)
  var yScale = d3.scaleLinear()
                      .domain([0, max_val]) 
                      .range([innerHeight,0]);
  var keys = ['Dead','Hospitalized']
  var colorScale = d3.scaleOrdinal()
                      .domain(keys)
                      .range(['red','green']) 
  g = svg3.append('g')
                      .attr('transform', 'translate('+margin.left+', '+margin.top+')');      
              
  div = d3.select("body").append("div")
                  .attr("class", "tooltip-donut")
                  .style("opacity", 0);
  g.selectAll('rect1')
                  .data(data_vis3)
                  .join(
                    enter => enter
                    .append('rect')
                    .attr('y', d => yScale(d["TOTAL_HOSPITALIZED"]))
                    .attr('x', d => xScale(new Date(d["DATE"])))
                    .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                    .attr('height', 0)
                    .style('opacity',0.2)
                    .style('fill','blue')
                    .call(enter => enter.transition()
                                        .duration(2000)
                                        .attr('height', function(d) {
                                          return  innerHeight-yScale(d["TOTAL_HOSPITALIZED"])
                                      })
                          )
                  );
                  
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender2])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Hospitalized')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
                  
  g.selectAll("circles1")
                .data(data_vis3)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(new Date(d["DATE"])))
                .attr('cy', d => yScale(d[gender2]))
                .attr('r', 3.5)
                .style('fill', d=>colorScale('Hospitalized'))
                .on('mouseover', function(d) {
                  div.transition()
                         .duration(50)
                         .style("opacity", 1);
                  let num =  'Country: '+d['COUNTRY']+'<br>Hospitalized: '+ d[gender2];
                  div.html(num)
                         .style("left", (d3.event.pageX + 20) + "px")
                         .style("top", (d3.event.pageY - 30) + "px");
              })
              .on('mouseout', function(d,i) {
                div.transition()
                         .duration('50')
                         .style("opacity", 0);
              })
  
  gender3="TD_7Day_Mean"
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender3])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Dead')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
  g.selectAll("circles1")
                  .data(data_vis3)
                  .enter()
                  .append('circle')
                  .attr('cx', d => xScale(new Date(d["DATE"])))
                  .attr('cy', d => yScale(d[gender3]))
                  .attr('r', 3.5)
                  .style('fill', d=>colorScale('Dead'))
                  .on('mouseover', function(d) {
                    div.transition()
                           .duration(50)
                           .style("opacity", 1);
                    let num =  'Country: '+d['COUNTRY']+'<br>Dead: '+ d[gender3];
                    div.html(num)
                           .style("left", (d3.event.pageX + 20) + "px")
                           .style("top", (d3.event.pageY - 30) + "px");
                })
                .on('mouseout', function(d,i) {
                  div.transition()
                           .duration('50')
                           .style("opacity", 0);
                })
  }
  
  else
  { 
    country='All Countries'
    data_vis3=data3.filter(d=> d['COUNTRY']==country)
  var xScale = d3.scaleTime()
                      .domain(d3.extent(data_vis3, function(d) { 
                          return new Date(d["DATE"]); 
                        }))
                      .range([0,innerWidth+200]);
  
  max_val =  d3.max(data_vis3, d => d['TOTAL_HOSPITALIZED'])
  //console.log(max_val)
  var yScale = d3.scaleLinear()
                      .domain([0, max_val]) 
                      .range([innerHeight,0]);
  var keys = ['Dead','Hospitalized']
  var colorScale = d3.scaleOrdinal()
                      .domain(keys)
                      .range(['red','green']) 
  g = svg3.append('g')
                      .attr('transform', 'translate('+margin.left+', '+margin.top+')');      
              
  div = d3.select("body").append("div")
                  .attr("class", "tooltip-donut")
                  .style("opacity", 0);
  g.selectAll('rect1')
                  .data(data_vis3)
                  .join(
                    enter => enter
                    .append('rect')
                    .attr('y', d => yScale(d["TOTAL_HOSPITALIZED"]))
                    .attr('x', d => xScale(new Date(d["DATE"])))
                    .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                    .attr('height', 0)
                    .style('opacity',0.2)
                    .style('fill','blue')
                    .call(enter => enter.transition()
                                        .duration(2000)
                                        .attr('height', function(d) {
                                          return  innerHeight-yScale(d["TOTAL_HOSPITALIZED"])
                                      })
                          )
                  ); 
                  
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender2])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Hospitalized')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
                  
  g.selectAll("circles1")
                .data(data_vis3)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(new Date(d["DATE"])))
                .attr('cy', d => yScale(d[gender2]))
                .attr('r', 3.5)
                .style('fill', d=>colorScale('Hospitalized'))
                .on('mouseover', function(d) {
                  div.transition()
                         .duration(50)
                         .style("opacity", 1);
                  let num =  'Country: '+d['COUNTRY']+'<br>Hospitalized: '+ d[gender2];
                  div.html(num)
                         .style("left", (d3.event.pageX + 20) + "px")
                         .style("top", (d3.event.pageY - 30) + "px");
              })
              .on('mouseout', function(d,i) {
                div.transition()
                         .duration('50')
                         .style("opacity", 0);
              })
  
  gender3="TD_7Day_Mean"
  var singleLine = d3.line()
                            .x(d => xScale(new Date(d["DATE"])))
                            .y(d => yScale(d[gender3])) 
                            .curve(d3.curveMonotoneX)
                                   
  g.append('path')
                  .datum(data_vis3)  
                  .attr('class','singleLine')      
                  .style('fill','none')
                  .style('stroke',function(d){return colorScale('Dead')})
                  .style('stroke-width','2')
                  .attr('d', singleLine)
  
  g.selectAll("circles1")
                  .data(data_vis3)
                  .enter()
                  .append('circle')
                  .attr('cx', d => xScale(new Date(d["DATE"])))
                  .attr('cy', d => yScale(d[gender3]))
                  .attr('r', 3.5)
                  .style('fill', d=>colorScale('Dead'))
                  .on('mouseover', function(d) {
                    div.transition()
                           .duration(50)
                           .style("opacity", 1);
                    let num =  'Country: '+d['COUNTRY']+'<br>Dead: '+ d[gender3];
                    div.html(num)
                           .style("left", (d3.event.pageX + 20) + "px")
                           .style("top", (d3.event.pageY - 30) + "px");
                })
                .on('mouseout', function(d,i) {
                  div.transition()
                           .duration('50')
                           .style("opacity", 0);
                })
    }
  }
  
  g.append('g')
              .call(d3.axisLeft(yScale));
  g.append('g')
                  .attr('transform',`translate(0,${innerHeight})`) 
                  .call(d3.axisBottom(xScale)
                  ) 
  g.selectAll("mycircle")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", 950)
    .attr("cy", function(d,i){ return i*25-5}) 
    .attr("r", 10)
    .style("fill", function(d){ return colorScale(d)})
  
  g.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
  .attr("x", 975)
  .attr("y", function(d,i){ return i*25}) 
  .style("fill", function(d){ return colorScale(d)})
  .text(function(d){ return d})
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
  g.append('text')
                  .attr('x',innerWidth/2)
                  .attr('y',innerHeight+50)
                  .text("Date");
  g.append('text')
                  .attr('transform','rotate(-90)')
                  .attr('y','-60px')
                  .attr('x',-innerHeight/2)
                  .attr('text-anchor','middle')
                  .text("Number of Patients(Dead and Hospitalized)")                
  }