
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

export default function VelocityVector(props){
    const w = props.canvasW
    const h = props.canvasH   
    const imgSize = props.size
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const HudRangeDegree = 20
    const pitchLadderHeight = props.PitchLadderHeight
    const canvasYmin = pitchLadderHeight/2
    const canvasYmax = pitchLadderHeight + canvasYmin
    const ref = useRef()

    useEffect(()=>{
        if(dataLength !== 0 ){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                //console.log(ref.current.getAttribute('transform'))
                
                let AOA = (useCsvDataStore.getState().data[index][props.name + ".AOA[deg]"] )
                let Beta = (useCsvDataStore.getState().data[index][props.name + ".Beta[deg]"] )
                
                let posY =  pitchLadderHeight/HudRangeDegree * (AOA/Math.cos(Beta*Math.PI/180)) 
                let posX =  pitchLadderHeight/HudRangeDegree * (Beta) 

                let moveY = posY+pitchLadderHeight/2+canvasYmin-imgSize/2
                let moveX = posX + w/2- imgSize/2
                
                let visibility = "hidden"
                let move = "translate(" + (moveX) + "," + (moveY) + ")";
                if(moveY>=(canvasYmin/2-imgSize/2) && moveY<=(canvasYmax*1.5-imgSize/2)){
                    visibility = "visible"
                }
                ref.current.setAttribute('transform',move)
                ref.current.setAttribute('visibility',visibility)
                //console.log(move)
            }
        }
    },[time])
    
    return(  
        <image
        key={"VelocityVector"}
        href={'/HUDicons/velocity_marker.png'}
        width={imgSize}
        height={imgSize}
        ref={ref}
        />
    )
}
