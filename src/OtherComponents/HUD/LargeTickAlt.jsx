import { Box, IconButton, Typography, useTheme } from "@mui/material";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"
import { Speed } from "@mui/icons-material";

export function LargeTickAlt(props){
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const [ticks, setTicks] = useState()
    const HudRange = 2500
    const canvasYmin = props.AltIndicatorHeight/2
    const SpeedIndicatorHeight = props.AltIndicatorHeight
    const canvasYmax = SpeedIndicatorHeight + canvasYmin
    const imgSize = 5
    const posX = 3*props.CanvasWidth/4 - imgSize/2
    const tickRefs = useRef([])
    const textRefs = useRef([])
    const indicatorYmax = props.indicatorYmax
    const indicatorYmin = props.indicatorYmin
    
    useEffect(() => {
        let tickArr = []
        for(let i=0; i<40000; i=i+500){
            let label = (i/100).toString()
            if(i>=10000){
                label = label.slice(0,2) + "," + label.slice(2)
            }else{
                label = "0" + label.slice(0,1) + "," + label.slice(1)
            }
            
            tickArr.push({alt: i, pos:"", visible: "hidden", text: label})
        }
        setTicks(tickArr);
    },[])
    
    useEffect(()=>{
        if(dataLength !== 0 && ticks){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let alt = -useCsvDataStore.getState().data[index][props.name + ".pos.z[m]"]*3.28084
              
                ticks.forEach((element, i) => {
                    let delta = alt - element.alt
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
                <text text-anchor="middle" fill="white" transform="translate(25, 8)" ref={element => textRefs.current[i] = element}>{el.text}</text>
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

