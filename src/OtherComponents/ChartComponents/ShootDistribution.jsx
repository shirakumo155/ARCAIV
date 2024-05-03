import * as THREE from 'three';
import {Canvas} from "@react-three/fiber"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useCsvDataListStore } from "../../Store"
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState, useRef } from "react"
import { OrbitControls, Sphere, useGLTF  } from "@react-three/drei"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import {useLoader} from "@react-three/fiber"

const redColor = new THREE.Color(0xef4136)
const redColorEmission = new THREE.Color(0xFF007F)
const blueColor = new THREE.Color(0x1598d5)
const blueColorEmission = new THREE.Color(0x3399FF)
const droneGLTFPath = import.meta.env.BASE_URL + "gltf/drone.glb"
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const clearColorOpacity = 0.5
const initialCamRadius = 80
const initialCamHeight = 40

const ShootDistribution = (props)=>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const fileArr = useCsvDataListStore(state => state.fileArr)
    const [geometry, setGeometry] = useState(null)
    const [material, setMaterial] = useState(null)
    const [mrmPoints, setMrmPoints] = useState([])
    const name = "Blue"
    const ref =useRef()
    const [isRotate, setIsRotate] = useState(true)


    useEffect(() => {
        if(fileArr.length ==0 || !fileArr){
            return
        }
  
        const { nodes, _ } = useGLTF(droneGLTFPath);
        const Material = new THREE.MeshStandardMaterial({
            transparent: true, 
            opacity: 0.85 }); 
        if (name.slice(0,1) == 'B'){
            Material.color = blueColor;
            Material.emissive = blueColorEmission; 
            Material.emissiveIntensity = 2.2 
        }else if(name.slice(0,1) == 'R'){
            Material.color = redColor;
            Material.emissive = redColorEmission;
            Material.emissiveIntensity = 2
        }
        setGeometry(nodes)
        setMaterial(Material)

        const drones = ["Blue1", "Blue2", "Red1", "Red2"]
        let mrmPointsTemp = []
        fileArr.forEach(element => {
            drones.forEach((drone)=>{
                element.stats[drone].shootData.forEach((mrmPoint)=>{
                    mrmPointsTemp.push(mrmPoint)
                })
            })
        });
        setMrmPoints(mrmPointsTemp)
        
    },[])   
  
    return(
      <Box 
        position="relative" 
        width="100%" 
        height="100%" 
        overflow="hidden" 
        display="flex" 
        flexDirection="column"
        alignItems="center"
        justifyContent="center" >
        
        <Box position="relative" flex-grow="1" width="80%" height="80%" overflow="hidden" >
          {
              // If you have data, then render a scene 
              <Canvas 
                    camera={
                      {fov: 45, aspect: windowWidth / windowHeight, near: 0.1, far: 1000, position: [0, initialCamHeight, initialCamRadius]}}
                      onCreated={state => state.gl.setClearColor(0x070707, clearColorOpacity)}>
                    <color attach="background" args={[colors.r3fCanvasBackground]} />

                    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
                        <torusGeometry args={[25, 0.1, 32, 256]} />
                        <meshStandardMaterial attach="material" color="white" transparent emissive="white" emissiveIntensity={0.1} />
                    </mesh>

                    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
                        <torusGeometry args={[20, 0.1, 32, 256]} />
                        <meshStandardMaterial attach="material" color="white" transparent emissive="white" emissiveIntensity={0.1} />
                    </mesh>

                    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
                        <torusGeometry args={[15, 0.1, 32, 256]} />
                        <meshStandardMaterial attach="material" color="white" transparent emissive="white" emissiveIntensity={0.1} />
                    </mesh>

                    {geometry && material &&
                        <group dispose={null} scale={[0.1,0.1,0.1]} rotation={[0, - Math.PI/2, 0]}>
                        <group rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                            <group position={[0, 0, -4]}>
                                <mesh geometry={geometry.JET_Material001_0.geometry} material={material}/>
                                <mesh geometry={geometry.JET_Material_0.geometry} material={material}/>
                            </group>
                        </group>
                        </group>
                    }

                    {
                    mrmPoints.map((el, i)=>{
                        const color = el.isHit ? "lime" : "hotpink"
                        const scale = el.isHit ? [0.15,0.15,0.15] : [0.08,0.08,0.08]
                        return(
                            <mesh
                                visible
                                position={[el.pos[1],-el.pos[2], el.pos[0]]}
                                rotation={[0, 0, 0]}
                                scale = {scale}
                            >
                            <sphereGeometry attach="geometry" args={[1, 16, 16]} />
                            <meshBasicMaterial attach="material" color={color} transparent />
                            </mesh>
                        )
                    })

                    }

                  <OrbitControls autoRotate={isRotate} autoRotateSpeed={1} onStart={() => setIsRotate(false)}/>

                  {(theme.palette.mode=="dark") &&
                  <EffectComposer>
                      <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={2} />
                      <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={1} />
                  </EffectComposer>
                  }
                  {/*<Stats />*/}
              </Canvas>
          }
        </Box>
      </Box>
      
    )
}

export default ShootDistribution
useGLTF.preload(droneGLTFPath)