import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useCsvDataStore } from "../../Store"
import React, { useEffect, useRef, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import { compressNormals } from "three/examples/jsm/utils/GeometryCompressionUtils.js";
import TableItem from "./TableItem";



const SideTable = ({ team }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const file = useCsvDataStore(state => state.filename)
    const time = useCsvDataStore(state => state.time)
    const dataLength = useCsvDataStore.getState().dataLength
    const refScoreTeam = useRef()
    const [backgroundColor, setBackgroundColor] = useState()
    const [fontColor, setFontColor] = useState()

    useEffect(()=>{
        team=="Blue" ?  setBackgroundColor(colors.SideTableBlue) : setBackgroundColor(colors.SideTableRed)
        team=="Blue" ?  setFontColor(colors.BlueFont) : setFontColor(colors.RedFont)
    },[theme])

    useEffect(()=>{
        let index = (time * dataLength).toFixed() - 1 
        index = Math.min(Math.max(index, 0), dataLength-1);
        if(team=="Blue"){
            refScoreTeam.current.textContent = (file.stats.Blue1.scoreHist[index] + file.stats.Blue2.scoreHist[index]).toFixed(2).toString()
        }else{
            refScoreTeam.current.textContent = (file.stats.Red1.scoreHist[index] + file.stats.Red2.scoreHist[index]).toFixed(2).toString()
        }
    },[time])

    return (
        <Box  height="100%" width="20%" display="flex" flexDirection="column" alignItems="center" sx={{background: backgroundColor}}>
            <Box mt={2} mb={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Box>
                    {team=="Blue" ? 
                    <Typography variant="h2" color={fontColor} fontWeight="bold">{file.nameB}</Typography>:
                    <Typography variant="h2" color={fontColor} fontWeight="bold">{file.nameR}</Typography> }
                </Box>
                <Box>
                    <Typography variant="h4"  fontWeight="bold" color={fontColor} ref={refScoreTeam}></Typography>
                </Box>
            </Box>
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                sx={{overflow:"auto", 
                overflowY: "scroll", 
                MsOverflowStyle: "none", 
                scrollbarWidth: "none"}}>
    
                <TableItem team={team} index={1}/>
                <TableItem team={team} index={2}/>            
                
            </Box>

            
        </Box>
    );
};
  
export default SideTable;