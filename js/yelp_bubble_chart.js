/* 
 * Style ref:
 * https://bost.ocks.org/mike/chart/
 *
 * Bubble chart with D3:
 * https://github.com/vlandham/bubble_chart_v4/
 */
function bubbleChart() {
  var width = 1024;
  var height = 768;

  var tooltip = floatingTooltip('gates_tooltip', 240);

  var center = { x: width / 2, y: height / 2 };

  var stateCenters = {
    LA: { x: (3 * width / 16) + 30, y: height / 3 },
    ID: { x: width / 3, y: (2* height / 3) },
    IL: { x: (3 * width / 8) + 50, y: (height / 3 ) - 60 },
    NJ: { x: width / 2, y: 2* height / 3 },
    CA: { x: 5 * width / 8, y: height / 3 },
    FL: { x: 2 * width / 3, y: 2* height / 3 },
    DE: { x: 13 * width / 16, y: height / 3 }
  }

  var starCenters = {
    1: { x: width / 3, y: 2* height / 3 },
    2: { x: 3 * width / 8, y: height / 3 },
    3: { x: width / 2, y: 2* height / 3 },
    4: { x: 5 * width / 8, y: height / 3 },
    5: { x: 2 * width / 3, y: 2* height / 3 }
  }

  var stateTitle = {
    LA: { x: (width / 10 ) - 50 , y: height / 8 },
    ID: { x: 9 * width / 40, y: (9 * height / 20) + 190 },
    IL: { x: (7 * width / 20) + 20, y: height / 8 },
    NJ: { x: width / 2, y: (9 * height / 20) + 150 },
    CA: { x: 13 * width / 20, y: height / 8 },
    FL: { x: 31 * width / 40, y: (9 * height / 20) + 100 },
    DE: { x: 9 * width / 10, y: height / 8 }
  }

  var starTitle = {
    1: { x: width / 5, y: height / 9 },
    2: { x: 13 * width / 40, y: (height / 9) + 100 },
    3: { x: (width / 5) + 100, y: (8 * height / 20) + 300 },
    4: { x: (27 * width / 40) + 170, y: height / 9 },
    5: { x: (4 * width / 5) + 100, y: (8 * height / 20) + 400 }
  }

  var forceStrength = 0.03;

  var svg = null;
  var bubbles = null;
  var nodes = [];

  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  simulation.stop();

  var fillColor = d3.scaleOrdinal(d3.schemeCategory20c)
      .domain(['LA', 'ID', 'IL', 'NJ', 'CA', 'FL', 'DE']);

  function createNodes(rawData) {
    var maxAmount = d3.max(rawData, function (d) { return +d.reviews; });

    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 35])
      .domain([0, maxAmount]);

    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.reviews),
        reviews: +d.reviews,
        stars: +d.stars,
        name: d.yelp_category,
        state: d.state,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    myNodes.sort(function (a, b) { return b.reviews - a.reviews; });
    
    return myNodes;
  }

  var chart = function chart(selector, rawData) {
    nodes = createNodes(rawData);

    bubble_svg = d3.select(selector)
      .append('svg')
      .attr('id', 'bubble_svg')
      .attr('width', width)
      .attr('height', height);

    bubbles = bubble_svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.state); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.state)).darker(); })
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    bubbles = bubbles.merge(bubblesE);

    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    simulation.nodes(nodes);

    groupBubbles();
  };

  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  function nodeStatePosX(d) {
    return stateCenters[d.state].x;
  }

  function nodeStatePosY(d) {
    return stateCenters[d.state].y;
  }  

  function nodeStarPosX(d) {
    return starCenters[Math.floor(d.stars)].x;
  }

  function nodeStarPosY(d) {
    return starCenters[Math.floor(d.stars)].y;
  }  

  function groupBubbles() {
    hideTitles('.state');
    hideTitles('.stars');

    d3.selectAll("#bubble_state_annotation").remove()
    d3.selectAll("#bubble_star_annotation").remove()    

    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));

    simulation.alpha(1).restart();
  }

  function splitStateBubbles() {
    hideTitles('.stars');
    showTitles(stateTitle, 'state');

    d3.selectAll("#bubble_state_annotation").remove()
    d3.selectAll("#bubble_star_annotation").remove()
    d3.select("#bubble_svg").append("g")
      .attr("class", "annotation-group")
      .attr("id", "bubble_state_annotation")
      .call(bubble_state_makeAnnotations)      

    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeStatePosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeStatePosY));

    simulation.alpha(1).restart();
  }

  function splitStarBubbles() {
    hideTitles('.state');
    showTitles(starTitle, 'stars');

    d3.selectAll("#bubble_state_annotation").remove()
    d3.selectAll("#bubble_star_annotation").remove()
    d3.select("#bubble_svg").append("g")
      .attr("class", "annotation-group")
      .attr("id", "bubble_star_annotation")
      .call(bubble_star_makeAnnotations)    
    
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeStarPosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeStarPosY));

    simulation.alpha(1).restart();
  }

  function hideTitles(title) {
    bubble_svg.selectAll(title).remove();
  }

  function showTitles(title, titleClass) {
    var titleData = d3.keys(title);
    var titles = bubble_svg.selectAll('.'+titleClass)
      .data(titleData);

    titles.enter().append('text')
      .attr('class', titleClass)
      .attr('x', function (d) { return title[d].x; })
      .attr('y', function (d) { return title[d].y; })
      .attr('text-anchor', 'middle')
      .text(function (d) { 
        if (d == 1) {
          return '⭐';
        } else if (d == 2) {
          return '⭐⭐';
        } else if (d == 3) {
          return '⭐⭐⭐';
        } else if (d == 4) {
          return '⭐⭐⭐⭐';
        } else if (d == 5) {
          return '⭐⭐⭐⭐⭐';
        } else {
          return d; 
        }
      });
  }

  function showDetail(d) {
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Restaurant Category: </span><span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="name">State: </span><span class="value">' +
                  d.state +
                  '</span><br/>' +
                  '<span class="name">Reviews: </span><span class="value">' +
                  addCommas(d.reviews) +
                  '</span><br/>' +
                  '<span class="name">Average Stars: </span><span class="value">' +
                  d.stars +
                  '</span>';

    tooltip.showTooltip(content, d3.event);
  }

  function hideDetail(d) {
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.state)).darker());

    tooltip.hideTooltip();
  }

  chart.toggleDisplay = function (displayName) {
    if (displayName === 'state') {
      splitStateBubbles();
    } else if (displayName === 'stars') {
      splitStarBubbles();
    }else {
      groupBubbles();
    }
  };

  return chart;
}

var myBubbleChart = bubbleChart();

function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      d3.selectAll('.button').classed('active', false);
      var button = d3.select(this);

      button.classed('active', true);

      var buttonId = button.attr('id');

      myBubbleChart.toggleDisplay(buttonId);
    });
}

function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

d3.csv('data/yelp_bubble_chart_top_200.csv', display);

setupButtons();
