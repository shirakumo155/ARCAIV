import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

export function AltIndicatorSimple(props){
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
            
            <text
            transform ={"translate(" + (props.CanvasWidth) + " ," + (props.CanvasHeight/2) + ")"}
            fill="white"
            text-anchor="end"
            dominantBaseline="central"
            ref={textRef}
            font-size="0.5vw"
            >
            999</text>
        </>
    )
   
}

