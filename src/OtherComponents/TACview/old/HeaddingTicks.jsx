import React, {useEffect, useRef, useState} from "react"
import { useCsvDataStore } from "../../Store"

export default function HeaddingTicks(props){
    const w = props.canvasW
    const h = props.canvasH   
    const CompassTextRadius = props.radius
    const name = props.name
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const refs = useRef([])
    const [ticks, setTicks] = useState([])

    useEffect(()=>{
        let tickList = []
        for(let i=0; i<=360; i=i+30){
            tickList.push(i)
        }
        setTicks(tickList)
    },[])

    useEffect(()=>{
        let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][name + ".isAlive"]=="True"){
                const yaw = useCsvDataStore.getState().data[index][name + ".att.yaw[rad]"]
                ticks.forEach((element, i) => {
                    let rot = yaw*180/Math.PI+90
                    let posX = (w/2+CompassTextRadius*Math.sin(-(360-element)/180*Math.PI)) 
                    let posY = (h/2-CompassTextRadius*Math.cos(-(360-element)/180*Math.PI))
                    refs.current[i].setAttribute('transform', "translate(" + (posX) + " ," + (posY) + ")" + "rotate("+ -rot + ")")
                })
            }
    },[time])
    let rot=0
    
    return(  
        <g className="RangeTexts" transform ={"rotate(0" + "," + w/2 + "," + h/2 + ")"}>
            {ticks &&
            ticks.map((el, i)=>{
                return(
                    <text
                        fill="white"
                        fontSize={"0.5em"}
                        text-anchor="middle"
                        dominantBaseline="central"
                        ref={element => refs.current[i] = element}
                        >
                    {el}</text>
                )
            })}
        </g>
    )
}
