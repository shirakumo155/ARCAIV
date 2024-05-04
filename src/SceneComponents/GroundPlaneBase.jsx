import {useLoader} from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import React, { useEffect, useState } from "react"
///////////////////////////////// Ground /////////////////////////////////
export default function GroundPlaneBase(){
    const backgroundPath = import.meta.env.BASE_URL + "texture/alphaMapGround3.png"
    const alphaMap = useLoader(TextureLoader, backgroundPath)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [color, setColor] = useState()

    useEffect(()=>{
      if(theme.palette.mode=="dark"){
        setColor(0x696969)
      }else if(theme.palette.mode=="light"){
        setColor(0x757780)
      }
  },[theme.palette.mode])

    return (
      <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -0.25, 0]}>
        <planeGeometry args={[50, 50]}/>
        <meshBasicMaterial alphaMap={alphaMap} color={color} transparent={true}/>
      </mesh>
    )
  }
  