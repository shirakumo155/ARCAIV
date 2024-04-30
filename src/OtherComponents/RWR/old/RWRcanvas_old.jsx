import { Box } from "@mui/material";
import React, {useEffect, useRef, useState, useContext} from "react"
import { useCsvDataStore } from "../../Store"
import { isOpenContext } from "../videoLayerComponents/TableItem";

const RWRcanvas = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.name
    const team = props.team
    const backgroundColor = props.bkColor
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const MRMRefs = useRef([])
    const DroneRefs = useRef([])
    const [drones, setDrones] = useState([])
    const [missiles, setMissiles] = useState([])
    const isOpen = useContext(isOpenContext);

    useEffect(()=>{
        if(team=="Blue"){
            setDrones([{name: "Red/Red1", text: "FX"},{name: "Red/Red2", text: "FX"}])
            setMissiles([
                {name: "Red/Red1:Missile1", text: "M"},
                {name: "Red/Red1:Missile2", text: "M"},
                {name: "Red/Red1:Missile3", text: "M"},
                {name: "Red/Red1:Missile4", text: "M"},
                {name: "Red/Red2:Missile1", text: "M"},
                {name: "Red/Red2:Missile2", text: "M"},
                {name: "Red/Red2:Missile3", text: "M"},
                {name: "Red/Red2:Missile4", text: "M"}])
        }else{
            setDrones([{name: "Blue/Blue1", text: "FX"},{name: "Blue/Blue2", text: "FX"}])
            setMissiles([
                {name: "Blue/Blue1:Missile1", text: "M"},
                {name: "Blue/Blue1:Missile2", text: "M"},
                {name: "Blue/Blue1:Missile3", text: "M"},
                {name: "Blue/Blue1:Missile4", text: "M"},
                {name: "Blue/Blue2:Missile1", text: "M"},
                {name: "Blue/Blue2:Missile2", text: "M"},
                {name: "Blue/Blue2:Missile3", text: "M"},
                {name: "Blue/Blue2:Missile4", text: "M"}])
        }
    },[])

    useEffect(()=>{
        if(dataLength !== 0 ){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if((useCsvDataStore.getState().data[index][props.team + "/" + props.name + ".isAlive"]=="True") && isOpen){
                drones.forEach((element, i) => {
                    if(useCsvDataStore.getState().data[index][element.name + ".isAlive"]=="True"){
                        let dx = useCsvDataStore.getState().data[index][element.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.x[m]"]
                        let dy = useCsvDataStore.getState().data[index][element.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.y[m]"]
                        let yaw = +useCsvDataStore.getState().data[index][team+"/"+name + ".att.yaw[rad]"]
                        let theta = Math.atan2(dx,dy) + yaw + Math.PI
                        let dr = h/2*0.8
                        let PosX = w/2 + dr * Math.cos(theta)  
                        let PosY = h/2 + dr * Math.sin(theta)
                        let move = "translate(" + (PosX)  + "," + PosY + ")" 
                        
                        DroneRefs.current[i].setAttribute('transform',move)
                        DroneRefs.current[i].setAttribute('visibility',"visible")
                    }else{
                        DroneRefs.current[i].setAttribute('visibility',"hidden")
                    }
                })

                missiles.forEach((element, i) => {
                    if(useCsvDataStore.getState().data[index][element.name + ".isFlying"]=="True"){
                        let dx = useCsvDataStore.getState().data[index][element.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.x[m]"]
                        let dy = useCsvDataStore.getState().data[index][element.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.y[m]"]
                        let dz = useCsvDataStore.getState().data[index][element.name + ".pos.z[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.z[m]"]
                        let yaw = +useCsvDataStore.getState().data[index][team+"/"+name + ".att.yaw[rad]"]
                        let theta = Math.atan2(dx,dy) + yaw + Math.PI
                        let distance = Math.pow(dx*dx+dy*dy+dz*dz,0.5)
                        let dr = h/2*0.8
                        let PosX = w/2 + dr * Math.cos(theta)  
                        let PosY = h/2 + dr * Math.sin(theta)
                        let move = "translate(" + (PosX)  + "," + PosY + ")" 
                        MRMRefs.current[i].setAttribute('transform',move)
                        
                        if((useCsvDataStore.getState().data[index][element.name + ".target.truth"]==team+"/"+name)
                        &&  distance<10000){
                            MRMRefs.current[i].setAttribute('visibility',"visible")
                        }else{
                            MRMRefs.current[i].setAttribute('visibility',"hidden")
                        }
                        
                    }else{
                        MRMRefs.current[i].setAttribute('visibility',"hidden")
                    }
                })
                //console.log(ref.current.getAttribute('transform'))
                
            }else{
                drones.forEach((element, i) => {
                    DroneRefs.current[i].setAttribute('visibility',"hidden")
                })
                missiles.forEach((element, i) => {
                    MRMRefs.current[i].setAttribute('visibility',"hidden")
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
            <image
                key={"RWR"}
                href={'/HUDicons/RWR.png'}
                width={w}
                height={h}
                visibility={isOpen? "visible" : "hidden"}
                />
            {drones &&
            drones.map((el, i)=>{
                return(
                    <text fill="white"
                    fontSize={"0.4em"}
                    text-anchor="middle"
                    dominantBaseline="central"
                    ref={element => DroneRefs.current[i] = element}>
                    {el.text}
                    </text>
                )
            })}
            {missiles &&
            missiles.map((el, i)=>{
                return(
                    <text fill="white"
                    fontSize={"0.6em"}
                    text-anchor="middle"
                    dominantBaseline="central"
                    ref={element => MRMRefs.current[i] = element}>
                    {el.text}
                    </text>
                )
            })}
            </svg>
        </Box>
    )
}

export default RWRcanvas