import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

export function SmallTickSpeed(props){
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
    
    useEffect(() => {
        let tickArr = []
        for(let i=0; i<1200; i=i+10){
            tickArr.push({speed: i, pos:"", visible: "hidden"})
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
                    posY = posY-imgSize/2 + props.CanvasHeight/2
                    
                    let visibility = "hidden"
                    let move = "translate(" + posX  + "," + posY + ")";
                    if(posY>canvasYmin && posY<canvasYmax){
                        visibility = "visible"
                    }
                    tickRefs.current[i].setAttribute('transform',move)
                    tickRefs.current[i].setAttribute('visibility',visibility)

                })
                          
            }
        }
    },[time])

    return(   
        <>       
        {ticks &&
        ticks.map((el, i)=>{
            return(
            <image
            key={"smallTickSpeed:" + i.toString()}
            href={'/HUDicons/tick_small_rot.png'}
            width={imgSize}
            height={imgSize}
            transform ={el.pos}
            visibility={el.visible}
            ref={element => tickRefs.current[i] = element} 
            />
            )})} 
        </>
    )
   
}

