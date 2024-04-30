import { useCsvDataStore } from "../../Store"
import React, { useEffect, useState, useRef } from "react"
import { SmallTick } from "./SmallTick";
import { LargeTick } from "./LargeTick";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

export default function Compass(props){
    const w = props.canvasW
    const h = props.canvasH   
    const compassTop = 40 
    const centerTickSize = 15
    
    return(  
        <>
            <image
            key={"CompassCenter"}
            href={'/HUDicons/triangle.png'}
            width={centerTickSize}
            height={centerTickSize}
            transform ={"translate(" + (w/2-centerTickSize/2) + " ," + (compassTop+15) + ") rotate(180)"}
            />
            <g className="smallTicks">
                <SmallTick name={props.name} compassWidth = {w} SmallTickTop = {compassTop}/>
            </g>
            <g className="largeTicks">
                <LargeTick name={props.name} compassWidth = {w} LargeTickTop = {compassTop}/>
            </g>
        </>
    )
}
