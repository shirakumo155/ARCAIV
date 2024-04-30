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
          transform: "rotate(180deg)",
          backgroundColor: colors.grey[100],
          '& .MuiLinearProgress-bar': {
          backgroundColor: '#3399FF'
        }}}/>
    } else {
        return <LinearProgress variant="determinate" value={progress} 
        sx={{
          boxShadow: 3,
          backgroundColor: colors.grey[100],
          '& .MuiLinearProgress-bar': {
          backgroundColor: '#FF007F'
       }}}/>
    }
}

  return(
    <ProgressBar />
    
  )
}
  