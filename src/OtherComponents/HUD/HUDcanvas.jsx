import { Box } from "@mui/material";
import React from "react"
import Compass from "./Compass";
import Boresight from "./Boresight";
import { PitchLadder } from "./PitchLadder";
import { RollTick } from "./RollTick";
import { SpeedIndicator } from "./SpeedIndicator";
import { RollIndicator } from "./RollIndcator";
import { AltIndicator } from "./AltIndicator";
import VelocityVector  from "./VelocityVector";
import { TextInfo } from "./TextInfo";

const HUDcanvas = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.name
    
    return(  
        <Box>
                <svg 
                position="relative"
                width={w} 
                height={h}
                style={{ 
                backgroundSize: "100%", 
                backgroundPosition: "center",
                }}> 
                <Compass name={name} canvasW={w} canvasH={h} />
                <Boresight canvasW={w} canvasH={h} size={30}/>
                <VelocityVector canvasW={w} canvasH={h} size={30} PitchLadderHeight={h/2} name={name}/>
                <TextInfo CanvasWidth={w} CanvasHeight={h} name={name}/>
                <g className="PitchLadder">
                    <PitchLadder PitchLadderHeight={h/2} CanvasWidth={w} CanvasHeight={h} name={name}/>
                </g>
                <g className="RollTicks">
                    <RollIndicator CanvasWidth={w} CanvasHeight={h} name={name} radius={h/3-8}/>
                    <RollTick CanvasWidth={w} CanvasHeight={h} name={name} radius={h/3}/>
                </g>
                <g className="SpeedIndicator">  
                    <SpeedIndicator SpeedIndicatorHeight={h/2} CanvasWidth={w} CanvasHeight={h} name={name}/> 
                </g> 
                <g className="AltIndicator">
                    <AltIndicator AltIndicatorHeight={h/2} CanvasWidth={w} CanvasHeight={h} name={name}/> 
                </g>
                </svg>
        </Box>
    )
}

export default HUDcanvas