import * as THREE from 'three';
import {Canvas} from "@react-three/fiber"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState, useRef, useContext } from "react"
import { OrbitControls, Sphere, useGLTF  } from "@react-three/drei"
import { useBattleStatsStore} from "../../Store"

const DroneColor = new THREE.Color(0x1598d5)
const DroneColorEmission = new THREE.Color(0xE0E0E0)
const DroneColorEmissionLight = new THREE.Color(0x6e6e6e)
const droneGLTFPath = import.meta.env.BASE_URL + "gltf/drone.glb"
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const clearColorOpacity = 0.5
const initialCamRadius = 50
const initialCamHeight = 40

function updateShootStats(hoveredObj){
    const shootStatsArr = useBattleStatsStore.getState().shootStatsArr
    let shootStatsTemp = []
    shootStatsArr.forEach((el, i) => {
        let elementTemp = el
        elementTemp.isHovered = false
        if(i==hoveredObj.index){
            elementTemp.isHovered = hoveredObj.isHovered
        }
        shootStatsTemp.push(elementTemp)
    });
    useBattleStatsStore.setState({shootStatsArr : shootStatsTemp})
}

const ShootDistribution = (props)=>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const [geometry, setGeometry] = useState(null)
    const [material, setMaterial] = useState(null)
    const [isRotate, setIsRotate] = useState(true)
    //const ref = useRef(useBattleStatsStore.getState().shootStatsArr)
    const shootStatsArr = useBattleStatsStore(state => state.shootStatsArr); 
    const [hoveredObj, setHoveredObj] = useState([])

    useEffect(() => {
        const { nodes, _ } = useGLTF(droneGLTFPath);
        const Material = new THREE.MeshStandardMaterial({
            transparent: true, 
            opacity: 0.85 }); 

        Material.color = DroneColor;
        Material.emissive = DroneColorEmission; 
        Material.emissiveIntensity = 0.5
        
        setGeometry(nodes)
        setMaterial(Material)

        //useBattleStatsStore.subscribe(
        //    state => (ref.current = state.shootStatsArr))
    },[])  
    

    useEffect(()=>{
         
        if(theme.palette.mode=="dark"){
            const Material = new THREE.MeshStandardMaterial({
            transparent: true, 
            }); 
            Material.color = DroneColor;
            Material.emissive = DroneColorEmission; 
            Material.emissiveIntensity = 0.5 
  
            setMaterial(Material)
        }else if(theme.palette.mode=="light"){
            const Material = new THREE.MeshBasicMaterial({});
            
            Material.color = DroneColorEmissionLight;
            Material.opacity = 1
           
            setMaterial(Material)
        }
        
    },[theme.palette.mode])

    useEffect(() => {
        if(Object.keys(hoveredObj).length == 0){
            return
        }
        document.body.style.cursor = hoveredObj.isHovered ? 'pointer' : 'auto'
        updateShootStats(hoveredObj)
      }, [hoveredObj])
  
    return(
        <Box position="relative" width={props.width} height={props.height} overflow="hidden" >
          {
              // If you have data, then render a scene 
              <Canvas 
                    camera={
                      {fov: 45, aspect: windowWidth / windowHeight, near: 0.1, far: 1000, position: [0, initialCamHeight, initialCamRadius]}}
                      onCreated={state => state.gl.setClearColor(0x070707, clearColorOpacity)}>
                    <color attach="background" args={[colors.r3fCanvasBackground]} />

                    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
                        <torusGeometry args={[30, 0.1, 32, 256]} />
                        <meshStandardMaterial attach="material" color="white" transparent emissive="white" emissiveIntensity={0.1} />
                    </mesh>

                    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
                        <torusGeometry args={[20, 0.1, 32, 256]} />
                        <meshStandardMaterial attach="material" color="white" transparent emissive="white" emissiveIntensity={0.1} />
                    </mesh>

                    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
                        <torusGeometry args={[10, 0.1, 32, 256]} />
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
                    shootStatsArr.length!==0 &&   
                    shootStatsArr.map((el, i)=>{
                        let color
                        let scale
                        if(theme.palette.mode=="dark"){
                            color = el.isHit ? "lime" : "hotpink"
                            scale = el.isHit ? [0.15,0.15,0.15] : [0.08,0.08,0.08]
                            scale = el.isHovered ? [0.5,0.5,0.5] : scale
                        }else{
                            color = el.isHit ? "lime" : "hotpink"
                            scale = el.isHit ? [0.5,0.5,0.5] : [0.35,0.35,0.35]
                            scale = el.isHovered ? [0.5,0.5,0.5] : scale
                        }
                        return(
                            <mesh
                                visible={el.isFiltered.alt && el.isFiltered.speed && el.isFiltered.range && el.isFiltered.azimuth && el.isFiltered.elevation && el.isFiltered.altTGT && el.isFiltered.speedTGT}
                                position={[el.pos[1],-el.pos[2], el.pos[0]]}
                                rotation={[0, 0, 0]}
                                scale = {scale}
                                key = {"shoot"+i}
                                onPointerOver={() => {
                                    setHoveredObj({isHovered: true, element: el, index: i})
                                }}
                                onPointerOut={() => {setHoveredObj({isHovered: false, element: el, index: i})}}
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
      
    )
}

export default ShootDistribution
useGLTF.preload(droneGLTFPath)