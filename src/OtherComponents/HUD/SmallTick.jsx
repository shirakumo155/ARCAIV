import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

function getDeltaDegree(yaw, tickAngle){
    if((tickAngle - yaw)<-179){
        return (tickAngle - yaw) + 360
    }else if((tickAngle - yaw)>180){
        return (tickAngle - yaw) - 360
    }else{
        return (tickAngle - yaw)
    }
}

export function SmallTick(props){
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const [ticks, setTicks] = useState()
    const HudRangeDegree = 30
    const canvasXmin = 0
    const canvasXmax = props.compassWidth
    const imgSize = 5
    const SmallTickPosY = props.SmallTickTop - imgSize
    const tickRefs = useRef([])
    
    useEffect(() => {
        let tickArr = []
        for(let i=-179; i<181; i++){
            tickArr.push({angle: i, pos:"", visible: "hidden"})
        }
        setTicks(tickArr);
    },[])
    
    useEffect(()=>{
        if(dataLength !== 0 && ticks){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let yaw = (useCsvDataStore.getState().data[index][props.name + ".att.yaw[rad]"] - Math.PI/2)*180/Math.PI
                ticks.forEach((element, i) => {
                    let delta = getDeltaDegree(yaw,element.angle)
                    let posX =  (canvasXmax - canvasXmin)/HudRangeDegree * delta
                    //let posX = 0
                    
                    let visibility = "hidden"
                    let move = "translate(" + (posX-imgSize/2)  + "," + SmallTickPosY + ")";
                    if(posX>canvasXmin && posX<canvasXmax){
                        visibility = "visible"
                    }
                    //tickArr.push({angle: i - 179, pos: move, visible: visibility})
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
            key={"smallTick:" + i.toString()}
            href={'/HUDicons/tick_small.png'}
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

