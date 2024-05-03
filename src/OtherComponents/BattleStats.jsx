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


const BattleStats = () =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const parentRef = useRef()
    const [windowSize, setWindowSize] = useState([0,0])

    useEffect(()=>{

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
            <Box flex-grow="1" height="100%" overflow="hidden"ref={parentRef}>
                <Box
                display="grid"
                gridAutoRows={windowSize[1]/2}
                gridTemplateColumns="repeat(12, 1fr)"
                gap="30px"
                >
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 6"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <ShootDistribution />
                    </Box>
                
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 6"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <VulnerabilityDistribution />
                    </Box>
                
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 4"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <DoubleHistogram width={300} height={windowSize[1]/2*0.8} id={1}/>
                    </Box>
                
                
                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 4"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <Histogram width={300} height={windowSize[1]/2*0.8} id={1}/>
                    </Box>

                    <Box
                    backgroundColor={colors.primary[400]}
                    gridColumn="span 4"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                        <Histogram width={300} height={windowSize[1]/2*0.8} id={2}/>
                    </Box>
                </Box> 
            </Box> 
        </Box>
    )
}

export default BattleStats
