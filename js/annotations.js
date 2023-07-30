// Annotations for Bubble Chart
const bubble_state_annotations = [         
{
    type: d3.annotationLabel,
    note: {
    title: "Majority of Reviews",
    label: "LA contains the majority of the reviews",
    wrap: 190
    },
    x: 200,
    y: 300,
    dy: 280,
    dx: -90
}]

const bubble_state_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(bubble_state_annotations)

const bubble_star_annotations = [
{
    type: d3.annotationLabel,
    note: {
    title: "Average 4-4.5 Stars",
    label: "Regardless of state, the average for star ratings is beyond 4 stars",
    wrap: 190
    },
    x: 590,
    y: 200,
    dy: 200,
    dx: -200
}]

const bubble_star_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(bubble_star_annotations)

// Annotations for Zoomable Sunburst
const zoom_annotations = [       
{
    type: d3.annotationLabel,
    note: {
    title: "Mexican is popular in CA",
    label: "CA leads on Mexican cuisines. No wonder is has some of the finest restaurants.",
    wrap: 190
    },
    x: 250,
    y: 530,
    dy: -400,
    dx: -100
},
{
    type: d3.annotationLabel,
    note: {
    title: "Top Most Reviewed",
    label: "American is the most reviewed restaurant category aggregated across all reviews. LA, FL & CA has the most restaurants on this.",
    wrap: 190
    },
    x: 650,
    y: 200,
    dy: -100,
    dx: 200
},
{
    type: d3.annotationLabel,
    note: {
    title: "2nd most reviewed",
    label: "Seafood is 2nd most popular cuisine. LA contributes 70% of the reviews",
    wrap: 190
    },
    x: 400,
    y: 600,
    dy: 50,
    dx: 450
}]

const zoom_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(zoom_annotations)

d3.select("#zoomable_svg")
    .append("g")
    .attr("class", "annotation-group")
    .attr("id", "zoom_annotation")
    .call(zoom_makeAnnotations)

// Annotations for Line Chart
const line_annotations = [
{
    type: d3.annotationLabel,
    note: {
    title: "Weeknight Checkin Spike",
    label: "Spikes nightly for checkins",
    wrap: 190
    },
    x: 250,
    y: 125,
    dy: 0,
    dx: 0
},          
{
    type: d3.annotationLabel,
    note: {
    title: "Weekend Checkin Spike",
    label: "Increased spike of checkins over the weekend",
    wrap: 190
    },
    x: 650,
    y: 200,
    dy: -100,
    dx: -150
}]

const line_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(line_annotations)

d3.select("#linechart_svg")
    .append("g")
    .attr("class", "annotation-group")
    .attr("id", "linechart_annotation")
    .call(line_makeAnnotations)
