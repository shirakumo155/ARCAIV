import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"
import { Speed } from "@mui/icons-material";

export function LargeTickSpeed(props){
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const [ticks, setTicks] = useState()
    const HudRange = 120
    const canvasYmin = props.SpeedIndicatorHeight/2
    const SpeedIndicatorHeight = props.SpeedIndicatorHeight
    const canvasYmax = SpeedIndicatorHeight + canvasYmin
    const imgSize = 5
    const posX = props.CanvasWidth/4 - imgSize/2
    const tickRefs = useRef([])
    const textRefs = useRef([])
    const indicatorYmax = props.indicatorYmax
    const indicatorYmin = props.indicatorYmin
    
    useEffect(() => {
        let tickArr = []
        for(let i=0; i<1200; i=i+50){
            let label = (i/10).toString()
            tickArr.push({speed: i, pos:"", visible: "hidden", text: label})
        }
        setTicks(tickArr);
    },[])
    
    useEffect(()=>{
        if(dataLength !== 0 && ticks){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let vt = useCsvDataStore.getState().data[index][props.name + ".vt[m/s]"] * 1.944
              
                ticks.forEach((element, i) => {
                    let delta = vt - element.speed
                    let posY =  (canvasYmax - canvasYmin)/HudRange * delta
                    posY = posY - imgSize/2 + props.CanvasHeight/2
                    
                    let visibility = "hidden"
                    let move = "translate(" + posX  + "," + posY + ")";
                    if(posY>canvasYmin && posY<canvasYmax){
                        visibility = "visible"
                    }
                    tickRefs.current[i].setAttribute('transform',move)
                    tickRefs.current[i].setAttribute('visibility',visibility)
                    let visibilityText = "hidden"
                    if(posY>canvasYmin && posY<canvasYmax){
                        visibilityText = "visible"
                    }
                    if(posY>indicatorYmin && posY<indicatorYmax){
                        visibilityText = "hidden"
                    }
                    textRefs.current[i].setAttribute('visibility',visibilityText)

                })
                          
            }
        }
    },[time])

    return(   
        <>       
        {ticks &&
        ticks.map((el, i)=>{
            return(
                <g transform ={el.pos}
                visibility={el.visible}
                ref={element => tickRefs.current[i] = element}>
                <text text-anchor="middle" fill="white" transform="translate(-15, 8)" ref={element => textRefs.current[i] = element}>{el.text}</text>
                <image
                key={"largeTick:" + i.toString()}
                href={'/HUDicons/tick_large_rot.png'}
                width={imgSize}
                height={imgSize}
                />
                </g>)
                })}
        </>
        )
    }

