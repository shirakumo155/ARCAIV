import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataListStore, useBattleStatsStore } from "../../Store"
import {csvToArr, readUploadedFileAsText} from '../../Utils'

const Trajectory = (props) =>{
    const [data, setData] = useState()
    const [path, setPath] = useState()
    const xMax = 25
    const yMax = 25 
    const xMin = -25
    const yMin = -25 
    const w = props.w
    const h = props.h
    const imgSize = props.imgSize
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
    const fileArr = useCsvDataListStore(state => state.fileArr)
    //const ref = props.ContextType=="shoot" ? useRef(useBattleStatsStore.getState().shootStatsArr) : useRef(useBattleStatsStore.getState().vulStatsArr)
    const shootStatsArr = props.ContextType=="shoot" ? useBattleStatsStore(state => state.shootStatsArr) :useBattleStatsStore(state => state.vulStatsArr)
    const updateShootStatsArr = props.ContextType=="shoot" ? useBattleStatsStore((state)=>(state.setShootStatsArr)) : useBattleStatsStore(state => state.setVulStatsArr)
    const svgRef = useRef()

    const dimensions = {
        width: w,
        height: h,
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      };
    
    useEffect(()=>{
        if(shootStatsArr.length==0){
            return
        }
        let selectedFileName = ""
        let fireIndex = -1
        let fireEndIndex = -1
        shootStatsArr.forEach(element => {
            if(element.isHovered){ 
                selectedFileName = element.fileName
                fireIndex = element.fireIndex
                fireEndIndex = element.fireEndIndex
            }
        });
        // set index load csv
        fileArr.forEach((el)=>{
            if(el.name==selectedFileName){

                async function loadTrajectory(file){
                    const fileContents = await readUploadedFileAsText(file) 
                    const csvData = csvToArr(fileContents, ",")
                    //console.log(csvData[fireIndex])
                    const teams = ["Blue", "Red"]
                    const assetNum = ["1", "2"]
                    let plotData = []
                    teams.forEach((team)=>{
                        assetNum.forEach((num)=>{
                            let name = team + "/" + team + num
                            let trajectoryLength = 0
                            for(let i=fireIndex; i<=fireEndIndex; i=i+1){
                                if(i==fireIndex || i==fireEndIndex || trajectoryLength>=7){
                                    if(csvData[i][name + ".isAlive"]=="True"){
                                        const x = csvData[i][name + ".pos.x[m]"]/1000
                                        const y = csvData[i][name + ".pos.y[m]"]/1000
                                        const yaw = csvData[i][name + ".att.yaw[rad]"]*180/Math.PI
                                        plotData.push({team: team, pos:[x,y,yaw], type: "drone", name: (team + num)})
                                        trajectoryLength = 0
                                    }
                                }else{
                                    const x = csvData[i][name + ".pos.x[m]"]/1000
                                    const y = csvData[i][name + ".pos.y[m]"]/1000
                                    const x_next = csvData[i+1][name + ".pos.x[m]"]/1000
                                    const y_next = csvData[i+1][name + ".pos.y[m]"]/1000
                                    trajectoryLength = trajectoryLength + Math.pow((x_next-x)*(x_next-x)+(y_next-y)*(y_next-y),0.5)
                                }
                            }
                            
                        })
                    })
                    setData(plotData)

                    let pathData = Object.entries(Object.groupBy(plotData, ({ name }) => name))
                    pathData = pathData.map((elp,pi)=>{
                        let posArr = []
                        elp[1].forEach((child,ci)=>{
                            posArr.push({x: child.pos[0], y: child.pos[1]})
                        })
                        
                        return {pos: posArr, name: elp[1][0].name, type: elp[1][0].type, team: elp[1][0].team}
                    })
         
                    setPath(pathData)
                }
                loadTrajectory(el)
            }
        })
          
    },[shootStatsArr])

    useEffect(()=>{
        if(theme.palette.mode=="dark"){
            setDroneBluePath(import.meta.env.BASE_URL + "img/IconDroneBlue.png")
            setDroneRedPath(import.meta.env.BASE_URL + "img/IconDroneRed.png")
        }else{
            setDroneBluePath(import.meta.env.BASE_URL + "img/IconDroneBlueLight.png")
            setDroneRedPath(import.meta.env.BASE_URL + "img/IconDroneRedLight.png")
        }
    },[theme])

    useEffect(()=>{
        if(data){
            const svg = d3.select(svgRef.current)
            svg.selectAll("*").remove();

            // Draw the lines
            const line = d3.line()
            .x((d) => xScale(d.y))
            .y((d) => yScale(d.x))
            .curve(d3.curveCatmullRom.alpha(0.5))

            svg
            .selectAll(".dronePath")
            .data(path)
            .join("path")
                .attr("class", "dronePath")
                .attr("fill", "none")
                .attr("stroke", (d) => d.team=="Blue" ? "#3399FF": "#FF007F")
                .attr("stroke-width", 1)
                .attr("d", (d) => {
                    return line(d.pos)})

            svg.selectAll(".drones")
            .data(data)
            .join("svg:image")
                .attr("class", "drones")
                .attr('width', imgSize)
                .attr('height', imgSize)
                .attr("transform", function(d) { 
                    return "translate(" + (xScale(d.pos[1])-imgSize/2) + "," + (yScale(d.pos[0])-imgSize/2) + ")" + "rotate(" + d.pos[2]+ ", " + (imgSize/2) + ", " + (imgSize/2) + ")"})
                .attr("xlink:href", function(d) {
                    if(d.team=="Blue" && d.type=="drone"){return droneBluePath}else if(d.team=="Red" && d.type=="drone"){return droneRedPath}
                })


            
            }
    },[data, path, droneBluePath, droneRedPath])   
    
    return(  
        <Box>
                <svg 
                position="relative"
                width={w} 
                height={h}
                ref={svgRef}
                >   
                
                </svg>
        </Box>
    )
}

export default Trajectory