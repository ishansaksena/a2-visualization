// A reusable scatterplot to explore data collected from the India 2001 nationwide census

$(function() {
    // Read in the data
    d3.csv('data/all.csv', function(error, data) {

        /* ********************************** Initial setup ********************************** */

        var margin = {
            top: 50,
            right: 50,
            bottom: 100,
            left: 70
        };

        // Height and Width of the chart
        var height = 600 - margin.bottom - margin.top;
        var width = 800 - margin.left - margin.right;
        
        // Append a wrapper svg and g for the chart
        var svg = d3.select('#vis')
        .append("svg")
        .attr('height', 600)
        .attr('width', 800)
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

        var g = svg.append('g')
        .attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
        .attr('height', height)
        .attr('width', width);

        // Global Variables
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();

        // What features to display
        var xVariable = 'Males';
        var yVariable = 'Females';
        
        var xAxis = d3.axisBottom();
        var yAxis = d3.axisLeft();

        /* ********************************** Process data  ********************************** */
        // Get Unique states
        var states = [];
        data.forEach( function(d) {
            if (!states.includes(d.State)) {
                states.push(d.State);
            }
        });

        
        /* ********************************** Create scales  ********************************** */
        var setScales = function() {
            // Find minimum and maximum values, then define x (log) and y (linear) scales
            var xMax =d3.max(data, function(d) {return +d.Males})*1.05;
            var xMin =d3.min(data, function(d) {return +d.Males})*.85;
            xScale.range([0, width]).domain([xMin, xMax]);

            var yMin =d3.min(data, function(d) {return +d.Females})*.9;
            var yMax =d3.max(data, function(d) {return +d.Females})*1.05;
            yScale.range([height, 0]).domain([yMin, yMax]);
        };
        
        var stateScale = d3.scaleOrdinal().range(d3.schemeCategory20).domain(states);
        
        

        /* ********************************** Create Axes  ********************************** */
        var setAxes = function() {
            // Define x axis using d3.svg.axis(), assigning the scale as the xScale
            xAxis
            .scale(xScale)
            .ticks(5, 's');

            // Define y axis using d3.svg.axis(), assigning the scale as the yScale
            yAxis
            .scale(yScale)
            .tickFormat(d3.format('.2s'));
        };

        /* ********************************** Create Axis labels  ********************************** */
        var updateLabels = function() {
            xAxisText.text('Males');
            yAxisText.text('Females');
        };
        
        /* ********************************** Append Static elements ********************************** */
        setScales();
        setAxes();
        // X-Axis label
        var xAxisLabel = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
        .attr('class', 'axis')
        .call(xAxis);

        // Y-Axis label
        var yAxisLabel = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
        .call(yAxis);

        // Text for X-Axis label
        var xAxisText = svg.append('text')
        .attr('transform', 'translate(' + (margin.left + width / 2) + ',' + (height + margin.top + 40) + ')')
        .attr('class', 'title');

        // Text for Y-Axis label
        var yAxisText = svg.append('text')
        .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + height / 2) + ') rotate(-90)')
        .attr('class', 'title');


        /* ********************************** Bind data and Draw visualization  ********************************** */

        var draw = function() {
            setScales();
            setAxes();
            updateLabels();

            // Select all circles and bind data
            var circles = g.selectAll('circle').data(data);

            // New Values
            circles.enter().append('circle')
                .attr('r', 10)
                .attr('fill', function(d) {return stateScale(d.State)})
                .attr('cy', height)
                .style('opacity', .3)
                .attr('cx', function(d) { return xScale(d[xVariable]);})
                .attr('title', function(d) {return d['District']})
            // Updated values
                .merge(circles)
                .transition()
                .duration(1500)
                .delay(function(d){return xScale(d[xVariable]) * 5})
                .attr('cx', function(d) { return xScale(d[xVariable]);})
                .attr('cy', function(d) { return yScale(d[yVariable])});
        };

        // Draw visualization for the first time
        draw();

        // Listen to change events on the input elements
        $("input").on('change', function() {
            // Get the selected value
            measure = $(this).val();

            // Redraw visualization
            draw();
        });
    });
});