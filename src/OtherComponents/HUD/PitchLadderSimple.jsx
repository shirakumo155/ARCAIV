import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState, useRef, useContext } from "react"
import { useCsvDataStore } from "../../Store"
import { isOpenContext } from "../videoLayerComponents/TableItem";

function getDeltaDegree(angle, tickAngle){
    if((tickAngle - angle)<-90){
        return (tickAngle - angle) + 360
    }else if((tickAngle - angle)>180){
        return (tickAngle - angle) - 360
    }else{
        return (tickAngle - angle)
    }
}

export function PitchLadderSimple(props){
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const [ticks, setTicks] = useState()
    const HudRangeDegree = 20
    const canvasYmin = props.CanvasHeight*0.1
    const pitchLadderHeight = props.CanvasHeight*0.8
    const canvasYmax = props.CanvasHeight*0.9
    const imgWidth = props.CanvasWidth/3
    const imgHeight = props.CanvasWidth/3*0.1
    const posX = props.CanvasWidth/2 - imgWidth/2
    const tickRefs = useRef([])
    const ref = useRef([])
    const isOpen = useContext(isOpenContext);


    useEffect(() => {
        let tickArr = []
        for(let i=-125; i<126; i=i+5){
            let label = (i).toString()
            let imgRef = './src/images/HUDicons/pitch_positive.png'
            if (i==0){
                imgRef = './src/images/HUDicons/pitch_horizon.png'
            }else if(i<0){
                imgRef = './src/images/HUDicons/pitch_negative.png'
            }
            tickArr.push({angle: i, pos:"", visible: "hidden", text: label, imgRef: imgRef})
        }
        setTicks(tickArr);
    },[])
    
   
    useEffect(()=>{
        if(dataLength !== 0 && ticks){
            
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if((useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True") && isOpen){
                let pitch = (useCsvDataStore.getState().data[index][props.name + ".att.pitch[rad]"] )*180/Math.PI
                let roll = -(useCsvDataStore.getState().data[index][props.name + ".att.roll[rad]"] )*180/Math.PI
                
                if(pitch>90){
                    roll= roll + 180
                    pitch = 180 - pitch
                }else if (pitch<-90){
                    roll= roll - 180
                    pitch = 180 - pitch
                }
                let rot = "rotate(" + roll + ","  + (props.CanvasWidth/2).toString() +   "," + (props.CanvasHeight/2).toString().toString() + ")"
                ref.current.setAttribute('transform', rot)
                
                
                ticks.forEach((element, i) => {
                    let delta = -getDeltaDegree(pitch,element.angle)
                    let posY =  pitchLadderHeight/HudRangeDegree * delta 
                    
                    let moveY = posY+pitchLadderHeight/2+canvasYmin-imgHeight/2
                    
                    let visibility = "hidden"
                    let move = "translate(" + posX  + "," + (moveY) + ")";
                    if(moveY>=(canvasYmin-imgHeight/2) && moveY<=(canvasYmax-imgHeight/2)){
                        visibility = "visible"
                    }
                    
                    tickRefs.current[i].setAttribute('transform',move)
                    tickRefs.current[i].setAttribute('visibility',visibility)
                })

                
                
            }else{
                ticks.forEach((element, i) => {
                    tickRefs.current[i].setAttribute('visibility',"hidden")
                })
            }
        }
    },[time])

    return(   
        <>   
        <g ref={ref}>    
        {ticks && 
        ticks.map((el, i)=>{
            return(
            <g transform ={el.pos}
            visibility={el.visible}
            ref={element => tickRefs.current[i] = element}>
            <text  
                fill="white" 
                
                dominantBaseline="central" 
                transform={"translate(" + (imgWidth*1.05) + ", "+(imgHeight/2)+")"} font-size="0.5em">{el.text}</text>
            <image
            key={"PitchBar:" + i.toString()}
            href={el.imgRef}
            width={imgWidth}
            height={imgHeight}
            />
            </g>
            )
        })} 
        </g>
        </>
    )
   
}

