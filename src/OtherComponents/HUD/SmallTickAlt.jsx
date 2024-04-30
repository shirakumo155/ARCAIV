import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

export function SmallTickAlt(props){
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const [ticks, setTicks] = useState()
    const HudRange = 2500
    const canvasYmin = props.AltIndicatorHeight/2
    const SpeedIndicatorHeight = props.AltIndicatorHeight
    const canvasYmax = SpeedIndicatorHeight + canvasYmin
    const imgSize = 5
    const posX = 3 * props.CanvasWidth/4 - imgSize/2
    const tickRefs = useRef([])
    
    useEffect(() => {
        let tickArr = []
        for(let i=0; i<40000; i=i+100){
            tickArr.push({alt: i, pos:"", visible: "hidden"})
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
            key={"smallTickAlt:" + i.toString()}
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

