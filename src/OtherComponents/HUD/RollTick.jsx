import React, { useEffect, useState, useRef } from "react"

export function RollTick(props){
    const [ticks, setTicks] = useState()
    const imgSize = 5
    const CanvasWidth = props.CanvasWidth
    const CanvasHeight = props.CanvasHeight
    
    useEffect(() => {
        let ticks = [-30, -20, -10, -5, 0, 5, 10, 20, 30]
        let tickArr = []
        ticks.forEach((el, i)=>{
            let posX = props.radius * Math.sin(el*Math.PI/180) - imgSize/2 + CanvasWidth/2
            let posY = props.radius * Math.cos(el*Math.PI/180) - imgSize/2 + CanvasHeight/2
            let move = "translate(" + posX  + "," + posY + ")";
            let rot = "rotate(" + -el + ","  + 0 +   "," + 0 + ")"
                
            tickArr.push({angle: el, transform: move + rot, visible: "visible"})
        })
        setTicks(tickArr);
    },[props.CanvasWidth, props.CanvasHeight, props.radius])
    
    return(   
        <>       
        {ticks &&
        ticks.map((el, i)=>{
            return(
            <image
            key={"smallTick:" + i.toString()}
            href={'/HUDicons/tick_small.png'}
            width={imgSize}
            height={imgSize}
            transform ={el.transform}
            visibility={el.visible}
            />
            )})} 
        </>
    )
   
}

