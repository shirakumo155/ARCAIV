import {Canvas} from "@react-three/fiber"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import React from "react"
import { useEffect, useState } from "react"
import { Box, Button, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";
import StatsBar from "./StatsBar"
import HeaderCard from "./HeaderCard"
import Thumbnail from "./Thumbnail";
import { useCsvDataListStore } from "../../Store"
import {csvToArr, readUploadedFileAsText, getBattleStats} from '../../Utils'


export default function Card(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fileArr = useCsvDataListStore(state => state.fileArr);
    const index = props.index
    const [droneRedAlivePath, setDroneRedAlivePath] = useState(import.meta.env.BASE_URL + "img/IconDroneRed.png")
    const [droneRedNotAlivePath, setRedNotAlivePath] = useState(import.meta.env.BASE_URL + "img/IconDroneRedEdge.png")
    const [droneBlueAlivePath, setDroneBlueAlivePath] = useState(import.meta.env.BASE_URL + "img/IconDroneBlue.png")
    const [droneBlueNotAlivePath, setDroneBlueNotAlivePath] = useState(import.meta.env.BASE_URL + "img/IconDroneBlueEdge.png")
    const [mrmRedPath, setMrmRedPath] = useState(import.meta.env.BASE_URL + "img/IconMissileRed.png")
    const [mrmBluePath, setMrmBluePath]  = useState(import.meta.env.BASE_URL + "img/IconMissileBlue.png")
    const mrmGrayPath = import.meta.env.BASE_URL + "img/IconMissileGray.png"

    useEffect(()=>{
        if(theme.palette.mode=="light"){
            setDroneRedAlivePath(import.meta.env.BASE_URL + "img/IconDroneRedLight.png")
            setDroneBlueAlivePath(import.meta.env.BASE_URL + "img/IconDroneBlueLight.png")
            setMrmRedPath(import.meta.env.BASE_URL + "img/IconMissileRedLight.png")
            setMrmBluePath(import.meta.env.BASE_URL + "img/IconMissileBlueLight.png")
            setRedNotAlivePath(import.meta.env.BASE_URL + "img/IconDroneRedEdgeLight.png")
            setDroneBlueNotAlivePath(import.meta.env.BASE_URL + "img/IconDroneBlueEdgeLight.png")
        }else{
            setDroneRedAlivePath(import.meta.env.BASE_URL + "img/IconDroneRed.png")
            setDroneBlueAlivePath(import.meta.env.BASE_URL + "img/IconDroneBlue.png")
            setMrmRedPath(import.meta.env.BASE_URL + "img/IconMissileRed.png")
            setMrmBluePath(import.meta.env.BASE_URL + "img/IconMissileBlue.png")
            setRedNotAlivePath(import.meta.env.BASE_URL + "img/IconDroneRedEdge.png")
            setDroneBlueNotAlivePath(import.meta.env.BASE_URL + "img/IconDroneBlueEdge.png")
            
        }
    },[theme])
    
    return (
        <>
            <Box className="card" 
            padding={5} 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            borderRadius="10px" 
            sx={{cursor: "pointer", '&:hover': {
                opacity: 0.7
                },
                background: colors.primary[400],
            }}
            onClick={() => props.handleOnClicked(index) }>
                {!fileArr[index] &&
                <Typography variant="h4" color={colors.grey[100]} >
                Loading
                </Typography>
                }
                {fileArr[index] &&
                <>
                <HeaderCard 
                    time={fileArr[index].stats.missionTime}
                    blueName={fileArr[index].nameB} 
                    redName={fileArr[index].nameR} 
                    blueScore={fileArr[index].stats.scoreBlue.toFixed(2)} 
                    redScore={fileArr[index].stats.scoreRed.toFixed(2)}/>

                <Box display="flex" justifyContent="space-evenly" width="100%" alignItems="center">
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly" width="20%" height="100%">
                        <Box display="flex" flexDirection="column" alignItems="center">
                           <img src={fileArr[index].stats.Red1.isAlive ? droneRedAlivePath : droneRedNotAlivePath} width="40" height="40" />  
                           <Box display="flex">
                                <img src={fileArr[index].stats.Red1.mrm[0]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red1.mrm[1]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red1.mrm[2]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red1.mrm[3]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" /> 
                           </Box>
                        </Box>
                        
                        <Box display="flex" flexDirection="column" alignItems="center">
                           <img src={fileArr[index].stats.Red2.isAlive ? droneRedAlivePath : droneRedNotAlivePath} width="40" height="40" />  
                           <Box display="flex">
                                <img src={fileArr[index].stats.Red2.mrm[0]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red2.mrm[1]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red2.mrm[2]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red2.mrm[3]==1 ? mrmRedPath : mrmGrayPath} width="10" height="20" />  
                           </Box>
                        </Box>
                    </Box>

                    <Thumbnail w={100} h={100} imgSize={15} pos={fileArr[index].stats}/>

                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly" width="20%" height="100%">
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <img src={fileArr[index].stats.Blue1.isAlive ? droneBlueAlivePath : droneBlueNotAlivePath} width="40" height="40" /> 
                                <Box display="flex">
                                    <img src={fileArr[index].stats.Blue1.mrm[0]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue1.mrm[1]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue1.mrm[2]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue1.mrm[3]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                </Box>
                           </Box>
                           <Box display="flex" flexDirection="column" alignItems="center">
                                <img src={fileArr[index].stats.Blue2.isAlive ? droneBlueAlivePath : droneBlueNotAlivePath} width="40" height="40" /> 
                                <Box display="flex">
                                    <img src={fileArr[index].stats.Blue2.mrm[0]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue2.mrm[1]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue2.mrm[2]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue2.mrm[3]==1 ? mrmBluePath : mrmGrayPath} width="10" height="20" /> 
                                </Box>
                           </Box>
                    </Box>
                   
                </Box>
                
                
                <StatsBar name="Hit" valueB={fileArr[index].stats.HitRatioBlue*100} valueR={fileArr[index].stats.HitRatioRed*100} />
                
                <Typography variant="h5" color={colors.grey[100]} mt={1.5}>
                File Name
                </Typography>
                <Typography variant="h7" color={colors.grey[100]}>
                {props.file.name}
                </Typography>
                </>
                }
                
            </Box> 
        </>
    )
}