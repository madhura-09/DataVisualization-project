
// Hint: declare global variables here

/*
let width_one
let height_one
let margin_one = { top:50, bottom: 50, right: 50, left: 60 };
let innerWidth_one
let innerHeight_one
let male_data;
let female_data;
let svg_one;
*/

// This function is called once the HTML page is fully loaded by the browser
/*
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg_one element inside this function
   svg_one = d3.select('#svg5')
   svg2 = d3.select('#svg2')
   svg3 = d3.select('#svg3')
   svg4 = d3.select('#svg4')
   svg5 = d3.select('#svg1')
   width_one = +svg_one.style('width').replace('px','');
    height_one = +svg_one.style('height').replace('px','');
    margin_one = { top:50, bottom: 50, right: 50, left: 60 };
    innerWidth_one = width_one - margin_one.left - margin_one.right;
    innerHeight_one = height_one - margin_one.top - margin_one.bottom;
    
   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
        .then(function (values) {
            console.log('loaded females_data.csv and males_data.csv');
            female_data = values[0];
            male_data = values[1];

            // Hint: This is a good spot for doing data wrangling
            male_data.forEach(d => {
                d["Argentina"] = +d["Argentina"]
                d["India"] = +d["India"]
                d["Qatar"] = +d["Qatar"]
                d["United Arab Emirates"] = +d["United Arab Emirates"]
                d["United States"] = +d["United States"]
                d["Year"] = +d["Year"];
            });
           
            
            drawLolliPopChart();
        });
});
    
// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
    svg_one.select('g').remove();
    let zAttrib = 'Afghanistan';
    //let timeExtent = d3.extent(male_data, d => d["Year"])
    //console.log(timeExtent)
    let yScale
    const xScale = d3.scaleTime()
                    .domain([d3.min(male_data, d => new Date(d["Year"]-1)),d3.max(male_data,d => new Date(d["Year"]+1))])
                    .range([0,innerWidth_one])
    male_max_employment =  d3.max(male_data, d => d[zAttrib])
    female_max_employment = d3.max(female_data, d => d[zAttrib])  
    //console.log(female_max_employment)
    if (male_max_employment >= female_max_employment)            
        {yScale = d3.scaleLinear()
                    .domain([0, male_max_employment ]) 
                    .range([innerHeight_one, 0 ]);
        }
    else 
         {yScale = d3.scaleLinear()
            .domain([0, female_max_employment ]) 
            .range([innerHeight_one, 0 ]);
         }  
    var keys = ["Male Employment Rate","Female Employment Rate"]     
    var size=20
    var color = d3.scaleOrdinal()
                .domain(keys)
                .range(['blue','red'])
    //console.log(male_data)                    
    const g = svg_one.append('g')
                    .attr('transform', 'translate('+margin_one.left+', '+margin_one.top+')');
    var chart = g.selectAll('line1')
                    .data(male_data)
                    .enter()
                    .append('line')
                    .attr('x1', d => xScale(d.Year)-5)
                    .attr('x2', d => xScale(d.Year)-5)
                    .attr('y1', innerHeight_one)
                    .attr('y2', d => yScale(d[zAttrib]))
                    .style('stroke','blue')    
    console.log(chart)                        
    chart = g.selectAll('line2')
                    .data(female_data)
                    .enter()
                    .append('line')
                    .attr('x1', d => xScale(d.Year) + 5)
                    .attr('x2', d => xScale(d.Year) +5)
                    .attr('y1', innerHeight_one)
                    .attr('y2', d => yScale(d[zAttrib]))
                    .style('stroke','red');
    chart = g.selectAll('circle1')
                    .data(male_data)
                    .enter()
                    .append('circle')
                    .attr('cx', d => xScale(d.Year)-5)
                    .attr('cy', d => yScale(d[zAttrib]))
                    .attr('r', 4)
                    .style('fill', 'blue')
    chart = g.selectAll('circle2')
                    .data(female_data)
                    .enter()
                    .append('circle')
                    .attr('cx', d => xScale(d.Year)+5)
                    .attr('cy', d => yScale(d[zAttrib]))
                    .attr('r', 4)
                    .style('fill', 'red');
    chart = g.selectAll("myrect")
                    .data(keys)
                    .enter()
                    .append("rect")
                      .attr("x", 700)
                      .attr("y", function(d,i){ return i*(size+5)-45}) 
                      .attr("width", size)
                      .attr("height", size)
                      .style("fill", function(d){ return color(d)})
    chart = g.selectAll("mylabels")
                     .data(keys)
                     .enter()
                     .append("text")
                     .attr("x", 700 + size*1.2)
                     .attr("y", function(d,i){ return i*(size+5) + size/2 -40}) 
                     .style("fill", function(d){ return color(d)})
                     .text(function(d){ return d})
                     .attr("text-anchor", "left")
                     .style("alignment-baseline", "middle")
    const yAxis = d3.axisLeft(yScale);
    g.append('g').call(yAxis);
        
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    g.append('g').call(xAxis)
                .attr('transform',`translate(0,${innerHeight_one})`)
    g.append('text')
                .attr('x',innerWidth_one/2)
                .attr('y',innerHeight_one+40)
                .text("Year");
    g.append('text')
                .attr('transform','rotate(-90)')
                .attr('y','-40px')
                .attr('x',-innerHeight_one/2)
                .attr('text-anchor','middle')
                .text("Employment Rate" )                            
    console.log('trace:drawLollipopChart()');
}*/
// =======

// >>>>>>> 6e74cf0ea34de9d2db627cd8c1613949ece45e2a
