import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState, useRef, useContext } from "react"
import { useBattleStatsStore} from "../../Store"

const DataDescription = ({ size = "40", type = "hit", ContextType="shoot"}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //const shootStatsArr = ContextType=="shoot" ? useBattleStatsStore(state => state.shootStatsArr) : useBattleStatsStore(state => state.vulStatsArr)
  const [ratio, setRatio] = useState([0,0])
  const ref = ContextType=="shoot" ? useRef(useBattleStatsStore.getState().shootStatsArr) : useRef(useBattleStatsStore.getState().vulStatsArr)

  useEffect(() => {
    useBattleStatsStore.subscribe(
    state => (ref.current = ContextType=="shoot" ? state.shootStatsArr : state.vulStatsArr))
  }, [])
  
  useEffect(()=>{
    let visibleData = 0 
    let hitData = 0
    ref.current.forEach((el, i)=>{
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
      setRatio([visibleData, ref.current.length])
    }
  },[ref.current])

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Typography color={colors.grey[100]}>{(type=="hit") ? "Hits: " + ratio[0] : "Filtered: " + ratio[0]}</Typography>   
      <Typography color={colors.grey[100]}>{"Out of: " + ratio[1]}</Typography>  
    </Box>
  );
};

export default DataDescription;