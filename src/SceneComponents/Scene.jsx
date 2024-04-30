import { useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useState } from "react"
import { useCsvDataStore } from "../Store"
import GroundPlane from "./GroundPlane"
import GroundPlaneBase from "./GroundPlaneBase"
import Drone from "./Drone"
import Missile from "./Missile"
import DroneLinks from "./DroneLinks"


export default function Scene(){
    const [isRotate, setIsRotate] = useState(true)
    const isPaused = useCsvDataStore(state => state.isPaused);
    const setTime = useCsvDataStore((state)=>(state.setTime))
    const setTimeHUD = useCsvDataStore((state)=>(state.setTimeHUD))
    const animationSpeed = useCsvDataStore(state => state.animationSpeed);    

    useFrame((_, delta)=>{
      if(!isPaused){
        const t = (useCsvDataStore.getState().time + delta * animationSpeed*0.01) % 1
        setTime(t)
      }
    },{
      throttle: 20,
      priority: 1,
    })

    useFrame((_, delta)=>{
      if(!isPaused ){
        const t = useCsvDataStore.getState().time
        setTimeHUD(t)
      }
    },{
      throttle: 9,
      priority: 2,
    })
 
    return(
      <>
        <GroundPlaneBase />
        <GroundPlane />
        <Drone key={"Blue/Blue1"} name={"Blue/Blue1"} />
        <Drone key={"Blue/Blue2"} name={"Blue/Blue2"} />
        <Drone key={"Red/Red1"} name={"Red/Red1"} />
        <Drone key={"Red/Red2"} name={"Red/Red2"} />
        <Missile key={"Blue/Blue1:Missile1"} name={"Blue/Blue1:Missile1"}/>
        <Missile key={"Blue/Blue1:Missile2"} name={"Blue/Blue1:Missile2"}/>
        <Missile key={"Blue/Blue1:Missile3"} name={"Blue/Blue1:Missile3"}/>
        <Missile key={"Blue/Blue1:Missile4"} name={"Blue/Blue1:Missile4"}/>
        <Missile key={"Blue/Blue2:Missile1"} name={"Blue/Blue2:Missile1"}/>
        <Missile key={"Blue/Blue2:Missile2"} name={"Blue/Blue2:Missile2"}/>
        <Missile key={"Blue/Blue2:Missile3"} name={"Blue/Blue2:Missile3"}/>
        <Missile key={"Blue/Blue2:Missile4"} name={"Blue/Blue2:Missile4"}/>
        <Missile key={"Red/Red1:Missile1"} name={"Red/Red1:Missile1"}/>
        <Missile key={"Red/Red1:Missile2"} name={"Red/Red1:Missile2"}/>
        <Missile key={"Red/Red1:Missile3"} name={"Red/Red1:Missile3"}/>
        <Missile key={"Red/Red1:Missile4"} name={"Red/Red1:Missile4"}/>
        <Missile key={"Red/Red2:Missile1"} name={"Red/Red2:Missile1"}/>
        <Missile key={"Red/Red2:Missile2"} name={"Red/Red2:Missile2"}/>
        <Missile key={"Red/Red2:Missile3"} name={"Red/Red2:Missile3"}/>
        <Missile key={"Red/Red2:Missile4"} name={"Red/Red2:Missile4"}/>
  
        <DroneLinks />
        <OrbitControls makeDefault maxPolarAngle={0.49 * Math.PI} autoRotate={isRotate} autoRotateSpeed={1} onStart={() => setIsRotate(false)}/>
      </>
      
    )
            
  }