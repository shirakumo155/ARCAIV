import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"


export function RollIndicator(props){
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const imgSize = 10
    const tickRef = useRef([])
    const ref = useRef([])
    

    useEffect(()=>{
        if(dataLength !== 0){
            
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let roll = (useCsvDataStore.getState().data[index][props.name + ".att.roll[rad]"] )
                
                if(roll>30*Math.PI/180){
                    roll= 30*Math.PI/180
                }else if (roll<-30*Math.PI/180){
                    roll= -30*Math.PI/180
                }
                let rot = "rotate(" + (roll) + ","  + (props.CanvasWidth/2).toString() +   "," + (props.CanvasHeight/2).toString() + ")"
                ref.current.setAttribute('transform', rot)

                let posX = props.radius * Math.sin(roll) - imgSize/2 + props.CanvasWidth/2
                let posY = props.radius * Math.cos(roll) - imgSize/2 + props.CanvasHeight/2
                let move = "translate(" + posX  + "," + posY + ")";
                tickRef.current.setAttribute('transform', move + " rotate("+ (-roll*180/Math.PI) + "," + imgSize/2 + "," + imgSize/2 + ")")
            }
        }
    },[time])

    return(   
        <>   
        <g ref={ref}>    
            <g 
            ref={tickRef}>
            <image
            key={"RollIndicator"}
            href={'/HUDicons/triangle.png'}
            width={imgSize}
            height={imgSize}
            />
            </g>
        </g>
        </>
    )
   
}

