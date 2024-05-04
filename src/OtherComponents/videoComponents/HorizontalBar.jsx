import * as React from 'react';
import { LinearProgress } from '@mui/material';
import { useEffect, useState, useRef } from "react"
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

export default function HorizontalBar(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [progress, setProgress] = useState(props.value);

  useEffect(() => {
    setProgress(props.value)
  }, []);

  const ProgressBar = () => {
    if (props.team == "blue") {
        return <LinearProgress variant="determinate" value={progress} 
        sx={{
          boxShadow: 3,
          backgroundColor: colors.grey[700],
          '& .MuiLinearProgress-bar': {
          backgroundColor: colors.BlueAsset
        }}}/>
    } else {
        return <LinearProgress variant="determinate" value={progress} 
        sx={{
          boxShadow: 3,
          backgroundColor: colors.grey[700],
          transform: "rotate(180deg)",
          '& .MuiLinearProgress-bar': {
          backgroundColor: colors.RedAsset
       }}}/>
    }
}

  return(
    <ProgressBar />
    
  )
}
  