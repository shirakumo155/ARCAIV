import {Canvas} from "@react-three/fiber"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useCsvDataListStore } from "../Store"
import { useCsvDataStore } from "../Store"
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "./global/Header";
import { useEffect, useState, useRef } from "react"
import Card from "./videoComponents/Card";
import Scene from "../SceneComponents/Scene"
import Resizable, {csvToArr, readUploadedFileAsText, analyzeMiscData } from '../Utils'
import screenfull from 'screenfull';
import ControlIcons from "./videoLayerComponents/ControlIcons";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import InfoLayer from "./videoLayerComponents/InfoLayer"
import SideTable from "./videoLayerComponents/SideTable"
import TimeLine from "./videoLayerComponents/TimeLine"
import { Stats } from '@react-three/drei'
import '../styles.css'

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const clearColorOpacity = 0.5
const initialCamRadius = 80
const initialCamHeight = 40

const LoadingPage = (props)=>{
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return(
    <Box ref={props.LoadingBoxRef} position="absolute" top={0} left={0} bottom={0} right={0} overflow="hidden" 
    sx={{pointerEvents: "none", transition: 'opacity 0.28s', opacity: 0, backgroundColor: colors.loadingBackground}}>
      <Box display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center"  
            width="100%" 
            height="100%">
      <Typography variant="h2" color={colors.grey[100]} >
        Loading
      </Typography>
      </Box>
    </Box>
  )
}

const CardsView = (props)=>{
  return(
    <Box sx={{width:"100%", overflow:"auto", overflowY: "scroll", padding: 2 }}>
        <Box
        display="grid"
        gridAutoRows="320px"
        gridTemplateColumns="repeat(auto-fill, minmax(500px, 1fr))"
        gap="30px"
        >
          {props.cards}
        </Box> 
    </Box>
  )
}

const VideoView = (props)=>{
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const playerDivRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [timeLineHeight, setTimeLineHeight] = useState(250);

  const handleFullScreenMode = () => {
    screenfull.toggle(playerDivRef.current)
    setIsFullScreen(!isFullScreen)
  } 


  return(
    <Box 
      height="100%" 
      width="100%" 
      overflow="hidden" 
      display="flex" 
      flexDirection="column" >
    <Box 
      position="relative" 
      width="100%" 
      flexGrow={1}
      overflow="hidden" 
      display="flex" 
      flexDirection="row" >
      
      <SideTable team="Red"/>
      
      <Box position="relative" flex-grow="1" width="100%" overflow="hidden" ref={playerDivRef} >
        {
            // If you have data, then render a scene 
            <Canvas 
                camera={
                    {fov: 45, aspect: windowWidth / windowHeight, near: 0.1, far: 1000, position: [0, initialCamHeight, initialCamRadius]}}
                    onCreated={state => state.gl.setClearColor(0x070707, clearColorOpacity)}>
                <color attach="background" args={[colors.r3fCanvasBackground]} />
                <Scene />
                {(theme.palette.mode=="dark") &&
                <EffectComposer>
                    <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={2} />
                    <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={1} />
                </EffectComposer>
                }
                {/*<Stats />*/}
            </Canvas>
        }
        {
            isFullScreen &&
            <ControlIcons fullScreenMode={handleFullScreenMode} />
        }
        
        <InfoLayer />
        
        <Box sx={{position: "absolute", top: 0, right: 0}}>
          <IconButton className='close_icon' aria-label='reqind' onClick={props.handlePlayerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      
      <SideTable team="Blue"/>
      
      
    </Box>
      {
        useCsvDataStore.getState().data[0] &&
        <Resizable className="ResiableBox" direction="vertical">
          <TimeLine fullScreenMode={handleFullScreenMode} />
        </Resizable>
      }
    </Box>
    
  )
}



export default function Videos() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const loadingPageRef = useRef(null);
  const fileArr = useCsvDataListStore(state => state.fileArr);
  const [videoItems, setVideoItems] = useState([])
  const setFileName = useCsvDataStore((state)=>(state.setFileName))
  const updateData = useCsvDataStore((state)=>(state.setData))
  const updateDataLength = useCsvDataStore((state)=>(state.setLength))
  const resetData = useCsvDataStore((state)=>(state.resetData))
  const resetTime = useCsvDataStore((state)=>(state.resetTime))
  const resetTimeHUD = useCsvDataStore((state)=>(state.resetTimeHUD))
  const resetIndex = useCsvDataStore((state)=>(state.resetIndex))
  const [isPlaying, setIsplaying] = useState(false)
  

  useEffect(()=>{
    setVideoItems(fileArr)
  },[])

  
  const handleOnClicked = async (index) => {
    loadingPageRef.current.style.opacity=1
    setFileName(videoItems[index])
    resetData()
    resetTime()
    resetTimeHUD()
    resetIndex()
    const csvfile = videoItems[index]
    if (!csvfile) return alert("Enter a valid file")
    // reset useCsvDataStore.data
    
    const fileContents = await readUploadedFileAsText(csvfile)  

    // add AOA, Vt, Beta, G, Mach
    const csvData = analyzeMiscData(csvToArr(fileContents, ","))
    updateData(csvData)
    updateDataLength(csvData.length)
    setIsplaying(true)
    loadingPageRef.current.style.opacity=0
  } 

  const handlePlayerClose = () => {
    resetData()
    resetTime()
    resetTimeHUD()
    resetIndex()
    setIsplaying(false)
  } 

  const cards = videoItems.map((item, i) => {
    return (
        <Card 
            key={item.name}
            file={item}
            index={i}
            handleOnClicked={handleOnClicked}
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="center"
        />
    )
  })  


  return (
    <>
      <Box pl={2} pr={2} pb={0} pt={isPlaying ? 2 : 0} height="100%" display="flex" flexDirection="column" alignItems="center" >
            {!isPlaying &&
            <Box ml={4} width="100%" display="flex" justifyContent="space-between" alignItems="center">
                <Header title='VIDEOS' subtitle="Click an imported item to see its video" />
            </Box>
            }
            {videoItems.length==0 && 
            <Box
                width="100%"
                flexGrow={1}
                display="flex"
                justifyContent="center" 
                alignItems="center">
            <Typography variant="h4" color={colors.grey[100]} >
              Please import your log files
            </Typography>
            </Box>
              }
            <Box position="relative" flex-grow="1" height="100%" width="100%" overflow="hidden" display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" >
              {videoItems.length!==0 && !isPlaying && 
                <CardsView cards={cards} />
              } 
              {videoItems.length!==0 && !isPlaying && 
                <LoadingPage LoadingBoxRef={loadingPageRef} />
              }
              {videoItems.length!==0 && isPlaying &&
                <VideoView  handlePlayerClose={handlePlayerClose}/>
              }  
            </Box>
      </Box>
    </>
)
}

