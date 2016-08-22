function drawBar(targetID, data){
    var margin = {top: 10, right: 10, bottom: 10, left: 15},
        width = $(".histgram").width() - margin.left - margin.right,
        height = $(".histgram").height()/20 - margin.top - margin.bottom;

    // Parse the date / time
    //var parseDate = d3.timeFormat("%Y-%m").parse;
    //console.log(data);
    data.forEach(function(d) {
        d.key_as_string = new Date(d.key_as_string);
        d.doc_count = +d.doc_count;
    });
    var x = d3.scaleTime().range([0, width], .05);

    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x);
        //.tickFormat(d3.timeFormat("%Y-%m"));

    var yAxis = d3.axisLeft(y)
        .ticks(10);

    var svg = d3.select(targetID).append("svg")
        .attr("class", "frequency")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("fill", "#708090");
        
      x.domain(data.map(function(d) { return d.key_as_string; }));
      y.domain([0, d3.max(data, function(d) { return d.doc_count; })]);

      // svg.append("g")
      //     .attr("class", "x axis")
      //     .attr("transform", "translate(0," + height + ")")
      //     .call(xAxis)
      //   .selectAll("text")
      //     .style("text-anchor", "end")
      //     .attr("dx", "-.8em")
      //     .attr("dy", "-.55em")
      //     .attr("transform", "rotate(-90)" );

      // svg.append("g")
      //     .attr("class", "y axis")
      //     .call(yAxis)
      //   .append("text")
      //     .attr("transform", "rotate(-90)")
      //     .attr("y", 6)
      //     .attr("dy", ".71em")
      //     .style("text-anchor", "end")
      //     .text("Value ($)");

      svg.selectAll(".frequency")
          .data(data)
        .enter().append("rect")
          .attr("x", function(d, i) { return width/25*i; })
          .attr("width", width/25-1)
          .attr("y", function(d) { return y(d.doc_count); })
          .attr("height", function(d) { return height - y(d.doc_count); });

}