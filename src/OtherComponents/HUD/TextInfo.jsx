import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../../Store"

export function TextInfo(props){
    const indicatorSize = 50
    const textRefAOA = useRef()
    const textRefM = useRef()
    const textRefG = useRef()
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength

    useEffect(()=>{
        if(dataLength !== 0){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                let AOA = useCsvDataStore.getState().data[index][props.name + ".AOA[deg]"]
                textRefAOA.current.textContent = "AOA " + AOA
                let M = useCsvDataStore.getState().data[index][props.name + ".Mach"]
                textRefM.current.textContent = "M " + M
                let G = useCsvDataStore.getState().data[index][props.name + ".Gz"]
                textRefG.current.textContent = "G " + G
    }}},[time])
 
    return(  
        <>
            <text
            transform ={"translate(" + (70-indicatorSize/2) + " ," + (props.CanvasHeight-70) + ")"}
            fill="white"
            ref={textRefAOA}>
                AOA</text>
            <text
            transform ={"translate(" + (70-indicatorSize/2) + " ," + (props.CanvasHeight-55) + ")"}
            fill="white"
            ref={textRefM}>
                Mach</text>
            <text
            transform ={"translate(" + (70-indicatorSize/2) + " ," + (props.CanvasHeight-40) + ")"}
            fill="white"
            ref={textRefG}>
                G</text>
        </>
    )
   
}

