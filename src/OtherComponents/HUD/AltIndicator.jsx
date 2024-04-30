import React, { useEffect, useState, useRef } from "react"
import { SmallTickAlt } from "./SmallTickAlt";
import { LargeTickAlt } from "./LargeTickAlt";
import { useCsvDataStore } from "../../Store"

export function AltIndicator(props){
    const AltIndicatorHeight = props.AltIndicatorHeight
    const indicatorSize = 50
    const indicatorYmin = props.CanvasHeight/2 - (indicatorSize+20)/4 
    const indicatorYmax = props.CanvasHeight/2 + (indicatorSize+20)/4
    const textRef = useRef()
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength

    useEffect(()=>{
        if(dataLength !== 0){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let alt = -useCsvDataStore.getState().data[index][props.name + ".pos.z[m]"]*3.28084
                alt = (alt/10).toFixed().toString() + "0" 
                if(alt>=10000){
                    alt = alt.slice(0,2) + "," + alt.slice(2,5)
                }else{
                    alt = alt.slice(0,1) + "," + alt.slice(1,4)
                }
                textRef.current.textContent = alt
    }}},[time])
 
    return(  
        <>
            <image
                    key={"AltIndicatorCenter"}
                    href={'./HUDicons/indicatorAlt.png'}
                    width={indicatorSize*1.2}
                    height={indicatorSize}
                    transform ={"translate(" + (3*props.CanvasWidth/4+10) + " ," + (props.CanvasHeight/2-indicatorSize/2) + ") rotate(180, 25, 25)"}
                    />
            <text
            transform ={"translate(" + (3*props.CanvasWidth/4+15) + " ," + (props.CanvasHeight/2+5) + ")"}
            fill="white"
            ref={textRef}
            >
            999</text>
            <SmallTickAlt AltIndicatorHeight={AltIndicatorHeight} CanvasWidth={props.CanvasWidth} CanvasHeight={props.CanvasHeight} name={props.name}/>
            <LargeTickAlt 
            AltIndicatorHeight={AltIndicatorHeight} CanvasWidth={props.CanvasWidth} CanvasHeight={props.CanvasHeight} name={props.name}
            indicatorYmax={indicatorYmax}
            indicatorYmin={indicatorYmin}/>
        </>
    )
   
}

