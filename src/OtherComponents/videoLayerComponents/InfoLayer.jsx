import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HUDcanvas from "../HUD/HUDcanvas";
import VideocamIcon from '@mui/icons-material/Videocam';
import { IconButton } from "@mui/material";
import { useCsvDataStore } from "../../Store"
import React, { useEffect, useRef } from "react"
import MiniMap from "./MiniMap";


const InfoLayer = ({ title, subtitle }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const timeHUD = useCsvDataStore(state => state.timeHUD)
  const dataLength = useCsvDataStore.getState().dataLength
  const duration = 300

  let index = (timeHUD * dataLength).toFixed() - 1 
  index = Math.min(Math.max(index, 0), dataLength-1);
  let eventLogFiltered = useCsvDataStore.getState().filename.stats.eventLog.filter((el,i)=> (i<=index)&&(i>(index-duration))&&(el.length!==0)).flat()
  
  return (
    <Box position="absolute" top={0} bottom={0} left ={0} right={0} 
      sx={{pointerEvents: "none",
      background: (theme.palette.mode=="dark") ? "linear-gradient(270deg, rgba(16,32,96,0.35), rgba(16,16,32,0.35) 36%, rgba(16,16,32,0.08) 40%, rgba(16,16,32,0.08) 60%, rgba(244,0,0,0.08) 80%, rgba(244,0,0,0.15) 100%)" : ""}}>
      <Box display="flex" justifyContent="center" flexDirection="column" p={1}>
      {eventLogFiltered.map((el,i)=>{
          return (
              <Typography variant="h7" color={colors.grey[100]} textAlign="center">{el}</Typography>
          )
      })}
      </Box>
      <Box position="absolute" width="100%" bottom={10} >
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <MiniMap w={100} h={100} bkColor="rgba(0,0,0,0.1)"/>
        </Box>
      </Box>
    </Box>
  );
};
  
  export default InfoLayer;