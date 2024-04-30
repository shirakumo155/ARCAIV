import React, { useEffect, useState, useRef } from "react"
import { SmallTickSpeed } from "./SmallTickSpeed";
import { LargeTickSpeed } from "./LargeTickSpeed";
import { useCsvDataStore } from "../../Store"

export function SpeedIndicator(props){
    const SpeedIndicatorHeight = props.SpeedIndicatorHeight
    const indicatorSize = 50
    const indicatorYmin = props.CanvasHeight/2 - indicatorSize/4 
    const indicatorYmax = props.CanvasHeight/2 + indicatorSize/4
    const textRef = useRef()
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength

    useEffect(()=>{
        if(dataLength !== 0){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let vt = useCsvDataStore.getState().data[index][props.name + ".vt[m/s]"] * 1.944
                textRef.current.textContent = vt.toFixed()
    }}},[time])
 
    return(  
        <>
            <image
                    key={"SpeedIndicatorCenter"}
                    href={'/HUDicons/indicator.png'}
                    width={indicatorSize}
                    height={indicatorSize}
                    transform ={"translate(" + (props.CanvasWidth/4-indicatorSize) + " ," + (props.CanvasHeight/2-indicatorSize/2) + ")"}
                    />
            <text
            transform ={"translate(" + (props.CanvasWidth/4-indicatorSize+5) + " ," + (props.CanvasHeight/2+5) + ")"}
            fill="white"
            ref={textRef}>
                999</text>
            <SmallTickSpeed SpeedIndicatorHeight={SpeedIndicatorHeight} CanvasWidth={props.CanvasWidth} CanvasHeight={props.CanvasHeight} name={props.name}/>
            <LargeTickSpeed 
                SpeedIndicatorHeight={SpeedIndicatorHeight} 
                CanvasWidth={props.CanvasWidth} 
                CanvasHeight={props.CanvasHeight} 
                name={props.name}
                indicatorYmax={indicatorYmax}
                indicatorYmin={indicatorYmin}/>
        </>
    )
   
}

