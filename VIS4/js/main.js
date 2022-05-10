var svgVis4;
var svg_four;

margin_four = {top: 100, right: 800, bottom: 500, left: 100}
width_four = 1000
height_four = 700

var unique_dates = []
var dates_data = []

var x = d3.timeParse("%Y-%m-%d")
var y = d3.timeFormat("%b-%d")

var deaths_data = []
var hospitalized_data = []

var countriesSymptoms = Array.from({length: 98}, (_, index) => index + 1);

var div = d3.select("body").append("div")  
    .attr("class", "tooltip")        
    .style("opacity", 0);


document.addEventListener('DOMContentLoaded', function() {
    svg_four = d3.select("#svg4")
    .append("svg")
    .attr("width", width_four)
    .attr("height", height_four + margin_four.top + margin_four.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_four.left + "," + margin_four.top + ")")
    .attr('display','auto')
    .attr('margin','auto');

    Promise.all([d3.csv('VIS4/preprocessed_data/vis4Deaths.csv'),
                 d3.csv('VIS4/preprocessed_data/vis4Hospitalized.csv')])
            .then(function(values){
      
      vis4Deaths=values[0]
      vis4Hospitalized=values[1]

      for(var i=0; i<vis4Deaths.length; i++)
      {
        dates_data.push(vis4Deaths[i].DATE)
        if(vis4Deaths[i].SYMPTOM == 'others' ||vis4Deaths[i].SYMPTOM == 'vomiting' ||vis4Deaths[i].SYMPTOM == 'abdominal pain' ||vis4Deaths[i].SYMPTOM == 'injury' ||vis4Deaths[i].SYMPTOM == 'headache' ||vis4Deaths[i].SYMPTOM == 'vaginal' ||vis4Deaths[i].SYMPTOM == 'pregnant' ||vis4Deaths[i].SYMPTOM == 'chest')
        {
          deaths_data.push({"country": vis4Deaths[i].COUNTRY, "date": vis4Deaths[i].DATE, "symptom":vis4Deaths[i].SYMPTOM, "deaths":vis4Deaths[i].DEATHS})
        }
      }

      for(var i=0; i<vis4Hospitalized.length; i++)
      {

        if(vis4Hospitalized[i].SYMPTOM == 'others' ||vis4Hospitalized[i].SYMPTOM == 'vomiting' ||vis4Hospitalized[i].SYMPTOM == 'abdominal pain' ||vis4Hospitalized[i].SYMPTOM == 'injury' ||vis4Hospitalized[i].SYMPTOM == 'headache' ||vis4Hospitalized[i].SYMPTOM == 'vaginal' ||vis4Hospitalized[i].SYMPTOM == 'pregnant' ||vis4Hospitalized[i].SYMPTOM == 'chest')
        {
          hospitalized_data.push({"country": vis4Hospitalized[i].COUNTRY, "date": vis4Hospitalized[i].DATE, "symptom":vis4Hospitalized[i].SYMPTOM, "hospitalized":vis4Hospitalized[i].HOSPITALIZED})
        }
      }

    unique_dates = Array.from(new Set(dates_data));
    survivalChange()
    
    })
  });
 
    function survivalChange(survival){
      var survival_value = d3.select("#survival").node().value
      if(survival_value == "hospitalized"){
        drawHospitalized();
      }
      if(survival_value=="deaths"){
        drawDeaths();
      }
    }

    function test_parse(symp, cntry)
    {
      sym_map = new Map()
      sym_map.set('others',8)
      sym_map.set('vomiting',7)
      sym_map.set('abdominal pain',6)
      sym_map.set('injury',5)
      sym_map.set('headache',4)
      sym_map.set('vaginal',3)
      sym_map.set('pregnant',2)
      sym_map.set('chest',1)

      cntry_map = new Map()
      cntry_map.set('Aleppo',0)
      cntry_map.set('Colombia',1)
      cntry_map.set('Iran',2)
      cntry_map.set('Karachi',3)
      cntry_map.set('Lebanon',4)
      cntry_map.set('Nairobi',5)
      cntry_map.set('Saudiarabia',6)
      cntry_map.set('Thailand',7)
      cntry_map.set('Turkey',8)
      cntry_map.set('Venezuela',9)
      cntry_map.set('Yemen',10)

      return sym_map.get(symp)+(cntry_map.get(cntry)*8)
    }
    

    function drawDeaths(){
    
    svg_four.selectAll('*').remove();

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("text-align","left")
    .style("padding","5px")
    .style("background","white")
    .style("border","1px solid black")
    .style("border-radius","8px")
    .style("pointer-events","none")
    .style("font-size","15px")
    .style("opacity","0")

    var x = d3.scaleBand()
      .range([ 0, width_four ])
      .domain(countriesSymptoms)
      .padding(0.01);
    svg_four.append("g")
      .attr("transform", "translate(0," + height_four + ")")
      .call(d3.axisBottom(x))
      .selectAll('.tick','.tick line').remove()
      .selectAll('.domain').remove();

    var y = d3.scaleBand()
      .range([ height_four, 0 ])
      .domain(unique_dates)
      .padding(0.01);

    svg_four.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%d-%B")).tickSize(0.1))
      .call(d3.axisLeft(y))
      .attr("dx", "0.3em")
      .selectAll('.tick line').remove()
      .selectAll('.domain').remove();
    svg_four.selectAll(".tick text")
      .attr("font-size","0.9em");



      var myColor = d3.scaleLinear()
        .range(["#b7efc5","#155d27"])
        .domain([1,140])

     svg_four.selectAll()
     .data(deaths_data)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(test_parse(d.symptom,d.country)) })
      .attr("y", function(d) { return y(d.date) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.deaths)} )
      .on("mouseover", function(event,d) {
        console.log("mouseover")
        tooltip.transition()
             .duration(50)
             .style("opacity", 1);

      })
      .on("mousemove", function(d) {
        console.log("mousemove")
        tooltip.transition()
             .duration(50)
             .style("opacity", 1);

        let num =  "Deaths: "+ d.deaths + "<br/>" + " Country: " + d.country + "<br/>" + "Symptom: "+d.symptom + "<br/>" + "Date: " + d.date;

        tooltip.html(num)
             .style("left", (d3.event.pageX + 10) + "px")
             .style("top", (d3.event.pageY + 15) + "px");
      })
      .on("mouseleave", function(d) {
        tooltip.transition()
             .duration(50)
             .style("opacity", 0);
        
      });

      svg_four.append("line")
      .attr("x1", x(0))
      .attr("y1", 0)
      .attr("x2", x(0))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(9))
      .attr("y1", 0)
      .attr("x2", x(9))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(17))
      .attr("y1", 0)
      .attr("x2", x(17))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(25))
      .attr("y1", 0)
      .attr("x2", x(25))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(33))
      .attr("y1", 0)
      .attr("x2", x(33))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(41))
      .attr("y1", 0)
      .attr("x2", x(41))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(49))
      .attr("y1", 0)
      .attr("x2", x(49))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(57))
      .attr("y1", 0)
      .attr("x2", x(57))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(65))
      .attr("y1", 0)
      .attr("x2", x(65))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(73))
      .attr("y1", 0)
      .attr("x2", x(73))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(81))
      .attr("y1", 0)
      .attr("x2", x(81))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");

      svg_four.append("line")
      .attr("x1", x(89))
      .attr("y1", 0)
      .attr("x2", x(89))
      .attr("y2", height_four)
      .style("stroke-width", 1.5)
      .style("stroke-linecap", "round")
      .style("stroke", "black");


      svg_four.append("text")
      .attr("transform","translate(22,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Aleppo");

      svg_four.append("text")
      .attr("transform","translate(89,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Columbia");

      svg_four.append("text")
      .attr("transform","translate(192,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Iran");

      svg_four.append("text")
      .attr("transform","translate(256,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Karachi");

      svg_four.append("text")
      .attr("transform","translate(336,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Lebanon");

      svg_four.append("text")
      .attr("transform","translate(422,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Nairobi");

      svg_four.append("text")
      .attr("transform","translate(490,695)")
      .style("font-size","14px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("SaudiArabia");

      svg_four.append("text")
      .attr("transform","translate(582,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Thailand");

      svg_four.append("text")
      .attr("transform","translate(671,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Turkey");

      svg_four.append("text")
      .attr("transform","translate(742,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Venezuela");

      svg_four.append("text")
      .attr("transform","translate(836,695)")
      .style("font-size","15px")
      .style("opacity","0.8")
      .style("fill","black")
      .style("font-weight","bold")
      .text("Yemen");

      var linearGradient = svg_four.append("linearGradient")
      .attr("id", "linear-gradient");
      
      svg_four.append("linearGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "50%")
      .attr("y2", "0%");

      linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#b7efc5");

      linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#081c15"); 

      svg_four.append("rect")
      .attr("width", 700)
      .attr("height", 30)
      .attr("transform","translate(0,740)")
      .style("fill", "url(#linear-gradient)");

      svg_four.append("text")
      .attr("transform","translate(0,790)")
      .text("Intensity of the colour is directly proportional to the number of deaths");

    }

    function drawHospitalized(){

      svg_four.selectAll('*').remove();

      var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("text-align","left")
        .style("padding","5px")
        .style("background","white")
        .style("border","1px solid black")
        .style("border-radius","8px")
        .style("pointer-events","none")
        .style("font-size","15px")
        .style("opacity","0")
    
        var x = d3.scaleBand()
          .range([ 0, width_four ])
          .domain(countriesSymptoms)
          .padding(0.01);

        svg_four.append("g")
          .attr("transform", "translate(0," + height_four + ")")
          .call(d3.axisBottom(x))
          .selectAll('.tick','.tick line').remove()
          .selectAll('.domain').remove();
    
        var y = d3.scaleBand()
          .range([ height_four, 0 ])
          .domain(unique_dates)
          .padding(0.05);
    
        svg_four.append("g")
          .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%d-%B")).tickSize(0.1))
          .call(d3.axisLeft(y))
          .attr("dx", "0.3em")
          .selectAll('.tick line').remove()
          .selectAll('.domain').remove();
        svg_four.selectAll(".tick text")
          .attr("font-size","0.9em");
  
  
         var myColor = d3.scaleLinear()
         .range(['#ffb3c1','#800f2f'])
         .domain([1,2800]);
    
         svg_four.selectAll()
         .data(hospitalized_data)
          .enter()
          .append("rect")
          .attr("x", function(d) { return x(test_parse(d.symptom,d.country)) })
          .attr("y", function(d) { return y(d.date) })
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) { return myColor(d.hospitalized)} )
          .on("mouseover", function(event,d) {
            console.log("mouseover")
            tooltip.transition()
                 .duration(50)
                 .style("opacity", 1);
    
          })
          .on("mousemove", function(d) {
            console.log("mousemove")
            tooltip.transition()
                 .duration(50)
                 .style("opacity", 1);
    
            let num =  "Hospitalized: "+ d.hospitalized + "<br/>" + " Country: " + d.country + "<br/>" + "Symptom: "+d.symptom + "<br/>" + "Date: " + d.date;
    
            tooltip.html(num)
                 .style("left", (d3.event.pageX + 10) + "px")
                 .style("top", (d3.event.pageY + 15) + "px");
          })
          .on("mouseleave", function(d) {
            tooltip.transition()
                 .duration(50)
                 .style("opacity", 0);
          })
          
          svg_four.append("line")
          .attr("x1", x(0))
          .attr("y1", 0)
          .attr("x2", x(0))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(9))
          .attr("y1", 0)
          .attr("x2", x(9))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(17))
          .attr("y1", 0)
          .attr("x2", x(17))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(25))
          .attr("y1", 0)
          .attr("x2", x(25))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(33))
          .attr("y1", 0)
          .attr("x2", x(33))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(41))
          .attr("y1", 0)
          .attr("x2", x(41))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(49))
          .attr("y1", 0)
          .attr("x2", x(49))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(57))
          .attr("y1", 0)
          .attr("x2", x(57))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(65))
          .attr("y1", 0)
          .attr("x2", x(65))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(73))
          .attr("y1", 0)
          .attr("x2", x(73))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(81))
          .attr("y1", 0)
          .attr("x2", x(81))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("line")
          .attr("x1", x(89))
          .attr("y1", 0)
          .attr("x2", x(89))
          .attr("y2", height_four)
          .style("stroke-width", 1.5)
          .style("stroke-linecap", "round")
          .style("stroke", "black");
    
          svg_four.append("text")
          .attr("transform","translate(22,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Aleppo");

          svg_four.append("text")
          .attr("transform","translate(89,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Columbia");

          svg_four.append("text")
          .attr("transform","translate(192,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Iran");

          svg_four.append("text")
          .attr("transform","translate(256,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Karachi");

          svg_four.append("text")
          .attr("transform","translate(336,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Lebanon");

          svg_four.append("text")
          .attr("transform","translate(422,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Nairobi");

          svg_four.append("text")
          .attr("transform","translate(490,695)")
          .style("font-size","14px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("SaudiArabia");

          svg_four.append("text")
          .attr("transform","translate(582,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Thailand");

          svg_four.append("text")
          .attr("transform","translate(671,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Turkey");

          svg_four.append("text")
          .attr("transform","translate(742,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Venezuela");

          svg_four.append("text")
          .attr("transform","translate(836,695)")
          .style("font-size","15px")
          .style("opacity","1")
          .style("fill","#caf0f8")
          .style("font-weight","bold")
          .text("Yemen");

          var linearGradient = svg_four.append("linearGradient")
          .attr("id", "linear-gradient");
          
          svg_four.append("linearGradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "50%")
          .attr("y2", "0%");

          linearGradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#ffb3c1");

          linearGradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#250902"); 

          svg_four.append("rect")
          .attr("width", 700)
          .attr("height", 30)
          .attr("transform","translate(0,740)")
          .style("fill", "url(#linear-gradient)");

          svg_four.append("text")
          .attr("transform","translate(0,790)")
          .text("Intensity of the colour is directly proportional to the number of hospitalized");
         
      }
