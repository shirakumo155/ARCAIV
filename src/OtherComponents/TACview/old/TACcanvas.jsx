import { Box } from "@mui/material";
import TACBackground from "./TACBackGround";
import React, {useEffect, useRef, useState, useContext} from "react"
import { useCsvDataStore } from "../../Store"
import { isOpenContext } from "../videoLayerComponents/TableItem";

const TACcanvas = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.team + "/" + props.name
    const backgroundColor = props.bkColor
    const radius = w*0.8/2
    const originImgSize = 15
    const markerImgSize = 15
    const mrmImgSize = 8
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const [drones, setDrones] = useState([])
    const [missiles, setMissiles] = useState([])
    const markerRefs = useRef([])
    const missileRefs = useRef([])
    const missileTgtLineRefs = useRef([])
    const MarkersGroupRef = useRef()
    const isOpen = useContext(isOpenContext);

    useEffect(()=>{
        const droneNameList = ["Blue/Blue1", "Blue/Blue2", "Red/Red1", "Red/Red2"]
        let droneList = []
        for(let i=0; i<droneNameList.length; i++){
            if(name !== droneNameList[i]){
                if(props.team=="Blue"){
                    if(i<2){
                        droneList.push({name: droneNameList[i], src:"/HUDicons/friend.png"})
                    }else{
                        droneList.push({name: droneNameList[i], src:"/HUDicons/target.png"})
                    }
                }else{
                    if(i>=2){
                        droneList.push({name: droneNameList[i], src:"/HUDicons/friend.png"})
                    }else{
                        droneList.push({name: droneNameList[i], src:"/HUDicons/target.png"})
                    }
                }
            }
        }
        setDrones(droneList)

        let missileList = []
        const MRMnumsTotal = 8
        for(let i=0; i<MRMnumsTotal; i++){
            if(props.team=="Blue"){
                if(i<4){
                    missileList.push({name: name+":Missile"+(i+1), src:"/HUDicons/MRMown.png"})
                }else{
                    props.name=="Blue1" ?
                    missileList.push({name: "Blue/Blue2:Missile"+(i+1-4), src:"/HUDicons/MRMfriend.png"}):
                    missileList.push({name: "Blue/Blue1:Missile"+(i+1-4), src:"/HUDicons/MRMfriend.png"})
                    
                }
            }else{
                if(i<4){
                    missileList.push({name: name+":Missile"+(i+1), src:"/HUDicons/MRMown.png"})
                }else{
                    props.name=="Red1" ?
                    missileList.push({name: "Red/Red2:Missile"+(i+1-4), src:"/HUDicons/MRMfriend.png"}):
                    missileList.push({name: "Red/Red1:Missile"+(i+1-4), src:"/HUDicons/MRMfriend.png"})
                }
            }
        }
        setMissiles(missileList)
    },[])

    useEffect(()=>{
        if(dataLength !== 0 ){
            
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if((useCsvDataStore.getState().data[index][name + ".isAlive"]=="True") && isOpen){
                drones.forEach((element, i) => {
                    let dx = useCsvDataStore.getState().data[index][element.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][name + ".pos.x[m]"]
                    let dy = useCsvDataStore.getState().data[index][element.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][name + ".pos.y[m]"]
                    let dr = Math.pow(dx*dx+dy*dy,0.5)/1000
                    let theta = Math.atan2(dx,dy)
                    let yaw = useCsvDataStore.getState().data[index][element.name + ".att.yaw[rad]"]
                    let PosX = w/2 - markerImgSize/2 + dr * Math.cos(theta) * 0.539957 * radius/20 
                    let PosY = h/2 - markerImgSize/2 + dr * Math.sin(theta) * 0.539957 * radius/20
                    let move = "translate(" + (PosX)  + "," + PosY + ")" + " rotate(" + (-yaw*180/Math.PI+180) + "," + (markerImgSize/2) + "," + (markerImgSize/2) +")"
                    let visibility
                    if(useCsvDataStore.getState().data[index][element.name + ".isAlive"]=="True"){
                        visibility = "visible"
                    }else{
                        visibility = "hidden"
                    }
                    
                    markerRefs.current[i].setAttribute('transform',move)
                    markerRefs.current[i].setAttribute('visibility',visibility)
                })

                let yaw = useCsvDataStore.getState().data[index][name + ".att.yaw[rad]"]
                MarkersGroupRef.current.setAttribute('transform', "rotate(" + (yaw*180/Math.PI+180) + "," + (w/2) + "," + (h/2) +")")
            
                missiles.forEach((element, i) => {
                    let dx = useCsvDataStore.getState().data[index][element.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][name + ".pos.x[m]"]
                    let dy = useCsvDataStore.getState().data[index][element.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][name + ".pos.y[m]"]
                    let dr = Math.pow(dx*dx+dy*dy,0.5)/1000
                    let theta = Math.atan2(dx,dy)
                    let yaw = useCsvDataStore.getState().data[index][element.name + ".att.yaw[rad]"]
                    let PosX = w/2 - mrmImgSize/2 + dr * Math.cos(theta) * 0.539957 * radius/20 
                    let PosY = h/2 - mrmImgSize/2 + dr * Math.sin(theta) * 0.539957 * radius/20
                    let move = "translate(" + (PosX)  + "," + PosY + ")" + " rotate(" + (-yaw*180/Math.PI+180) + "," + (mrmImgSize/2) + "," + (mrmImgSize/2) +")"
                    let visibility
                    if(useCsvDataStore.getState().data[index][element.name + ".isFlying"]=="True"){
                        visibility = "visible"
                    }else{
                        visibility = "hidden"
                    }
                    
                    missileRefs.current[i].setAttribute('transform',move)
                    missileRefs.current[i].setAttribute('visibility',visibility)

                    let tgtName = useCsvDataStore.getState().data[index][element.name + ".target.truth"]
                    if(useCsvDataStore.getState().data[index][element.name + ".isFlying"]=="True"){
                        let dxTgt = useCsvDataStore.getState().data[index][tgtName + ".pos.x[m]"] - useCsvDataStore.getState().data[index][name + ".pos.x[m]"]
                        let dyTgt = useCsvDataStore.getState().data[index][tgtName + ".pos.y[m]"] - useCsvDataStore.getState().data[index][name + ".pos.y[m]"]
                        let drTgt = Math.pow(dxTgt*dxTgt+dyTgt*dyTgt,0.5)/1000
                        let thetaTgt = Math.atan2(dxTgt,dyTgt)
                        let PosXtgt = w/2 + drTgt * Math.cos(thetaTgt) * 0.539957 * radius/20 
                        let PosYtgt = h/2 + drTgt * Math.sin(thetaTgt) * 0.539957 * radius/20

                        missileTgtLineRefs.current[i].setAttribute('x1',(PosX + mrmImgSize/2))
                        missileTgtLineRefs.current[i].setAttribute('y1',(PosY + mrmImgSize/2))
                        missileTgtLineRefs.current[i].setAttribute('x2',PosXtgt)
                        missileTgtLineRefs.current[i].setAttribute('y2',PosYtgt)
                    }
                    
                    missileTgtLineRefs.current[i].setAttribute('visibility',visibility)
                    if(useCsvDataStore.getState().data[index][tgtName + ".isAlive"]!=="True"){
                        missileTgtLineRefs.current[i].setAttribute('visibility',"hidden")
                    }
                })
            }else{
                drones.forEach((element, i) => {
                    markerRefs.current[i].setAttribute('visibility',"hidden")
                })
                missiles.forEach((element, i) => {
                    missileRefs.current[i].setAttribute('visibility',"hidden")
                    missileTgtLineRefs.current[i].setAttribute('visibility',"hidden")
                })
            }
        }
    },[time])
    
    return(  
        <Box 
        width={w} 
        height={h}>
                <svg 
                position="relative"
                width={w} 
                height={h}
                style={{ 
                backgroundColor: backgroundColor,
                backgroundSize: "100%", 
                backgroundPosition: "center",
                }}> 
                <TACBackground canvasW={w} canvasH={h} size={radius*2} name={name}/>
                <g className="RangeTexts" transform ={"rotate(40" + "," + w/2 + "," + h/2 + ")"}>
                    <text
                    transform ={"translate(" + (w/2) + " ," + (h/2-radius/3) + ")" + "rotate(-40)"}
                    fill="white"
                    fontSize={"0.6em"}
                    text-anchor="middle"
                    dominantBaseline="central"
                    >
                    20</text>
                    <text
                    transform ={"translate(" + (w/2) + " ," + (h/2-2*radius/3) + ")" + "rotate(-40)"}
                    fill="white"
                    fontSize={"0.6em"}
                    text-anchor="middle"
                    dominantBaseline="central"
                    >
                    40</text>
                    <text
                    transform ={"translate(" + (w/2) + " ," + (h/2-3*radius/3) + ")" + "rotate(-40)"}
                    fill="white"
                    fontSize={"0.6em"}
                    text-anchor="middle"
                    dominantBaseline="central"
                    >
                    60</text>
                </g>
                <image
                    key={"origin"}
                    href={'/img/IconDroneGray.png'}
                    width={originImgSize}
                    height={originImgSize}
                    transform ={"translate(" + (w/2-originImgSize/2) + " ," + (h/2-originImgSize/2) + ")"}
                />
                <g className="Markers" ref={MarkersGroupRef}>
                    {drones &&
                    drones.map((el,i)=>{
                        return(
                            <image
                                key={"marker"+i}
                                href={el.src}
                                width={markerImgSize}
                                height={markerImgSize}
                                ref={element => markerRefs.current[i] = element}
                            />
                        )
                    })}
                    {missiles &&
                    missiles.map((el,i)=>{
                        return(
                            <image
                                key={"missile"+i}
                                href={el.src}
                                width={mrmImgSize}
                                height={mrmImgSize}
                                ref={element => missileRefs.current[i] = element}
                            />
                        )
                    })}
                    {missiles &&
                    missiles.map((el,i)=>{
                        return(
                            <line
                                key={"missileLine"+i}
                                stroke= "white"
                                strokeWidth={0.5}
                                strokeDasharray="4 1"
                                ref={element => missileTgtLineRefs.current[i] = element}
                            />
                        )
                    })}
                </g>
                </svg>
        </Box>
    )
}

export default TACcanvas