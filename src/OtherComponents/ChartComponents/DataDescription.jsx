import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { ShootingStatsContext } from '../BattleStats';
import { useEffect, useState, useRef, useContext } from "react"

const DataDescription = ({ size = "40", type = "hit"}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [shootStats, setShootStats] = useContext(ShootingStatsContext)
  const [ratio, setRatio] = useState([0,0])

  useEffect(()=>{
    let visibleData = 0 
    let hitData = 0
    shootStats.forEach((el, i)=>{
      if(el.isFiltered.alt && el.isFiltered.speed && el.isFiltered.range && el.isFiltered.azimuth && el.isFiltered.elevation && el.isFiltered.altTGT && el.isFiltered.speedTGT){
        visibleData = visibleData + 1
        if(el.isHit){
          hitData = hitData + 1
        }
      }
    })
    if(type=="hit"){
      if(visibleData==0){
        setRatio([0,0])
      }else{
        setRatio([hitData, visibleData])
      }
      
    }else if(type=="total"){
      setRatio([visibleData, shootStats.length])
    }
  },[shootStats])

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Typography color={colors.grey[100]}>{(type=="hit") ? "Hits: " + ratio[0] : "Filtered: " + ratio[0]}</Typography>   
      <Typography color={colors.grey[100]}>{"Out of: " + ratio[1]}</Typography>  
    </Box>
  );
};

export default DataDescription;