import * as THREE from 'three';
import React, { useEffect, useRef, useState } from "react";
import { extend } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei";
import { useCsvDataStore } from "../Store"
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { MeshLineGeometry } from 'meshline'
import { getPointsBetweenTgtMRM } from '../Utils';
import { useTheme } from "@mui/material";

extend({ MeshLine, MeshLineMaterial, MeshLineGeometry })
const mrmGLTFPath = import.meta.env.BASE_URL + "gltf/missile.glb"
useGLTF.preload(mrmGLTFPath);

const redColor = new THREE.Color(0xef4136)
const redColorEmission = new THREE.Color(0xFF007F)
const redColorEmissionLight = new THREE.Color(0xD30208)
const blueColor = new THREE.Color(0x1598d5)
const blueColorEmission = new THREE.Color(0x3399FF)
const blueColorEmissionLight = new THREE.Color(0x015386)

export default function Missile({name}) {
  const ref = useRef();
  const refTgtLink = useRef();
  const refMRM = useRef();
  const [geometry, setGeometry] = useState(null)
  const [material, setMaterial] = useState(null)
  const [geometryTgtLink, setGeometryTgtLink] = useState(null)
  const [materialTgtLink, setMaterialTgtLink] = useState(null)
  const time = useCsvDataStore(state => state.time)
  const dataLength = useCsvDataStore.getState().dataLength
  const emissiveIntensity = 1.4
  const theme = useTheme();

  useState(()=>{
    const { nodes, _ } = useGLTF(mrmGLTFPath);
    const Material = new THREE.MeshStandardMaterial({
      emissiveIntensity: emissiveIntensity, 
      metalness: 0.5, 
      transparent: true, 
      opacity: 0.85 });
      if (name.slice(0,1) == 'B'){
          Material.color = blueColor;
          Material.emissive = blueColorEmission; 
      }else if(name.slice(0,1) == 'R'){
          Material.color = redColor;
          Material.emissive = redColorEmission;
      }
      setGeometry(nodes)
      setMaterial(Material)
      setGeometryTgtLink(new MeshLineGeometry())

      const TgtLinkMaterial = new MeshLineMaterial({color: 0xffffff, lineWidth: 0.05, transparent: true, opacity: 0.5, dashArray:0.01, dashOffset: 0, dashRatio: 0.5});
      setMaterialTgtLink(TgtLinkMaterial)
  },[])

  useEffect(()=>{
         
    if(theme.palette.mode=="dark"){
        const Material = new THREE.MeshStandardMaterial({
        transparent: true, 
        });
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
        setMaterial(Material)
        const TgtLinkMaterial = new MeshLineMaterial({color: 0xffffff, lineWidth: 0.05, transparent: true, opacity: 0.5, dashArray:0.01, dashOffset: 0, dashRatio: 0.5});
        setMaterialTgtLink(TgtLinkMaterial)
    }else if(theme.palette.mode=="light"){
        const Material = new THREE.MeshBasicMaterial({});
        if (name.slice(0,1) == 'B'){
            Material.color = blueColorEmissionLight;
            Material.opacity = 1
        }else if(name.slice(0,1) == 'R'){
            Material.color = redColorEmissionLight;
            Material.opacity = 1
        }
        setMaterial(Material)

        const TgtLinkMaterial = new MeshLineMaterial({color: 0x000000, lineWidth: 0.05, transparent: true, opacity: 0.4, dashArray:0.01, dashOffset: 0, dashRatio: 0.5});
        setMaterialTgtLink(TgtLinkMaterial)
    }
    
    },[theme.palette.mode])

  // Animation
  useEffect(() => {
    if(useCsvDataStore.getState().data.length !== 0){
    if(geometry && material && geometryTgtLink){
      let index = (time * dataLength).toFixed() - 1 
      index = Math.min(Math.max(index, 0), dataLength-1);

        if(useCsvDataStore.getState().data[index][name + ".isFlying"]=="True"){
          ref.current.visible = true
          ref.current.position.z = useCsvDataStore.getState().data[index][name + ".pos.x[m]"]/1000
          ref.current.position.y = -useCsvDataStore.getState().data[index][name + ".pos.z[m]"]/1000
          ref.current.position.x = useCsvDataStore.getState().data[index][name + ".pos.y[m]"]/1000
          ref.current.rotation.y = useCsvDataStore.getState().data[index][name + ".att.yaw[rad]"] - Math.PI/2
          ref.current.rotation.z = useCsvDataStore.getState().data[index][name + ".att.pitch[rad]"]
          ref.current.rotation.x = useCsvDataStore.getState().data[index][name + ".att.roll[rad]"]
          ref.current.rotation.order = 'YZX'

          const tgtName =useCsvDataStore.getState().data[index][name + ".target.truth"]
          if(useCsvDataStore.getState().data[index][tgtName + ".isAlive"]=="True"){
            refTgtLink.current.visible = true
            const points = getPointsBetweenTgtMRM(index, name, tgtName)
            refTgtLink.current.geometry.setPoints(points)
          }else{
            refTgtLink.current.visible = false
          }
        }else{
            ref.current.visible = false
            refTgtLink.current.visible = false
        }
    }
  }
  },[time])
    
  return (
    <>
    {geometry && material && geometryTgtLink &&
    <>
    <group dispose={null} ref={ref}>
      <group scale={0.004}>
        <mesh
          geometry={geometry["Aim-120_Aim-120_material_0"].geometry}
          material={material}
          rotation={[-2.356, 0, 0]}
          scale={100}
          ref={refMRM}
        />
      </group>
    </group>
    <mesh geometry={geometryTgtLink} material={materialTgtLink} ref={refTgtLink} />
    </>
    }
    </>
  );
}


