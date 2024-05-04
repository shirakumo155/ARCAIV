import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"

const Thumbnail = (props) =>{
    //const index = props.index
    //const fileArr = useCsvDataListStore(state => state.fileArr);
    const [data, setData] = useState()
    const scale = 1.5
    const xMax = 25
    const yMax = 25 
    const xMin = -25
    const yMin = -25 
    const w = props.w
    const h = props.h
    const imgSize = props.imgSize
    let allImgShapes
    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, w])
    const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([h, 0])
    const [droneBluePath, setDroneBluePath] = useState(import.meta.env.BASE_URL + "img/IconDroneBlue.png")
    const [droneRedPath, setDroneRedPath] = useState(import.meta.env.BASE_URL + "img/IconDroneRed.png")
    const backgroundPath = import.meta.env.BASE_URL + "texture/GroundTextureMod.png"
    const theme = useTheme();
    
    useEffect(()=>{
        const plotData = [
            [props.pos.Blue1.initPos[0], -props.pos.Blue1.initPos[1]-(scale-1)*w/4, props.pos.Blue1.initPos[2]],
            [props.pos.Blue2.initPos[0], -props.pos.Blue2.initPos[1]-(scale-1)*w/4, props.pos.Blue2.initPos[2]], 
            [props.pos.Red1.initPos[0], -props.pos.Red1.initPos[1]-(scale-1)*w/4, props.pos.Red1.initPos[2]], 
            [props.pos.Red2.initPos[0], -props.pos.Red2.initPos[1]-(scale-1)*w/4, props.pos.Red2.initPos[2]]]
        //console.log(plotData)
        setData(plotData)
    },[])

    useEffect(()=>{
        if(theme.palette.mode=="dark"){
            setDroneBluePath(import.meta.env.BASE_URL + "img/IconDroneBlue.png")
            setDroneRedPath(import.meta.env.BASE_URL + "img/IconDroneRed.png")
        }else{
            setDroneBluePath(import.meta.env.BASE_URL + "img/IconDroneBlueLight.png")
            setDroneRedPath(import.meta.env.BASE_URL + "img/IconDroneRedLight.png")
        }
    },[theme])

    if(data){
        allImgShapes = data.map((d, i) => {
            let yaw = d[2] 
            let xpos = xScale(d[0])-imgSize/2
            let ypos = yScale(d[1])-imgSize/2
            let move = "translate(" + ypos  + "," + xpos + ") rotate(" + yaw + ", " + imgSize/2 + ", " + imgSize/2 + ")";
            let imagePath = ""
            if(i<2){
                imagePath = droneBluePath
            }else{
                imagePath = droneRedPath
            }
            return (
            <image
                key={i}
                href={imagePath}
                width={imgSize}
                height={imgSize}
                transform ={move}
            />
            );
        });
    }
    
    return(  
        <Box>
                <svg 
                position="relative"
                width={w*scale} 
                height={h}
                style={{ 
                background: `url(${backgroundPath})`, 
                backgroundSize: "100%", 
                backgroundPosition: "center"}}>
                    {data &&
                    allImgShapes
                    }
                </svg>
        </Box>
    )
}

export default Thumbnail