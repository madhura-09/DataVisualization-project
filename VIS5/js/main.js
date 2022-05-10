var margin5 = { top: 100, right: 100, bottom: 100, left: 100 };
let data5;
let data6;
//color    = d3.scaleOrdinal(d3.schemeCategory10);
document.addEventListener('DOMContentLoaded', function() {
    svg5=d3.select("#svg5");
    width = +svg5.style('width').replace('px','');
    height = +svg5.style('height').replace('px','');;
    innerWidth5 = width - margin5.left - margin5.right;
    innerHeight5 = height - margin5.top - margin5.bottom;
  
    // Load both files before doing anything else
    Promise.all([
                d3.csv('VIS5/preprocessed_data/vis5PreprocessedData.csv'),
                d3.csv('VIS5/preprocessed_data/vis5PreprocessedData2.csv')
                  ])
            .then(function(values){
      
    data5=values[0];
    data6=values[1];
    data6.forEach(d=>{
      d["DEATHS"]=+d["DEATHS"];
      d["x"]=+d["x"]
      d["y"]=+d["y"]
    })
    data5.forEach(d=>{
      d["abdominal pain"]=+d["abdominal pain"]
      d["body pain"]=+d["body pain"]
    })
      drawvis5();
            })  
  
  });
let color    = d3.scaleOrdinal(d3.schemeCategory10);
function drawvis5()
{
svg5.select('g').remove();
const g = svg5.append('g')
                        .attr('transform', 'translate('+margin5.left+', '+margin5.top+')');
var div = d3.select("body").append("div")
                        .attr("class", "tooltip-donut")
                        .style("opacity", 0);
    //const color = d3.scaleOrdinal(d3.schemeCategory20c);
    g.selectAll('circles1')
             .data(data6)
             .enter()
             .append('circle')
             .attr('cx', d => d.x)
             .attr('cy', d => d.y)
             .attr('r', d => (30 * ((Math.cbrt(d["DEATHS"]))/Math.cbrt(141466)))+20)
             .style('fill', 'pink')
             //.style("fill", function(d) { return color(d.value); })
             .style('stroke','gray')
             .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Deaths: '+ d["DEATHS"];
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY) + "px");
                     
            //console.log('mousemove on '+d['country']);
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            //console.log('mouseout on ' + d['country']);
          })
             .on('click',function(d){
              svg5.selectAll('rect').remove();
              svg5.selectAll('text.texts').remove();
              symp_data=[]
              
              // initialize the yearData array with 0 values
              for(var key in data5[0]) {
                  if(key == 'SYMPTOM')
                      continue;
                  symp_data.push({ name: key, gdp: 0 });
              }
              symp_name=d["SYMPTOM"]
              //console.log(symp_name)
              const rowdata = data5.find(d=>d["SYMPTOM"]==symp_name);
              //console.log(rowdata)
              symp_data.forEach(function(d) {
                d.gdp = +rowdata[d.name];
            })
            //console.log(d3.max(symp_data,d=>d.gdp))
            let symptoms = symp_data.sort((a,b) => b.gdp - a.gdp)
                                            .slice(0,5);
            const xScale = d3.scaleLinear()
                                            .domain([0,90000])
                                            .range([0,140]);
            svg5.selectAll('rectangle')
              .data(symptoms, d => d.name)
              .join(
                  enter => {
                      const g = enter.append('g')
                                      .attr('transform',(d,i) => `translate(${1000},${100 + i * 25})`);
                      // Append a text element to the glyph, slightly offset to the left
                      // with size=0
                      g.append('text')
                          .attr('x',-10)
                          .attr('class','texts')
                          .style('text-anchor', 'end')
                          .style('alignment-baseline','middle')
                          .style('font-size','0em')
                          .text(d => d.name);
                      // Append a rect to the glyph. Since width is not called, it defaults to 0.

                      g.append('rect')
                          .attr('y',-10)
                          .attr('height', 20)
                          .style('fill','white')
                          .style('stroke','black')
                          .attr('width',140);

                      g.append('rect')
                          .attr('y',-10)
                          .attr('class','rects')
                          .attr('height', 20)
                          .style('fill','blue')
                          .style('stroke','black')
                          .on('mousemove',function(d,i) {
                            div.transition()
                                   .duration(50)
                                   .style("opacity", 1);
                            let num =  'Count: '+ d.gdp;
                            div.html(num)
                                   .style("left", (d3.event.pageX + 15) + "px")
                                   .style("top", (d3.event.pageY) + "px");

                          //console.log('mousemove on '+d['country']);
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                   .duration('50')
                                   .style("opacity", 0);
                          //console.log('mouseout on ' + d['country']);
                        })




                      enter.call(enter => {
                          // After a 1.5 s delay, animate the text's size to normal (1em)
                          enter.selectAll('text.texts')
                              .transition()
                              .duration(500)
                              .style('font-size','1em');
                          // After a 1.5 s delay, animate the rect's width to the gdp value
                          enter.selectAll('rect.rects')
                              .transition()
                              .duration(500)
                              .attr('width', d => xScale(d.gdp))
                              .on
                      })
                  }

       );
    });
g.selectAll('texts')
  .data(data6)
  .enter()
  .append('text')
  .attr('x', d => d.x)
  .attr('y', d => d.y)
  .text(d=>d["SYMPTOM"])
}
