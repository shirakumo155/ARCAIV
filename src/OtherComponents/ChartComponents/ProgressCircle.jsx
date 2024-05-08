import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { ShootingStatsContext } from '../BattleStats';
import { useEffect, useState, useRef, useContext } from "react"

const ProgressCircle = ({ size = "45", type = "hit"}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [shootStats, setShootStats] = useContext(ShootingStatsContext)
  const [angle, setAngle] = useState(0)
  const [ratio, setRatio] = useState(0)

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
        setAngle(0)
        setRatio(0)
      }else{
        setAngle(hitData/visibleData * 360)
        setRatio((hitData/visibleData*100).toFixed(1))
      }
      
    }else if(type=="total"){
      setAngle(visibleData/shootStats.length * 360)
      setRatio((visibleData/shootStats.length*100).toFixed(1))
    }
  },[shootStats])

  return (
    <Box position ="relative">
      <Box
        sx={{
          background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
              conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
              ${colors.greenAccent[500]}`,
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      <Box position ="absolute" top={0} bottom={0} left={0} right={0} display="flex" justifyContent="center" alignItems="center">
        <Typography color={colors.grey[100]} fontWeight="bold">{ratio + "%"}</Typography>
      </Box>
    </Box>
  );
};

export default ProgressCircle;