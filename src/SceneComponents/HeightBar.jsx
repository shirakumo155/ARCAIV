import React, { useEffect, useState, useRef } from "react"
import * as THREE from 'three';
import { useCsvDataStore } from "../Store"

const radius = 0.01
const radiusTick = 0.15
const meterToFeet = 3.28084
const feetToMeter = 0.3048
const heightTicks = [10,20,30,40] // 10k feet to 40k feet

export default function HeightBar(props){
    const refGroup = useRef()
    const refBar = useRef()
    const refsTick = useRef([]);
    const [material, setMaterial] = useState(null)
    const [materialBase, setMaterialBase] = useState(null)
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength

    // Initialize
    useEffect(() => {
        //const texture = textureLoader.load('./texture/alphaMapBar.png',);
        if (props.name.slice(0,1) == 'B'){
            const blueBarMaterial = [
                new THREE.MeshStandardMaterial({color: 0x3399FF, emissive: 0x3399FF, emissiveIntensity: 0.5, transparent: false }),
                new THREE.MeshStandardMaterial({color: 0x3399FF, emissive: 0x3399FF, emissiveIntensity: 0.5, transparent: false, opacity: 0 }),
                new THREE.MeshStandardMaterial({color: 0x3399FF, emissive: 0x3399FF, emissiveIntensity: 0.5, transparent: false, opacity: 0 })
            ];
            setMaterial(blueBarMaterial)
            setMaterialBase(new THREE.MeshBasicMaterial({color: 0x3399FF, transparent: true, opacity: 0.2 }))
        }else if(props.name.slice(0,1) == 'R'){
            const redBarMaterial = [
                new THREE.MeshStandardMaterial({color: 0xFF007F, emissive: 0xFF007F, emissiveIntensity: 0.3, transparent: false }),
                new THREE.MeshStandardMaterial({color: 0xFF007F, emissive: 0xFF007F, emissiveIntensity: 0.3, transparent: false, opacity: 0 }),
                new THREE.MeshStandardMaterial({color: 0xFF007F, emissive: 0xFF007F, emissiveIntensity: 0.3, transparent: false, opacity: 0 }),
            ];
            setMaterial(redBarMaterial)
            setMaterialBase(new THREE.MeshBasicMaterial({color: 0xFF007F, transparent: true, opacity: 0.1 }))
        }
    },[])

    // Animation
    useEffect(() => {
        if(useCsvDataStore.getState().data.length !== 0){
        if(material && materialBase){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                refGroup.current.visible = true
                refGroup.current.position.x = useCsvDataStore.getState().data[index][props.name + ".pos.y[m]"]/1000
                refBar.current.position.y = -useCsvDataStore.getState().data[index][props.name + ".pos.z[m]"]/1000/2
                refGroup.current.position.z = useCsvDataStore.getState().data[index][props.name + ".pos.x[m]"]/1000
                refBar.current.scale.y = -useCsvDataStore.getState().data[index][props.name + ".pos.z[m]"]/1000
                refsTick.current.map((el, i) => {
                    if((i+1)>-useCsvDataStore.getState().data[index][props.name + ".pos.z[m]"]/1000*meterToFeet/10){
                       return el.visible = false
                    }else{
                       return el.visible = true
                    }
                })
            }else{
                refGroup.current.visible = false
            }
        }
    }
    },[time])

    return(
    <>
    {material && materialBase &&
        <group ref={refGroup}>
            <mesh ref={refBar} material={material}>
                <cylinderGeometry args={[radius, radius, 1, 32]}/>
            </mesh> 
            <mesh material={materialBase}>
                <cylinderGeometry args={[0.5, 0.5, 0.4, 32]}/>
            </mesh> 
            {heightTicks.map((el, i) => (
                <mesh key = {props.name + ":Tick" + heightTicks[i].toString()} ref={(element) => refsTick.current[i] = element} material={materialBase} position={[0, el*feetToMeter, 0]}>
                    <sphereGeometry args={[radiusTick, 30, 30]} />
                </mesh> 
            ))}
        </group>
        
            
        
    }
    </>
      
    )
  }