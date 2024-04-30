import HeaddingTicks from "./HeaddingTicks";
import React, {useEffect, useRef, useState} from "react"
import { useCsvDataStore } from "../../Store"

export default function TACBackground(props){
    const w = props.canvasW
    const h = props.canvasH   
    const imgSize = props.size
    const CompassTextRadius = imgSize/2*(2/3)
    const name = props.name
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const ref = useRef()
    useEffect(()=>{
        let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][name + ".isAlive"]=="True"){
                const yaw = useCsvDataStore.getState().data[index][name + ".att.yaw[rad]"]
                ref.current.setAttribute('transform', "rotate("+ (yaw*180/Math.PI+90) + "," + w/2 + "," + h/2 + ")")
            }
    },[time])
    
    return(  
        <g className="TACViewBackground" ref={ref} >
        <image
        key={"TACBackground"}
        href={'/HUDicons/RadarMap.png'}
        width={imgSize}
        height={imgSize}
        transform ={"translate(" + (w/2-imgSize/2) + " ," + (h/2-imgSize/2) + ")"}
        />
        <HeaddingTicks canvasW={w} canvasH={h} radius={CompassTextRadius} name={name}/>
        
        </g>
    )
}
