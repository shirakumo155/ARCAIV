import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState, useRef, useContext } from "react"
import { useBattleStatsStore } from "../../Store"

const ProgressCircle = ({ size = "45", type = "hit", ContextType="shoot"}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [angle, setAngle] = useState(0)
  const [ratio, setRatio] = useState(0)
  //const ref = ContextType=="shoot" ? useRef(useBattleStatsStore.getState().shootStatsArr) : useRef(useBattleStatsStore.getState().vulStatsArr)
  const shootStatsArr = ContextType=="shoot" ? useBattleStatsStore(state => state.shootStatsArr) : useBattleStatsStore(state => state.vulStatsArr)
  useEffect(() => {
    //useBattleStatsStore.subscribe(
    //state => (ref.current = ContextType=="shoot" ? state.shootStatsArr : state.vulStatsArr))
  }, [])


  useEffect(()=>{
    let visibleData = 0 
    let hitData = 0
    shootStatsArr.forEach((el, i)=>{
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
      setAngle(visibleData/shootStatsArr.length * 360)
      setRatio((visibleData/shootStatsArr.length*100).toFixed(1))
    }
  },[shootStatsArr])

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