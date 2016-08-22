var settings;
var topNum = 10;
function setup(targetID){
    //Set size of svg element and chart
    var margin = {top: 0, right: 10, bottom: 0, left: 10},
        width = $(".histgram").width() - margin.left - margin.right,
        height = $(".histgram").height() - margin.top - margin.bottom,
        categoryIndent = 0,
        defaultBarWidth = 2000;

    //Set up scales
    var x = d3.scaleLinear()
      .domain([0,defaultBarWidth])
      .range([0,width]);
    var y = d3.scaleOrdinal()
      .range([0, height], 0.1, 0);

    //Create SVG element
    d3.select(targetID).selectAll("div").remove()
    var svg = d3.select(targetID).append("div")
        .attr("class", "whole")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("div")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Package and export settings
    var settings = {
      margin:margin, width:width, height:height, categoryIndent:categoryIndent,
      svg:svg, x:x, y:y
    }
    return settings;
}

function redrawChart(targetID, newdata) {

    //Import settings
    var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent, svg=settings.svg, x=settings.x, y=settings.y;

    //Reset domains
    y.domain(newdata.sort(function(a,b){
      return b.doc_count - a.doc_count;
    })
      .map(function(d) { return d.key; }));
    var barmax = d3.max(newdata, function(e) {
      return e.doc_count;
    });
    x.domain([0,barmax]);

    //ENTER

    //Bind new data to chart rows 
    //Create chart row and move to below the bottom of the chart

    var chartRow = svg.selectAll("div")
      .data(newdata, function(d){ 
            return d.key
        });

    var newRow = chartRow
      .enter()
      .append("div")
      .attr("class", "nyBar")
      .style("background", function(d, i){
          if(i==uniqRound){ 
            return "#B0E0E6"
          } else {
            return "white"
          }
      });

    var newRowTitle = newRow
      .append("svg")
      .attr("height", height/20)
      .attr("width", width)
      .append("g")
      .attr("class", "chartRow");
       // .attr("transform", function(d, i){ 
       //      if(i==uniqRound){ 
       //        return "translate(0, " + parseInt(height/(topNum+1)*i) + ")"
       //      } else {
       //        return "translate(0, " + parseInt(height/(topNum+1)*(i+1)) + ")"
       //      };
       //  });

    //Add rectangles
    newRowTitle.append("rect")
      .attr("class","bar")
      .attr("x", 0)
      .attr("opacity",1)
      .attr("height", function(d, i){
          if(i==uniqRound){ 
            return 65
          } else {
            return height/(topNum+1)
          }
      })
      .attr("width", function(d) { return width;})
      .style("fill", function(d, i){
          if(i==uniqRound){ 
            return "#B0E0E6"
          } else {
            return "white"
          }
      });



    //Add doc_count labels
    newRowTitle.append("text")
      .attr("class","label")
      .attr("y", height/topNum/2)
      .attr("width", width/2)
      .attr("x",0)
      .attr("opacity",1)
      .attr("dy","-0.3em")
      .attr("dx","0.5em")
      .text(function(d){return ("#" + d.key);})
      .style("fill", "#777777"); 
    
    //Add Headlines
    newRowTitle.append("text")
      .attr("class","category")
      .attr("text-overflow","ellipsis")
      .attr("y", height/topNum/2)
      .attr("width", width)
      .attr("x",width-35)
      .attr("opacity",1)
      .attr("dy","-0.3em")
      .attr("dx", 0)
      .text(function(d){return d.doc_count})
      .style("fill", "#777777");

    newRow.append("div")
        .attr("class", function(d, i){ return "hashLine".concat(i)});

    //UPDATE
    var t = d3.transition()
              .duration(750);
    //Update bar widths
    d3.select(".bar").transition(t)
      .attr("width", function(d) { return x(d.doc_count);})
      .attr("opacity",1);

    //Update data labels
    d3.select(".label").transition(t)
      .attr("opacity",1)
      .tween("text", function(d) { 
        var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d.doc_count);
        return function(t) {
          this.textContent = Math.round(i(t));
        };
      });

    //Fade in categories
    d3.select(".category").transition(t)
      .attr("opacity",1);

    //EXIT

    //Fade out and remove exit elements
    newRow.exit()
      .transition(t)
      .style("opacity","0")
      .attr("transform", function(d, i){return "translate(0, " + parseInt(height/topNum*i) + ")"})
      .remove();

    //REORDER ROWS

    var delay = function(d, i) { return 200 + i * 30; };

    newRow.transition(t)
        .delay(delay)
        .duration(900)
        .attr("transform", function(d){ return "translate(0," + y(d.key) + ")"; });
    
};

//Pulls data
function pullData(settings,callback, data){

    var newData = data;

    newData = formatData(newData);

    callback(settings,newData);
}

//Take the top 20 doc_counts
function formatData(data){
  return data.sort(function (a, b) {
                    return b.doc_count - a.doc_count;
                    })
             .slice(0, topNum);
}

//push data to redraw
function redraw(settings, data){
    pullData(settings,redrawChart,data);
}


