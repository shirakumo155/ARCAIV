import * as THREE from 'three';
import React, { useEffect, useState, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei";
import { useCsvDataStore } from "../Store"
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import Trail from "./Trail"
import HeightBar from './HeightBar';
import { lerp } from "three/src/math/MathUtils";

const redColor = new THREE.Color(0xef4136)
const redColorEmission = new THREE.Color(0xFF007F)
const redColorEmissionLight = new THREE.Color(0xD30208)
const blueColor = new THREE.Color(0x1598d5)
const blueColorEmission = new THREE.Color(0x3399FF)
const blueColorEmissionLight = new THREE.Color(0x015386)
const droneGLTFPath = import.meta.env.BASE_URL + "gltf/drone.glb"
    
///////////////////////////////// Drone //////////////////////////////////
export default function Drone({name}) {
    const { camera } = useThree();
    const { get } = useThree();
    const control = get().controls
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const ref = useRef(); 
    const [geometry, setGeometry] = useState(null)
    const [material, setMaterial] = useState(null)
    const time = useCsvDataStore(state => state.time);
    const cameraView = useCsvDataStore(state => state.camera);
    const dataLength = useCsvDataStore.getState().dataLength
    
    
    useEffect(() => {
        const { nodes, _ } = useGLTF(droneGLTFPath);
        const Material = new THREE.MeshStandardMaterial({
            transparent: true, 
            opacity: 0.85 }); 
        if (name.slice(0,1) == 'B'){
            Material.color = blueColor;
            Material.emissive = colors.BlueAsset; 
            Material.emissiveIntensity = 2.2 
        }else if(name.slice(0,1) == 'R'){
            Material.color = redColor;
            Material.emissive = colors.RedAsset;
            Material.emissiveIntensity = 2
        }
        setGeometry(nodes)
        setMaterial(Material)
    },[])   
    

    useEffect(()=>{
        const Material = new THREE.MeshStandardMaterial({
            transparent: true, 
            }); 
        if(theme.palette.mode=="dark"){
            if (name.slice(0,1) == 'B'){
                Material.color = blueColor;
                Material.emissive = blueColorEmission; 
                Material.emissiveIntensity = 2.2 ;
                Material.opacity = 0.85
            }else if(name.slice(0,1) == 'R'){
                Material.color = redColor;
                Material.emissive = redColorEmission;
                Material.emissiveIntensity = 2
                Material.opacity = 0.85
            }
        }else if(theme.palette.mode=="light"){
            if (name.slice(0,1) == 'B'){
                Material.color = blueColor;
                Material.emissive = blueColorEmissionLight; 
                Material.emissiveIntensity = 2.2 
                Material.opacity = 1
            }else if(name.slice(0,1) == 'R'){
                Material.color = redColor;
                Material.emissive = redColorEmissionLight;
                Material.emissiveIntensity = 2
                Material.opacity = 1
            }
        }
        setMaterial(Material)
    },[theme.palette.mode])

    // Animation
    useEffect(() => {
        if(geometry && material){
            if(useCsvDataStore.getState().data.length !== 0){
                let index = (time * dataLength).toFixed() - 1 
                index = Math.min(Math.max(index, 0), dataLength-1);
                if(useCsvDataStore.getState().data[index][name + ".isAlive"]=="True"){
                    ref.current.visible = true
                    let posX = useCsvDataStore.getState().data[index][name + ".pos.y[m]"]/1000
                    let posY = -useCsvDataStore.getState().data[index][name + ".pos.z[m]"]/1000
                    let posZ = useCsvDataStore.getState().data[index][name + ".pos.x[m]"]/1000
                    let rotX = useCsvDataStore.getState().data[index][name + ".att.roll[rad]"]
                    let rotY = useCsvDataStore.getState().data[index][name + ".att.yaw[rad]"] - Math.PI/2
                    let rotZ = useCsvDataStore.getState().data[index][name + ".att.pitch[rad]"]
                    ref.current.position.x = posX
                    ref.current.position.y = posY
                    ref.current.position.z = posZ
                    ref.current.rotation.x = rotX
                    ref.current.rotation.y = rotY
                    ref.current.rotation.z = rotZ
                    ref.current.rotation.order = 'YZX'
                    if(cameraView == name){
                        const cameraRot = new THREE.Euler(rotX, rotY, rotZ, 'YZX')
                        const offset = new THREE.Vector3( -10, 3, 0 )
                        const cameraPos = offset.applyEuler(cameraRot).add(new THREE.Vector3( posX, posY, posZ ))
                        const cameraUp = new THREE.Vector3( 0, 1, 0 ).applyEuler(new THREE.Euler(rotX, rotY, rotZ, 'YZX'))
                        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
                        control.target.set(posX,posY,posZ);
                        control.update();
                        camera.up.lerp(cameraUp, 1)
                    }
                }else{
                    ref.current.visible = false
                }
            }
        }
    },[time])
    

    return (
        <>
        {geometry && material &&
        <group dispose={null} scale={[0.1,0.1,0.1]} ref={ref}>
          <group rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <group position={[0, 0, -4]}>
                <mesh geometry={geometry.JET_Material001_0.geometry} material={material}/>
                <mesh geometry={geometry.JET_Material_0.geometry} material={material}/>
            </group>
          </group>
        </group>
        }
        <group position={[0, 0, 0]}>
                <Trail key={name + ":Trail"} name={name} />   
        </group>
        <HeightBar key={name + ":HeightBar"} name={name}/>
        </>
      );
}


useGLTF.preload(droneGLTFPath);