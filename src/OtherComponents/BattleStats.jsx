import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Header from "./global/Header";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataListStore } from "../Store"
import {csvToArr, readUploadedFileAsText} from '../Utils'

const BattleStats = () =>{
    const index = 0
    const fileArr = useCsvDataListStore(state => state.fileArr);
    const [data, setData] = useState()
    const svgRef = useRef()
    const xMax = 25 
    const yMax = 25
    const xMin = -25 
    const yMin = -25
    const w = 400
    const h = 400
    const imgSize = 30
    let allImgShapes
    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, w])
    const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([h, 0])

    useEffect(()=>{
        if(fileArr.length !==0){
            const loadData = async () => {
                const fileContents = await readUploadedFileAsText(fileArr[index]) 
                const initialData = csvToArr(fileContents, ",")[0]
                const plotData = [
                    [initialData["Blue/Blue1.pos.x[m]"]/1000, initialData["Blue/Blue1.pos.y[m]"]/1000, +initialData["Blue/Blue1.att.yaw[rad]"]*180/Math.PI],
                    [initialData["Blue/Blue2.pos.x[m]"]/1000, initialData["Blue/Blue2.pos.y[m]"]/1000, +initialData["Blue/Blue2.att.yaw[rad]"]*180/Math.PI],
                    [initialData["Red/Red1.pos.x[m]"]/1000, initialData["Red/Red1.pos.y[m]"]/1000, +initialData["Red/Red1.att.yaw[rad]"]*180/Math.PI],
                    [initialData["Red/Red2.pos.x[m]"]/1000, initialData["Red/Red2.pos.y[m]"]/1000, +initialData["Red/Red2.att.yaw[rad]"]*180/Math.PI]]
                setData(plotData) 
            }
            loadData() 
        }
    }, [fileArr])


    if(data){
        allImgShapes = data.map((d, i) => {
            let yaw = d[2] - 180
            let xpos = xScale(d[0])-imgSize/2
            let ypos = yScale(d[1])-imgSize/2
            let move = "translate(" + ypos  + "," + xpos + ") rotate(" + yaw + ", " + imgSize/2 + ", " + imgSize/2 + ")";
            let imagePath = ""
            if(i<2){
                imagePath = "/img/IconDroneBlue.png"
            }else{
                imagePath = "/img/IconDroneRed.png"
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
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title='BATTLE STATS' subtitle="Under Construction" />
            </Box>
            {/*
            <Box>
                <svg 
                position="relative"
                ref={svgRef}
                width={w} 
                height={h}
                style={{ 
                background: `url(${'/texture/GroundTexture.png'})`, 
                backgroundSize: "100%", 
                backgroundPosition: "center"}}>
                    {data &&
                    allImgShapes}
                </svg>
            </Box>
                    */}
        </Box>
    )
}

export default BattleStats