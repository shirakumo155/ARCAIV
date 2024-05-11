import { Box, IconButton, Typography, useTheme, Slider } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef, useContext } from "react"
import { useBattleStatsStore} from "../../Store"
import { tokens } from "../../theme";
import { throttle } from 'throttle-debounce';


function valuetext(value) {
    return `${value}°C`;
}

function updateBattleStatsState(newValue, type, maxValue, minValue, data){
    const shootStatsArr = type=="shoot" ? useBattleStatsStore.getState().shootStatsArr : useBattleStatsStore.getState().vulStatsArr
    let shootStatsTemp = []
    shootStatsArr.forEach(element => {
        let elementTemp = element
        if((newValue[0]*(maxValue-minValue)/100+minValue <= element[data]) && newValue[1]*(maxValue-minValue)/100+minValue >= element[data]){
            elementTemp.isFiltered[data] = true
        }else{
            elementTemp.isFiltered[data] = false
        }
        shootStatsTemp.push(elementTemp)
    });
    type=="shoot" ? useBattleStatsStore.setState({shootStatsArr: shootStatsTemp}) : useBattleStatsStore.setState({vulStatsArr: shootStatsTemp})
}

const throttleFunc = throttle(100, (newValue, type, maxValue, minValue, data) => {
    updateBattleStatsState(newValue, type, maxValue, minValue, data)
});

const HistogramRangeSlider = (props) =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const svgRef = useRef();
    const svgCanvasID = "svgCanvas" + props.data + props.type + props.id 
    const [value, setValue] = React.useState([0, 100]);
    const sliderHeight = 4
    let margin = {top: 0, right: 8, bottom: 0, left: 8}
    const binSize = (props.type=="alt" || props.type=="altTGT" || props.type=="range") ? 20 : 25

    const handleChange = (event, newValue) => {
        setValue(newValue);
       
        throttleFunc(newValue, props.type, props.maxValue, props.minValue, props.data)
    };

    useEffect(()=>{
        const shootStatsArr = props.type=="shoot" ? useBattleStatsStore.getState().shootStatsArr : useBattleStatsStore.getState().vulStatsArr
        if(!shootStatsArr || !shootStatsArr.length ){
            return
        }
        let timeDataArr = shootStatsArr.map((el,i)=>{
            return {value: el[props.data]}
        })
        setData(timeDataArr)
        updateBattleStatsState(value, props.type, props.maxValue, props.minValue, props.data)
    }, [])

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
            .thresholds(x.ticks(binSize)); // then the numbers of bins

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
            .attr("width", function(d) { let w = x(d.x1) - x(d.x0) - 1 
                if(w<0){ return 0}else{ return w} ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", function(d) { 
                if((value[0]*(props.maxValue-props.minValue)/100+props.minValue <= d.x0) && (value[1]*(props.maxValue-props.minValue)/100+props.minValue >= d.x1)){
                    return colors.greenAccent[400]
                }else{
                    return colors.blueAccent[500]
                }
            })

      }, [colors, value]);


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
