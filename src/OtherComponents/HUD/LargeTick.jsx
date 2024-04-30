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

export function LargeTick(props){
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const [ticks, setTicks] = useState()
    const HudRangeDegree = 30
    const canvasXmin = 0
    const canvasXmax = props.compassWidth
    const imgSize = 10
    const LargeTickPosY = props.LargeTickTop - imgSize
    const tickRefs = useRef([])

    useEffect(() => {
        let tickArr = []
        for(let i=-175; i<181; i=i+5){
            let label = (i+180).toString()
            if(i==180){
                label = "N"
            }else if(i==0){
                label = "S"
            }else if(i==90){
                label = "E"
            }else if(i==-90){
                label = "W"
            }
            tickArr.push({angle: i, pos:"", visible: "hidden", text: label})
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
                    let move = "translate(" + (posX-imgSize/2)  + "," + LargeTickPosY + ")";
                    if(posX>canvasXmin && posX<canvasXmax){
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
            <g transform ={el.pos}
            visibility={el.visible}
            ref={element => tickRefs.current[i] = element}>
            <text text-anchor="middle" fill="white" transform="translate(5, -8)">{el.text}</text>
            <image
            key={"largeTick:" + i.toString()}
            href={'/HUDicons/tick_large.png'}
            width={imgSize}
            height={imgSize}
            />
            </g>
            )
        })} 
        </>
    )
   
}

