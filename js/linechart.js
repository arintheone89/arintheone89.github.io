var margin = {top: 20, right: 200, bottom: 100, left: 50},
    margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;
var bisectDate = d3v3.bisector(function(d) { return d.date; }).left;
var xScale = d3v3.time.scale()
    .range([0, width]),
    xScale2 = d3v3.time.scale()
    .range([0, width]); 
var yScale = d3v3.scale.linear()
    .range([height, 0]);
var line_color = d3v3.scale.ordinal().range(["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);  
var xAxis = d3v3.svg.axis()
    .scale(xScale)
    .tickFormat(function(n){ return Math.round((n / 100 * 24) - 24) })
    .orient("bottom"),
    xAxis2 = d3v3.svg.axis() 
    .scale(xScale2)
    .tickFormat(function(n){ return Math.round((n / 100 * 24) - 24) })
    .orient("bottom");    
var yAxis = d3v3.svg.axis()
    .scale(yScale)
    .orient("left");  
var line = d3v3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.checkin); })
    .defined(function(d) { return d.checkin; }); 
var maxY; 
var line_svg = d3v3.select("#linechart").append("svg")
    .attr("id", "linechart_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
line_svg.append("rect")
    .attr("width", width)
    .attr("height", height)                                    
    .attr("x", 0) 
    .attr("y", 0)
    .attr("id", "mouse-tracker")
    .style("fill", "white"); 
  
var context = line_svg.append("g")
    .attr("transform", "translate(" + 0 + "," + 410 + ")")
    .attr("class", "context");
line_svg.append("defs")
  .append("clipPath") 
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height); 
d3v3.csv("data/top_200_checkin.csv", function(error, data) { 
  line_color.domain(d3v3.keys(data[0]).filter(function(key) { 
    return key !== "date"; 
  }));
  data.forEach(function(d) { 
  });
  var categories = line_color.domain().map(function(name) { 
    return {
      name: name, 
      values: data.map(function(d) { 
        return {
          date: d.date, 
          checkin: +(d[name]),
          };
      }),
      visible: (name === "American" ? true : false) 
    };
  });
  xScale.domain([100,796]); 
  yScale.domain([0, 3200
  ]);
  xScale2.domain(xScale.domain());
 
 var brush = d3v3.svg.brush()
    .x(xScale2) 
    .on("brush", brushed);
  context.append("g") 
      .attr("class", "x axis1")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);
  var contextArea = d3v3.svg.area() 
    .interpolate("monotone")
    .x(function(d) { return xScale2(d.date); }) 
    .y0(height2) 
    .y1(0); 
  context.append("path") 
    .attr("class", "area")
    .attr("d", contextArea(categories[0].values)) 
    .attr("fill", "#F1F1F2");
    
  context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("height", height2) 
      .attr("fill", "#E6E7E8");  
  line_svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  line_svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Category Checkins");
  var issue = line_svg.selectAll(".issue")
      .data(categories)
    .enter().append("g")
      .attr("class", "issue");   
  issue.append("path")
      .attr("class", "line")
      .style("pointer-events", "none") 
      .attr("id", function(d) {
        return "line-" + d.name.replace(" ", "").replace("/", ""); 
      })
      .attr("d", function(d) { 
        return d.visible ? line(d.values) : null; 
      })
      .attr("clip-path", "url(#clip)")
      .style("stroke", function(d) { return line_color(d.name); });
  var legendSpace = 450 / categories.length;    
  issue.append("rect")
      .attr("width", 10)
      .attr("height", 10)                                    
      .attr("x", width + (margin.right/3) - 15) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
      .attr("fill",function(d) {
        return d.visible ? line_color(d.name) : "#F1F1F2"; 
      })
      .attr("class", "legend-box")
      .on("click", function(d){     
        d.visible = !d.visible; 
        maxY = findMaxY(categories); 
        yScale.domain([0,maxY]);
        line_svg.select(".y.axis")
          .transition()
          .call(yAxis);   
        issue.select("path")
          .transition()
          .attr("d", function(d){
            return d.visible ? line(d.values) : null; 
          })
        issue.select("rect")
          .transition()
          .attr("fill", function(d) {
          return d.visible ? line_color(d.name) : "#F1F1F2";
        });
      })
      .on("mouseover", function(d){
        d3v3.select(this)
          .transition()
          .attr("fill", function(d) { return line_color(d.name); });
        d3v3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 2.5);  
      })
      .on("mouseout", function(d){
        d3v3.select(this)
          .transition()
          .attr("fill", function(d) {
          return d.visible ? line_color(d.name) : "#F1F1F2";});
        d3v3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 1.5);
      })
      
  issue.append("text")
      .attr("x", width + (margin.right/3)) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  
      .text(function(d) { return d.name; }); 

  var hoverLineGroup = line_svg.append("g") 
            .attr("class", "hover-line");
  var hoverLine = hoverLineGroup 
        .append("line")
            .attr("id", "hover-line")
            .attr("x1", 10).attr("x2", 10) 
            .attr("y1", 0).attr("y2", height + 10)
            .style("pointer-events", "none") 
            .style("opacity", 1e-6); 
  var hoverDate = hoverLineGroup
        .append('text')
            .attr("class", "hover-text")
            .attr("y", height - (height-40)) 
            .attr("x", width - 150) 
            .style("fill", "#E6E7E8");
  var columnNames = d3v3.keys(data[0]) 
                  .slice(1); 
  var focus = issue.select("g") 
      .data(columnNames) 
    .enter().append("g") 
      .attr("class", "focus"); 
  focus.append("text") 
        .attr("class", "tooltip")
        .attr("x", width + 20)
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); });     
  d3v3.select("#mouse-tracker") 
  .on("mousemove", mousemove) 
  .on("mouseout", function() {
      hoverDate
          .text(null) 
      d3v3.select("#hover-line")
          .style("opacity", 1e-6); 
  });
  function mousemove() { 
      var mouse_x = d3v3.mouse(this)[0]; 
      var graph_x = xScale.invert(mouse_x); 
      
      var format = d3v3.time.format('%b %Y');
      
      hoverDate.text(format(graph_x)); 
      
      d3v3.select("#hover-line") 
          .attr("x1", mouse_x) 
          .attr("x2", mouse_x)
          .style("opacity", 1); 
      var x0 = xScale.invert(d3v3.mouse(this)[0]), 
      i = bisectDate(data, x0, 1), 
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.select("text").text(function(columnName){
         return (d[columnName]);
      });
  }; 
  function brushed() {
    xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); 
    brush.empty() ? d3v3.select("#linechart_annotation").classed("hidden", false) : d3v3.select("#linechart_annotation").classed("hidden", true);  
    line_svg.select(".x.axis") 
          .transition()
          .call(xAxis);
    maxY = findMaxY(categories); 
    yScale.domain([0,maxY]); 
    line_svg.select(".y.axis") // Redraw yAxis
      .transition()
      .call(yAxis);   
    issue.select("path") 
      .transition()
      .attr("d", function(d){
          return d.visible ? line(d.values) : null; 
      });
    
  };      
}); 
  
  function findMaxY(data){  
    var maxYValues = data.map(function(d) { 
      if (d.visible){
        return d3v3.max(d.values, function(value) { 
          return value.checkin; })
      }
    });
    return d3v3.max(maxYValues);
  }
