import { Box, IconButton, Typography, useTheme, Grid, FormControl, InputLabel, MenuItem, Select, Button, Menu } from "@mui/material";
import Header from "./global/Header";
import React, { useEffect, useState, useRef } from "react"
import { tokens } from "../theme";
import { useCsvDataListStore } from "../Store"
import Histogram from "./ChartComponents/Histogram";
import DoubleHistogram from "./ChartComponents/DoubleHistogram";
import BattleStatsHeader from "./global/BattleStatsHeader";
import ShootDistribution from "./ChartComponents/ShootDistribution";
import VulnerabilityDistribution from "./ChartComponents/VulnerabilityDistribution";
import ProgressCircle from "./ChartComponents/ProgressCircle";
import HistogramRangeSlider from "./ChartComponents/HistogramRangeSlider";
import DataDescription from "./ChartComponents/DataDescription";

export const ShootingStatsContext = React.createContext()

const BattleStats = () =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const parentRef = useRef()
    const fileArr = useCsvDataListStore(state => state.fileArr)
    const [windowSize, setWindowSize] = useState([0,0])
    const [shootStats, setShootStats] = useState([])
    const altIconPath = import.meta.env.BASE_URL + "filterIcon/alt.png";
    const speedIconPath = import.meta.env.BASE_URL + "filterIcon/speed.png";
    const rangeIconPath = import.meta.env.BASE_URL + "filterIcon/range.png";
    const azimuthIconPath = import.meta.env.BASE_URL + "filterIcon/azimuth.png";
    const elevationIconPath = import.meta.env.BASE_URL + "filterIcon/elevation.png";
    const altTGTIconPath = import.meta.env.BASE_URL + "filterIcon/altTGT.png";
    const speedTGTIconPath = import.meta.env.BASE_URL + "filterIcon/speedTGT.png";

    useEffect(()=>{
        
        const drones = ["Blue1", "Blue2", "Red1", "Red2"]
        let mrmPointsTemp = []
        fileArr.forEach(element => {
            drones.forEach((drone)=>{
                element.stats[drone].shootData.forEach((mrmPoint)=>{
                    mrmPointsTemp.push(mrmPoint)
                })
            })
        });
        setShootStats(mrmPointsTemp)

        // This defines an event canvas parent box is resized
        if (!parentRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            setWindowSize([
                parentRef.current.clientWidth, 
                parentRef.current.clientHeight])
        });
        resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect(); // clean up 
    },[])
    

    return(
        <Box ml="20px" mr="20px" height="100%" display="flex" justifyContent="space-between" flexDirection="column" >
            <Box display="flex" alignItems="center">
                <Header title='BATTLE STATS' subtitle="Under Construction" />

                <Box ml="20px"flexGrow={1} display="flex" justifyContent="space-between">
                    <Box width="100%" display="flex" justifyContent="center" alignItems="center">

                    <BattleStatsHeader name="Blue"/>
                    <Typography variant="h4">VS</Typography>
                    <BattleStatsHeader name="Red"/>

                    </Box>
                </Box>
            </Box>
            
            {/* GRID & CHARTS */}
            <Box flex-grow="1" height="100%" overflow="hidden" ref={parentRef}>
                <Box sx={{width:"100%", height:"100%", overflow:"auto", overflowY: "scroll", padding: 2 }}>
                <Box
                display="grid"
                gridAutoRows="500px"
                //gridTemplateColumns="repeat(12, 1fr)"
                gridTemplateColumns="repeat(auto-fill, minmax(700px, 1fr))"
                gap="30px"
                >
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 1"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    >
                        <Box width="100%" mt={2} ml={2}  display="flex" flexDirection="row">
                            <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">Shooting Stats</Typography>
                        </Box>
                        <ShootingStatsContext.Provider value={[shootStats, setShootStats]}>
                        <Box display="grid"
                            gridAutoRows="auto"
                            gridTemplateColumns="repeat(9, 1fr)"
                            gap="0px"
                            width="100%"
                            p={2}>
                            
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>#Data</Typography>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>#Hits</Typography>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>Altitude</Typography>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>Speed</Typography>                       
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>Range</Typography>                        
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>Azimuth</Typography>                          
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>Elevation</Typography>                             
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>TGT Alt</Typography>                                
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <Typography color={colors.grey[100]}>TGT Speed</Typography>
                            </Box>
                            {/* Second Row */}
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <DataDescription type = "total"/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <DataDescription type = "hit"/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <img src={altIconPath} width={30} height={30}/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <img src={speedIconPath} height={20}/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <img src={rangeIconPath} height={20}/>  
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <img src={azimuthIconPath} height={40}/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <img src={elevationIconPath} height={40}/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <img src={altTGTIconPath} height={30}/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <img src={speedTGTIconPath} height={20}/>
                            </Box>
                            {/* Third Row */}
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <ProgressCircle type = "total"/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <ProgressCircle type = "hit"/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <HistogramRangeSlider width={80} height={40} id={0} data="alt" minValue={0} maxValue={15}/>
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <HistogramRangeSlider width={80} height={40} id={0} data="speed" minValue={0} maxValue={700}/>  
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <HistogramRangeSlider width={80} height={40} id={0} data="range" minValue={0} maxValue={50}/>  
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <HistogramRangeSlider width={80} height={40} id={0} data="azimuth" minValue={-180} maxValue={180}/>  
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <HistogramRangeSlider width={80} height={40} id={0} data="elevation" minValue={-180} maxValue={180}/>  
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <HistogramRangeSlider width={80} height={40} id={0} data="altTGT" minValue={0} maxValue={15}/>  
                            </Box>
                            <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                                <HistogramRangeSlider width={80} height={40} id={0} data="speedTGT" minValue={0} maxValue={700}/>  
                            </Box>
                        </Box>
                        <Box flex-grow="1" width="100%" height="100%" p={2}>
                            <ShootDistribution />
                        </Box>
                        </ShootingStatsContext.Provider>
                    </Box>
                
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <VulnerabilityDistribution />
                    </Box>
                
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <DoubleHistogram width={300} height={windowSize[1]/2*0.8} id={1}/>
                    </Box>
                
                
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <Histogram width={300} height={windowSize[1]/2*0.8} id={1}/>
                    </Box>

                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <Histogram width={300} height={windowSize[1]/2*0.8} id={2}/>
                    </Box>
                </Box> 
                </Box> 
            </Box> 
        </Box>
    )
}

export default BattleStats
