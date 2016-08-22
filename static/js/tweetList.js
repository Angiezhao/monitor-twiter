var setUps;
var tweetNum = 10;
function init(targetID){
    //Set size of svg element and chart
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = $(".rightside").width() - margin.left - margin.right,
        height = $(".rightside").height() - margin.top - margin.bottom,
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
        .attr("class", "tweet")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("div")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Package and export setUps
    var setUps = {
      margin:margin, width:width, height:height, categoryIndent:categoryIndent,
      svg:svg, x:x, y:y
    }
    return setUps;
}

function redrawTweet(targetID, newdata) {

    //Import setUps
    var margin=setUps.margin, width=setUps.width, height=setUps.height, categoryIndent=setUps.categoryIndent, svg=setUps.svg, x=setUps.x, y=setUps.y;

    //Reset domains
    y.domain(newdata.sort(function(a,b){
      return b.id - a.id;
    })
      .map(function(d) { return d.key; }));
    var barmax = d3.max(newdata, function(e) {
      return e.id;
    });
    x.domain([0,barmax]);

    //ENTER

    //Bind new data to chart rows 
    //Create chart row and move to below the bottom of the chart
    var chartRow = svg.selectAll("g")
      .data(newdata, function(d){ 
            return d["place"]["name"]
        });

    var newRow = chartRow
      .enter()
      .append("div")
      .attr("class", "twPanel");
      //.attr("transform", function(d, i){return "translate(0, " + parseInt(height/tweetNum*i) + ")"});
    var newUserImg = newRow
      .append("div")
      .attr("class", "userImg");
      // .append("g")
      // .attr("class", "tweetRow");

    var newTweet = newRow
      .append("div")
      .attr("class", "tweetContent")

    var newTweetTitle = newTweet
      .append("div")
      .attr("class", "tweetTitle");

    newUserImg.append('img')
      .attr("src", function(d){ return d["user"]["profile_image_url_https"]})
      .attr("opacity",1);

    //Add value places + user.name
    newTweetTitle.append("span")
      .attr("class","userName")
      .attr("opacity",1)
      .attr("anchor", "middle")
      .text(function(d){return d["user"]["screen_name"] });

    newTweetTitle.append("span")
      .attr("class","place")
      .attr("opacity",1)
      .attr("anchor", "middle")
      .text(function(d){return d["place"]["name"] });  
    

    //Add tweetText
    newTweetTitle.append("div")
      .attr("class","tweetText")
      .html(function(d){ return d.text});
      //.selectAll(".tweetText text");
      //.call(wrap, width);

    // newTweetRow.append('img')
    //   .attr("class","tweetImg")
    //   .attr("src", function(d){ console.log(d["entities"]["urls"][0]["url"]); return d["entities"]["urls"][0]["url"]})
    //   .attr("y", 0)
    //   .attr("x", 0)
    //   .attr("width",100)
    //   .attr("height",100);

    var t = d3.transition()
              .duration(750);

    //Update tweetText widths
    d3.select(".tweetText").transition(t)
      .attr("opacity",1);

    //Update data places
    d3.select(".place").transition(t)
      .attr("opacity",1);

    //EXIT

    //Fade out and remove exit elements
    newTweet.exit()
      .transition(t)
      .style("opacity","0")
      .attr("transform", function(d, i){return "translate(0, " + parseInt(height/tweetNum*i) + ")"})
      .remove();

    //REORDER ROWS

    var delay = function(d, i) { return 200 + i * 30; };

    newTweet.transition(t)
        .delay(delay)
        .duration(900)
        .attr("transform", function(d){ return "translate(0," + y(d.key) + ")"; });
    
};

//Pulls data
function pullTweet(setUps,callback, data){

    var newData = data;

    newData = formatTweet(newData);

    callback(setUps,newData);
}

//Take the top 15 values
function formatTweet(data){
    return data.slice(0, tweetNum);
}

//push data to redraw
function redrawTweetDetail(setUps, data){
    pullTweet(setUps,redrawTweet,data);
}

function wrap(texts, width){
  texts._parents.forEach(function(text){
    var words = text.textContent.split(/\s+/).reverse();
    var word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.5,
        y = 0,
        dy = 2,
        tspan = d3.select(text)
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", dy +"em");
    
    while(word = words.pop()){
      line.push(word);
      tspan.text(line.join(" "));
      if(tspan.node().getComputedTextLength() > width){
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = d3.select(text).append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
      }
    }
  })
};


