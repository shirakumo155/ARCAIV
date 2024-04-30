import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

export function SpeedIndicatorSimple(props){
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
            <text
            transform ={"translate(" + (0) + " ," + (props.CanvasHeight/2) + ")"}
            fill="white"
            text-anchor="start"
            dominantBaseline="central"
            ref={textRef}
            font-size="0.5vw">
                999</text>
        </>
    )
   
}

