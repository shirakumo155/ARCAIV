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
                           <img src={fileArr[index].stats.Red1.isAlive ? "./images/img/IconDroneRed.png" : "../images/img/IconDroneRedEdge.png"} width="40" height="40" />  
                           <Box display="flex">
                                <img src={fileArr[index].stats.Red1.mrm[0]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red1.mrm[1]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red1.mrm[2]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red1.mrm[3]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                           </Box>
                        </Box>
                        
                        <Box display="flex" flexDirection="column" alignItems="center">
                           <img src={fileArr[index].stats.Red2.isAlive ? "../images/img/IconDroneRed.png" : "../images/img/IconDroneRedEdge.png"} width="40" height="40" />  
                           <Box display="flex">
                                <img src={fileArr[index].stats.Red2.mrm[0]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red2.mrm[1]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red2.mrm[2]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                <img src={fileArr[index].stats.Red2.mrm[3]==1 ? "../images/img/IconMissileRed.png" : "../images/img/IconMissileGray.png"} width="10" height="20" />  
                           </Box>
                        </Box>
                    </Box>

                    <Thumbnail w={100} h={100} imgSize={15} pos={fileArr[index].stats}/>

                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly" width="20%" height="100%">
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <img src={fileArr[index].stats.Blue1.isAlive ? "../images/img/IconDroneBlue.png" : "../images/img/IconDroneBlueEdge.png"} width="40" height="40" /> 
                                <Box display="flex">
                                    <img src={fileArr[index].stats.Blue1.mrm[0]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue1.mrm[1]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue1.mrm[2]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue1.mrm[3]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                </Box>
                           </Box>
                           <Box display="flex" flexDirection="column" alignItems="center">
                                <img src={fileArr[index].stats.Blue2.isAlive ? "../images/img/IconDroneBlue.png" : "../images/img/IconDroneBlueEdge.png"} width="40" height="40" /> 
                                <Box display="flex">
                                    <img src={fileArr[index].stats.Blue2.mrm[0]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue2.mrm[1]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue2.mrm[2]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                    <img src={fileArr[index].stats.Blue2.mrm[3]==1 ? "../images/img/IconMissileBlue.png" : "../images/img/IconMissileGray.png"} width="10" height="20" /> 
                                </Box>
                           </Box>
                    </Box>
                   
                </Box>
                
                
                <StatsBar name="Hit" valueB={fileArr[index].stats.HitRatioBlue*100} valueR={fileArr[index].stats.HitRatioRed*100} />
                <StatsBar name="Avoidance" valueB={40} valueR={60} />
                
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