var setKeyword;
var topNum = 12;
function setkey(targetID){
    //Set size of svg element and chart
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = $(".keywordPanel").width() - margin.left - margin.right,
        height = $(".keywordPanel").height() - margin.top - margin.bottom,
        categoryIndent = 0,
        defaultBarWidth = 2000;

    //Set up scales
    var x = d3.scaleLinear()
      .domain([0,defaultBarWidth])
      .range([0,width]);
    var y = d3.scaleLinear()
      .range([0, height]);

    //Create SVG element
    d3.select(targetID).selectAll("div").remove()
    var svg = d3.select(targetID).append("div")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("div")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Package and export setKeyword
    var setKeyword = {
      margin:margin, width:width, height:height, categoryIndent:categoryIndent,
      svg:svg, x:x, y:y
    }
    return setKeyword;
}

function redrawKey(targetID, newdata) {

    //Import setKeyword
    var margin=setKeyword.margin, width=setKeyword.width, height=setKeyword.height, categoryIndent=setKeyword.categoryIndent, svg=setKeyword.svg, x=setKeyword.x, y=setKeyword.y;

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
    var chartRow = svg.selectAll("div")
      .data(newdata, function(d){ 
            return d.key
        });

    var newRow = chartRow
      .enter()
      .append("div")
      .attr("class", "keyWord");

    //Add Rect
    newRow.insert("rect")
        .attr("class","keyBar")
        .attr("x", 0)
        .attr("opacity",1)
        .attr("width", function(d) { return x(d.doc_count)});  

    //Add keyword labels
    newRow.append("text")
      .attr("opacity",0)
      .text(function(d){return d.key});      

    //UPDATE
    var t = d3.transition()
              .duration(750);

    //Update data labels
    d3.select(".keyWord").transition(t)
      .attr("opacity",1)
      .tween("text", function(d) { 
        var i = d3.interpolate(+this.textContent.replace(/\,/g,''), + d.doc_count);
        return function(t) {
          this.textContent = Math.round(i(t));
        };
      });
    d3.select(".keyBar").transition()
          .duration(300)
          .attr("opacity",1)
          .attr("width", function(d) { return x(d.doc_count)});

    //EXIT

    //Fade out and remove exit elements
    chartRow.exit()
      .transition(t)
      .style("opacity","0")
      .attr("transform", function(d, i){return "translate(0, " + parseInt(height/topNum*i) + ")"})
      .remove();

    //REORDER ROWS

    var delay = function(d, i) { return 200 + i * 30; };

    chartRow.transition(t)
        .delay(delay)
        .duration(900)
        .attr("transform", function(d){ return "translate(0," + y(d.key) + ")"; });
    
};

//Pulls data
function pullKey(setKeyword,callback, data){

    var newData = data;

    newData = formatKey(newData);

    callback(setKeyword,newData);
}

//Take the top 20 doc_counts
function formatKey(data){
  return data.sort(function (a, b) {
                    return b.doc_count - a.doc_count;
                    })
             .slice(0, topNum);
}

//push data to redraw
function redrawAllKey(setKeyword, data){
    pullKey(setKeyword,redrawKey,data);
}

