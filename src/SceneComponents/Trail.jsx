import * as THREE from 'three';
import { extend } from "@react-three/fiber"
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { MeshLineGeometry } from 'meshline'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../Store"
import { getGradationLineMeshMaterial, hexToRgbA } from '../Utils';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

extend({ MeshLine, MeshLineMaterial, MeshLineGeometry })



const BlueTrailGradColor = [
    [0, hexToRgbA('#24aded', 0)],
    [0.08, hexToRgbA('#24aded', 0)],
    [0.2, hexToRgbA('#24aded', 1)],
    [0.9, hexToRgbA('#103e54', 1)],
    [0.97, hexToRgbA('#103e54', 0)],
    [1, hexToRgbA('#103e54', 0)]
];

const BlueTrailGradColorLight = [
    [0, hexToRgbA('#24aded', 0)],
    [0.08, hexToRgbA('#24aded', 0)],
    [0.2, hexToRgbA('#24aded', 1)],
    [0.9, hexToRgbA('#015386', 1)],
    [0.97, hexToRgbA('#015386', 0)],
    [1, hexToRgbA('#015386', 0)]
];

const RedTrailGradColor = [
    [0, hexToRgbA('#FF007F', 0)],
    [0.08, hexToRgbA('#FF007F', 0)],
    [0.2, hexToRgbA('#FF007F', 1)],
    [0.9, hexToRgbA('#451512', 1)],
    [0.97, hexToRgbA('#451512', 0)],
    [1, hexToRgbA('#451512', 0)]
];

const RedTrailGradColorLight = [
    [0, hexToRgbA('#FF007F', 0)],
    [0.08, hexToRgbA('#FF007F', 0)],
    [0.2, hexToRgbA('#FF007F', 1)],
    [0.9, hexToRgbA('#D30208', 1)],
    [0.97, hexToRgbA('#D30208', 0)],
    [1, hexToRgbA('#D30208', 0)]
];

const trailLength = 1500;
const trailWidth = 0.3;
const downSampleRate = 15

export default function Trail(props) {
    const ref = useRef()
    const [geometry, setGeometry] = useState(null)
    const [material, setMaterial] = useState(null)
    const [trajectory, setTrajectory] = useState(null)
    const time = useCsvDataStore(state => state.time)
    const dataLength = useCsvDataStore.getState().dataLength
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // Init
    useEffect(() => {
        const trajectory = useCsvDataStore.getState().data.map(function(element, index){
            if(index % downSampleRate === 0){
                return new THREE.Vector3(element[props.name + ".pos.y[m]"]/1000, -element[props.name + ".pos.z[m]"]/1000, element[props.name + ".pos.x[m]"]/1000)
            }
        })
        setTrajectory(trajectory.filter(function(element){return element !== undefined}))
        if (props.name.slice(0,1) == 'B'){
            const blueTrailMaterial = getGradationLineMeshMaterial(trailWidth, BlueTrailGradColor);
            setMaterial(blueTrailMaterial)
        }else if(props.name.slice(0,1) == 'R'){
            const redTrailMaterial = getGradationLineMeshMaterial(trailWidth, RedTrailGradColor);
            setMaterial(redTrailMaterial)
        }
        setGeometry(new MeshLineGeometry())
    },[])

    useEffect(()=>{
        const Material = new THREE.MeshStandardMaterial({
            transparent: true, 
            }); 
        if(theme.palette.mode=="dark"){
            if (props.name.slice(0,1) == 'B'){
                const blueTrailMaterial = getGradationLineMeshMaterial(trailWidth, BlueTrailGradColor);
                setMaterial(blueTrailMaterial)
            }else if(props.name.slice(0,1) == 'R'){
                const redTrailMaterial = getGradationLineMeshMaterial(trailWidth, RedTrailGradColor);
                setMaterial(redTrailMaterial)
            }
        }else if(theme.palette.mode=="light"){
            if (props.name.slice(0,1) == 'B'){
                const blueTrailMaterial = getGradationLineMeshMaterial(trailWidth, BlueTrailGradColorLight);
                setMaterial(blueTrailMaterial)
            }else if(props.name.slice(0,1) == 'R'){
                const redTrailMaterial = getGradationLineMeshMaterial(trailWidth, RedTrailGradColorLight);
                setMaterial(redTrailMaterial)
            }
        }
    },[theme.palette.mode])
    
    // Animation
    useEffect(() => {
        //console.log(pos.length)
        if(useCsvDataStore.getState().data.length !== 0){
        if(geometry && material){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if(useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True"){
                ref.current.visible = true
                if(index<trailLength){
                    let pastTrajectory = trajectory.slice(0, Math.floor(index/downSampleRate))
                    ref.current.geometry.setPoints(pastTrajectory)
                }else{
                    let pastTrajectory = trajectory.slice(Math.floor((index-trailLength)/downSampleRate), Math.floor(index/downSampleRate))
                    ref.current.geometry.setPoints(pastTrajectory)
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
            <mesh geometry={geometry} material={material} ref={ref} />
        }       
    </>
    )
  }