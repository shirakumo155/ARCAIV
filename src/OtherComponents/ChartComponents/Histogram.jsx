import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataListStore } from "../../Store"
import { tokens } from "../../theme";

const Histogram = (props) =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fileArr = useCsvDataListStore(state => state.fileArr);
    const [data, setData] = useState([]);
    const svgRef = useRef();
    const svgCanvasID = "svgCanvas" + props.id
  

    useEffect(()=>{
        let timeDataArr = fileArr.map((el,i)=>{
            return {value: el.stats.missionTimeSec}
        })
        setData(timeDataArr)
    }, [])

    useEffect(() => {
        if(data.length==0){
            return
        }
        d3.select("#"+svgCanvasID).remove();

        // set the dimensions and margins of the graph
        let margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = props.width - margin.left - margin.right,
        height = props.height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("id",svgCanvasID)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis: scale and draw:
        let x = d3.scaleLinear()
            .domain([0, 350])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // set the parameters for the histogram
        let histogram = d3.histogram()
            .value(function(d) { return d.value; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(80)); // then the numbers of bins

        // And apply this function to data to get the bins
        let bins = histogram(data);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        svg.append("g")
            .call(d3.axisLeft(y))

                     
       // append the bar rectangles to the svg element
        svg
        .selectAll(".bar")
        .data(bins)
        .join("rect")
            .attr("class", "bar")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")" })
            .attr("width", function(d) { let w = x(d.x1) - x(d.x0) - 1 
                if(w<0){ return 0}else{ return w} ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", colors.greenAccent[400])

        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("Misson Time")
        .style("fill", colors.grey[100])

        // Y axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("count")
        .style("fill", colors.grey[100])
    
      }, [data, colors, props.height]);


    return(
        <Box ref={svgRef}>

        </Box>
    )
}

export default Histogram
