import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

export function TextInfoSimple(props){
    const indicatorSize = 50
    const textRefM = useRef()
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength

    useEffect(()=>{
        if(dataLength !== 0){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let M = useCsvDataStore.getState().data[index][props.name + ".Mach"]
                textRefM.current.textContent = "M " + M
              
    }}},[time])
 
    return(  
        <>
            <text
            transform ={"translate(" + (0) + " ," + (props.CanvasHeight/2*0.8) + ")"}
            fill="white"
            text-anchor="start"
            dominantBaseline="central"
            font-size="0.5vw"
            ref={textRefM}
            >
                Mach</text>  
        </>
    )
   
}

