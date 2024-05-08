import { Box, IconButton, Typography, useTheme, Slider } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef, useContext } from "react"
import { useCsvDataListStore } from "../../Store"
import { tokens } from "../../theme";
import { ShootingStatsContext } from '../BattleStats';

function valuetext(value) {
    return `${value}°C`;
}

const HistogramRangeSlider = (props) =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [shootStats, setShootStats] = useContext(ShootingStatsContext)
    const [data, setData] = useState([]);
    const svgRef = useRef();
    const svgCanvasID = "svgCanvas" + props.data + props.id
    const [value, setValue] = React.useState([0, 100]);
    const sliderHeight = 4
    let margin = {top: 0, right: 8, bottom: 0, left: 8}

    const handleChange = (event, newValue) => {
        let shootStatsTemp = []
        shootStats.forEach(element => {
            let elementTemp = element
            if((newValue[0]*(props.maxValue-props.minValue)/100+props.minValue <= element[props.data]) && newValue[1]*(props.maxValue-props.minValue)/100+props.minValue >= element[props.data]){
                elementTemp.isFiltered[props.data] = true
            }else{
                elementTemp.isFiltered[props.data] = false
            }
            shootStatsTemp.push(elementTemp)
        });
        setShootStats(shootStatsTemp)
        setValue(newValue);
    };

    useEffect(()=>{
        function cleanup() {
            let shootStatsTemp = []
            shootStats.forEach(element => {
                let elementTemp = element 
                elementTemp.isFiltered[props.data] = true
                shootStatsTemp.push(elementTemp)
            });
            setShootStats(shootStatsTemp)
        }

        return cleanup;
    },[])
  

    useEffect(()=>{
        if(!shootStats || !shootStats.length ){
            return
        }
        let timeDataArr = shootStats.map((el,i)=>{
            return {value: el[props.data]}
        })
        setData(timeDataArr)
    }, [shootStats])

    useEffect(() => {
        if(data.length==0){
            return
        }
        d3.select("#"+svgCanvasID).remove();

        // set the dimensions and margins of the graph
        let width = props.width - margin.left - margin.right,
        height = props.height - margin.top - margin.bottom -sliderHeight;

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
            .domain([props.minValue, props.maxValue])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
      

        // set the parameters for the histogram
        let histogram = d3.histogram()
            .value(function(d) { return d.value; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(40)); // then the numbers of bins

        // And apply this function to data to get the bins
        let bins = histogram(data);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
                  
       // append the bar rectangles to the svg element
        svg
        .selectAll(".bar")
        .data(bins)
        .join("rect")
            .attr("class", "bar")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + (y(d.length)-sliderHeight) + ")" })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", function(d) { 
                if((value[0]*(props.maxValue-props.minValue)/100+props.minValue <= d.x0) && (value[1]*(props.maxValue-props.minValue)/100+props.minValue >= d.x1)){
                    return colors.greenAccent[400]
                }else{
                    return colors.blueAccent[500]
                }
            })

      }, [data, colors, props.height, value]);


    return(
        <Box>
        <Box position="relative" ref={svgRef}>
            <Box position="absolute" bottom={0} right={margin.right} left={margin.left}>  
            <Slider
                getAriaLabel={() => 'Temperature range'}
                value={value}
                onChange={handleChange}
                getAriaValueText={valuetext}
                sx={{
                    height: sliderHeight,
                    padding: 0,
                    '& .MuiSlider-track': {
                      border: 'none',
                      color: "#d3d3d3",
                      opacity: 0.2
                    },
                    '& .MuiSlider-thumb': {
                      height: 8,
                      width: 8,
                      backgroundColor: '#fff',
                      border: '1px solid currentColor',
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: 'inherit',
                      },
                      '&:before': {
                        display: 'none',
                      },
                      '&:after': {
                        display: 'none',
                      },
                    }}}
            />
            </Box>
            
        </Box>
        <Box display="flex" justifyContent="space-between" pl={0.5} pr={0.5}>
            <Typography color={colors.grey[100]}>{(value[0]*(props.maxValue-props.minValue)/100+props.minValue).toFixed(1)}</Typography>
            <Typography color={colors.grey[100]}>{(value[1]*(props.maxValue-props.minValue)/100+props.minValue).toFixed(1)}</Typography>
        </Box>
        </Box>
        
        
    )
}

export default HistogramRangeSlider
