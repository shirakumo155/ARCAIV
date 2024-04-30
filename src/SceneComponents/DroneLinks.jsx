import * as THREE from 'three';
import { extend } from "@react-three/fiber"
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { MeshLineGeometry } from 'meshline'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataStore } from "../Store"
import { getGradationLineMeshMaterial, getLinkPoints, hexToRgbA } from '../Utils';

extend({ MeshLine, MeshLineMaterial, MeshLineGeometry })

const LinkGradColor = [
    [0, hexToRgbA('#24aded', 0)],
    [0.08, hexToRgbA('#24aded', 0)],
    [0.2, hexToRgbA('#24aded', 1)],
    [0.8, hexToRgbA('#FF007F', 1)],
    [0.90, hexToRgbA('#FF007F', 0)],
    [1, hexToRgbA('#FF007F', 0)]
];
const BlueLinkGradColor = [
    [0, hexToRgbA('#24aded', 0)],
    [0.1, hexToRgbA('#24aded', 0)],
    [0.2, hexToRgbA('#24aded', 1)],
    [0.8, hexToRgbA('#103e54', 1)],
    [0.9, hexToRgbA('#103e54', 0)],
    [1, hexToRgbA('#103e54', 0)]
];
const RedLinkGradColor = [
    [0, hexToRgbA('#451512', 0)],
    [0.1, hexToRgbA('#451512', 0)],
    [0.2, hexToRgbA('#451512', 1)],
    [0.8, hexToRgbA('#FF007F', 1)],
    [0.9, hexToRgbA('#FF007F', 0)],
    [1, hexToRgbA('#FF007F', 0)]
];
const GrayLinkGradColor = [
    [0, hexToRgbA('#525452', 0)],
    [0.1, hexToRgbA('#525452', 0)],
    [0.2, hexToRgbA('#525452', 1)],
    [0.8, hexToRgbA('#525452', 1)],
    [0.9, hexToRgbA('#525452', 0)],
    [1, hexToRgbA('#525452', 0)]
];

const linkWidth = 0.15;
const GradLinkMaterial = getGradationLineMeshMaterial(linkWidth, LinkGradColor);
const blueLinkMaterial = getGradationLineMeshMaterial(linkWidth, BlueLinkGradColor);
const redLinkMaterial = getGradationLineMeshMaterial(linkWidth, RedLinkGradColor);
const grayLinkMaterial = getGradationLineMeshMaterial(linkWidth, GrayLinkGradColor);

function getHotCold(index, blueName, RedName){
    const bluePoint = new THREE.Vector3(
        useCsvDataStore.getState().data[index][blueName + ".pos.x[m]"]/1000,
        useCsvDataStore.getState().data[index][blueName + ".pos.y[m]"]/1000,
        useCsvDataStore.getState().data[index][blueName + ".pos.z[m]"]/1000)
    const redPoint = new THREE.Vector3(
        useCsvDataStore.getState().data[index][RedName + ".pos.x[m]"]/1000,
        useCsvDataStore.getState().data[index][RedName + ".pos.y[m]"]/1000,
        useCsvDataStore.getState().data[index][RedName + ".pos.z[m]"]/1000)
    const blueAtt = new THREE.Euler(
        useCsvDataStore.getState().data[index][blueName + ".att.roll[rad]"],
        useCsvDataStore.getState().data[index][blueName + ".att.pitch[rad]"],
        useCsvDataStore.getState().data[index][blueName + ".att.yaw[rad]"], 'ZYX')
    const redAtt = new THREE.Euler(
        useCsvDataStore.getState().data[index][RedName + ".att.roll[rad]"],
        useCsvDataStore.getState().data[index][RedName + ".att.pitch[rad]"],
        useCsvDataStore.getState().data[index][RedName + ".att.yaw[rad]"], 'ZYX')

    const drectionBlue = new THREE.Vector3( 1, 0, 0 ).applyEuler( blueAtt );
    const VecBtoR = new THREE.Vector3(redPoint.x - bluePoint.x, redPoint.y - bluePoint.y, redPoint.z - bluePoint.z);
    const drectionRed = new THREE.Vector3( 1, 0, 0 ).applyEuler( redAtt );
    const VecRtoB = new THREE.Vector3(bluePoint.x - redPoint.x, bluePoint.y - redPoint.y, bluePoint.z - redPoint.z);
    // if B1 lock R1
    if(drectionBlue.dot(VecBtoR.normalize()) >= 0){
        // if R1 lock B1
        if(drectionRed.dot(VecRtoB.normalize()) >= 0){
            return { material: GradLinkMaterial, detect: true }
        }else{
            return { material: blueLinkMaterial, detect: true }
        }
    }else{
        // if R1 lock B1
        if(drectionRed.dot(VecRtoB.normalize()) >= 0){
            return { material: redLinkMaterial, detect: true }
        }else{
            return { material: grayLinkMaterial, detect: false }
        }
    }
}

const blueName = ["Blue/Blue1", "Blue/Blue2"]
const redName = ["Red/Red1", "Red/Red2"]
const linkName = ["Blue1/Red1", "Blue1/Red2", "Blue2/Red1", "Blue2/Red2"]


export default function DroneLinks(props) {
    const refsLink = useRef([]);
    const [geometry, setGeometry] = useState([])
    const [material, setMaterial] = useState(null)
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    
    // Init
    useEffect(() => {
        setMaterial(GradLinkMaterial)
        setGeometry([new MeshLineGeometry(), new MeshLineGeometry(), new MeshLineGeometry(), new MeshLineGeometry()])
    },[])
    
    // Animation
    useEffect(() => {
        if(useCsvDataStore.getState().data.length !== 0){
        if(geometry !==0 && material){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            linkName.map((el, i)=>{
                if (el.slice(0, 5) == 'Blue1' && el.slice(6, 10) == 'Red1')  {
                    if((useCsvDataStore.getState().data[index][blueName[0] + ".isAlive"]=="True")&&
                    (useCsvDataStore.getState().data[index][redName[0] + ".isAlive"]=="True")){
                        refsLink.current[i].visible = true;
                        // update geom
                        const points = getLinkPoints(index, blueName[0], redName[0])
                        refsLink.current[i].geometry.setPoints(points)
                        //update mat
                        if(getHotCold(index, blueName[0], redName[0]).detect){
                            refsLink.current[i].material = getHotCold(index, blueName[0], redName[0]).material
                        }else{
                            refsLink.current[i].visible = false
                        }
                    }else{
                        refsLink.current[i].visible = false
                    }
                }else if (el.slice(0, 5) == 'Blue1' && el.slice(6, 10) == 'Red2')  {
                    if((useCsvDataStore.getState().data[index][blueName[0] + ".isAlive"]=="True")&&
                    (useCsvDataStore.getState().data[index][redName[1] + ".isAlive"]=="True")){
                        refsLink.current[i].visible = true;
                        // update geom
                        const points = getLinkPoints(index, blueName[0], redName[1])
                        refsLink.current[i].geometry.setPoints(points)
                        //update mat
                        if(getHotCold(index, blueName[0], redName[1]).detect){
                            refsLink.current[i].material = getHotCold(index, blueName[0], redName[1]).material
                        }else{
                            refsLink.current[i].visible = false
                        }
                    }else{
                        refsLink.current[i].visible = false
                    }
                }else if (el.slice(0, 5) == 'Blue2' && el.slice(6, 10) == 'Red1')  {
                    if((useCsvDataStore.getState().data[index][blueName[1] + ".isAlive"]=="True")&&
                    (useCsvDataStore.getState().data[index][redName[0] + ".isAlive"]=="True")){
                        refsLink.current[i].visible = true;
                        // update geom
                        const points = getLinkPoints(index, blueName[1], redName[0])
                        refsLink.current[i].geometry.setPoints(points)
                        //update mat
                        if(getHotCold(index, blueName[1], redName[0]).detect){
                           refsLink.current[i].material = getHotCold(index, blueName[1], redName[0]).material 
                        }else{
                            refsLink.current[i].visible = false;
                        }
                    }else{
                        refsLink.current[i].visible = false;
                    }
                }else if (el.slice(0, 5) == 'Blue2' && el.slice(6, 10) == 'Red2')  {
                    if((useCsvDataStore.getState().data[index][blueName[1] + ".isAlive"]=="True")&&
                    (useCsvDataStore.getState().data[index][redName[1] + ".isAlive"]=="True")){
                        refsLink.current[i].visible = true;
                        // update geom
                        const points = getLinkPoints(index, blueName[1], redName[1])
                        refsLink.current[i].geometry.setPoints(points)
                        //update mat
                        if(getHotCold(index, blueName[1], redName[1]).detect){
                            refsLink.current[i].material = getHotCold(index, blueName[1], redName[1]).material
                        }else{
                            refsLink.current[i].visible = false;
                        }
                    }else{
                        refsLink.current[i].visible = false;
                    }
                }
            })
        }
    }
    },[time])

    return (
    <>
        {geometry !==0 && material &&
            linkName.map((el, i) => (
                <mesh key = {el} geometry={geometry[i]} material={material} ref={(element) => refsLink.current[i] = element} />
            ))
        }       
    </>
    )
  }