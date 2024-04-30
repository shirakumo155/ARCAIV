import React from "react";
import { useEffect, useState, useRef } from "react"
import "./ControlIcons.css";
import { useCsvDataStore } from "../../Store"
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { PlayArrowSharp, PauseSharp, Opacity } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { Fullscreen } from "@mui/icons-material";
import Popover from '@mui/material/Popover';
import { TimeFormat } from "../../Utils";

const ControlIcons = ({fullScreenMode, onSeek, played, onSeekMouseUp, onSeekMouseDown, fullMovieTime, playedTime}) => {
    const fileName = useCsvDataStore(state => state.filename).name;
    const time = useCsvDataStore(state => state.time);
    const setTime = useCsvDataStore((state) => (state.setTime));
    const setTimeHUD = useCsvDataStore((state) => (state.setTimeHUD));
    const animationSpeed = useCsvDataStore(state => state.animationSpeed);
    const setAnimationSpeed = useCsvDataStore(state => state.setAnimationSpeed);
    const [anchorEl, setAnchorEl] = useState(null);
    const isPaused = useCsvDataStore(state => state.isPaused);
    const setIsPaused = useCsvDataStore((state) => (state.setIsPaused));
    const [showCntl, setShowCntl] = useState(false);
    const [info, setInfo] = useState(true);
    const dataLength = useCsvDataStore.getState().dataLength
    const refCntr = useRef()

    useEffect(()=>{
      if(showCntl){
        refCntr.current.style.opacity= 1
      }else{
        refCntr.current.style.opacity = 0
      }
      
    },[showCntl])

    const handleMouseEnter = () => {
      setShowCntl(true)
    }

    const handleMouseLeave = () => {
      setShowCntl(false)
    }

    const handlePlayAndPause = () => {
      setIsPaused(!isPaused)
    }

    const handlePopOver = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInfoChange = () => {
      setInfo(!info)
      console.log('changed')
  };

  const handleSliderChange = (e, newValue) => {
    setTime(parseFloat(newValue/100))
    setTimeHUD(parseFloat(newValue/100))
  }

  const handlePlaySpeed = (rate) => {
    setAnimationSpeed(rate)
  }

    const open = Boolean(anchorEl);
    const id = open ? 'playbackrate-popover' : undefined;


  return (
    <div className="controls__div" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
      {/* Bottom Segment */}
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "16px", transition: 'opacity 0.28s', opacity: 0 }}
        ref={refCntr}
      >
        <Grid item>
          <Typography variant="h7" sx={{ color: "white"}} >
            {fileName}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Slider 
            min={0} 
            max={100}
            step={0.1}
            value={time*100}
            onChange={handleSliderChange} 
            aria-label="Small"
            sx={{
              display: showCntl,
              height: 5,
              '& .MuiSlider-track': {
                border: 'none',
                color: "#d3d3d3",
                opacity: 0.6
              },
              '& .MuiSlider-thumb': {
                height: 16,
                width: 16,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'inherit',
                },
                '&:before': {
                  display: 'none',
                },
              }}}
          />
          <Grid container direction='row' justifyContent='space-between'>
            <Typography variant='h7' sx={{color:'white'}}>{TimeFormat((time*dataLength*0.05).toFixed())}</Typography>
            <Typography variant='h7' sx={{color:'white'}}>{TimeFormat((dataLength*0.05).toFixed())}</Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" direction="row">
            <IconButton className='controls__icons' aria-label='reqind' onClick={handlePlayAndPause}>
                    {
                      isPaused ? (
                        <PlayArrowSharp fontSize='large' sx={{color:'white'}}/>
                      ) : (
                        <PauseSharp fontSize='large' sx={{color:'white'}}/>
                      )
                    }
            </IconButton>
          </Grid>
        </Grid>

        <Grid item>
        <Grid container alignItems="center" direction="row">
            <Typography style={{ color: "#fff", marginRight: "15px" }}>
              Info
            </Typography>

            <FormControlLabel control={<Switch checked={info} onChange={handleInfoChange} />} style={{ marginRight: "0px" }}/>

          <Button variant='text' onClick={handlePopOver} className='bottom__icons'>
              <Typography style={{ color: "#fff"}}>{animationSpeed}X</Typography>
          </Button>

          <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
              }}
              transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
              }}
          >
              <Grid container direction='column-reverse'>
              {
                  [0.25,0.5,1,1.5,2].map((rate, i) => (
                  <Button variant='text' onClick={() => handlePlaySpeed(rate)} key={i} 
                    sx={{'&:hover': {
                      opacity: 0.5,
                  }}}>
                      <Typography color={rate === animationSpeed ? 'secondary' : '#d3d3d3'}>{rate}</Typography>
                  </Button>
                  ))
              }
              </Grid>
                
            </Popover>
            
            <IconButton className='bottom__icons' onClick={fullScreenMode}>
                <Fullscreen fontSize='large' style={{ color: "white" }}/>
            </IconButton>
            </Grid>
            </Grid>
      </Grid>
    </div>
  );
};

export default ControlIcons;