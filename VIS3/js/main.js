margin = { top: 100, right: 400, bottom: 100, left: 100 };
document.addEventListener('DOMContentLoaded', function() {
    svg3=d3.select('#svg3');
    width = +svg3.style('width').replace('px','');
    height = +svg3.style('height').replace('px','');;
    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;
  
    // Load both files before doing anything else
    Promise.all([
                d3.csv('preprocessed_data/vis3DataWithMean.csv')])
            .then(function(values){
      
    data3=values[0];
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
      drawvis3();
    })
  
  });
  
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
                    .range([0,innerWidth+200]);

max_val =  d3.max(data_vis3, d => d['MALE_HOSPITALIZED'])
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
                  .attr('y', d => yScale(d["MALE_HOSPITALIZED"]))
                  .attr('x', d => xScale(new Date(d["DATE"])))
                  .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                  .attr('height', 0)
                  .style('opacity',0.2)
                  .style('fill','blue')
                  .call(enter => enter.transition()
                                      .duration(2000)
                                      .attr('height', function(d) {
                                        return  innerHeight-yScale(d["MALE_HOSPITALIZED"])
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
                    .range([0,innerWidth+200]);

max_val =  d3.max(data_vis3, d => d['MALE_HOSPITALIZED'])
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
                  .attr('y', d => yScale(d["MALE_HOSPITALIZED"]))
                  .attr('x', d => xScale(new Date(d["DATE"])))
                  .attr('width',xScale(new Date("2021-04-05"))-xScale(new Date("2021-04-04")))
                  .attr('height', 0)
                  .style('opacity',0.2)
                  .style('fill','blue')
                  .call(enter => enter.transition()
                                      .duration(2000)
                                      .attr('height', function(d) {
                                        return  innerHeight-yScale(d["MALE_HOSPITALIZED"])
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