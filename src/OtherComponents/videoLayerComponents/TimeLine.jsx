import React from "react";
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useCsvDataStore } from "../../Store"
import { useTimeLineStateStore } from "../../Store"
import { Box, Grid, Typography, Button, IconButton, useTheme} from "@mui/material";
import { PlayArrowSharp, PauseSharp, Opacity } from "@mui/icons-material";
import { Fullscreen } from "@mui/icons-material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Popover from '@mui/material/Popover';
import { tokens } from "../../theme";
import { TimeFormat } from "../../Utils";
import Slider from "@mui/material/Slider";

const ListComponent = ({items, bColor, itemHeight}) => {
    const setTimeLineState = useTimeLineStateStore((state) => state.setTimeLineState); 
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleOnClicked = (buttonName) => (event) => {
        let newItems = items.slice();
        items.forEach((item, i)=>{
            // if Missiles
            if(item.length>0){
                // scan all missiles
                item.forEach((itemChild, i2)=>{
                    if(itemChild.name == buttonName){
                        newItems[i][i2].isColapsed = !(itemChild.isColapsed)
                    } 
                })
            }else{
                // scan all drones
                if(item.name == buttonName){
                    newItems[i].isColapsed = !(item.isColapsed)

                    newItems[i+1].map((el)=>{
                        if(el.display == "flex"){
                            el.display = "none"
                        }else{
                            el.display = "flex"
                        }
                       
                    }) 
                    
                } 
            }
            
        })
        setTimeLineState(newItems)
    }

    return(
        <Box>
        {
            items.map((item, index) =>
            (item.length) ?
                <Box >
                    {item.map((itemChild, index2) =>
                    <Box height={itemHeight} display={itemChild.display} sx={{ borderBottom: 2, borderBottomColor: bColor}} >
                        <Button onClick={handleOnClicked(itemChild.name)} sx={{paddingTop: 0, paddingBottom: 0, paddingLeft: 3, paddingRight: 0, justifyContent: 'flex-start'}}>
                            <ExpandLessIcon fontSize='small' transform={itemChild.isColapsed ? "rotate(90)" : "rotate(-180)"} style={{ color: "white" }} />
                            <Typography variant="h6" color={colors.grey[100]} key={index2} >{itemChild.text}</Typography>
                        </Button>
                    </Box>) }
                </Box>:
                <Box height={itemHeight} display={item.display} sx={{ borderBottom: 2, borderBottomColor: bColor}}>
                    <Button onClick={handleOnClicked(item.name)} sx={{paddingTop: 0, paddingBottom: 0, paddingLeft: 2, paddingRight: 0, justifyContent: 'flex-start'}}>
                        <ExpandLessIcon fontSize='small' transform={item.isColapsed ? "rotate(90)" : "rotate(-180)"} style={{ color: "white" }} />
                        <Typography variant="h6" color={colors.grey[100]} key={index} >{item.text}</Typography>
                    </Button>
                </Box>     
                )
        }
        </Box>
    )
}

const GanttComponent = ({items, bColor, itemHeight, blueColor, redColor}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [droneLifeSpan, setDroneLifeSpan] = useState([])
    const [mrmLifeSpan, setMrmLifeSpan] = useState([])
    const [mrmFired, setMrmFired] = useState([])
    const dataLength = useCsvDataStore.getState().dataLength
    const missiles = ["Missile1", "Missile2", "Missile3", "Missile4"]
    const mrmImgPathBlue = import.meta.env.BASE_URL + "HUDicons/MissileFiredIconBlue.png"
    const mrmImgPathRed = import.meta.env.BASE_URL + "HUDicons/MissileFiredIconRed.png"

    useEffect(()=>{
        const teams = ["Blue", "Red"]
        let lifeSpan = {}
        let lifeSpanMRM = {}
        let firedMRM = {}
        teams.forEach((el)=>{
            for(let i=0; i<2; i++){
                let droneWidth 
                if(useCsvDataStore.getState().filename.stats[el+(i+1).toString()].isAliveEndIndex == -1){
                    droneWidth = 100
                }else{
                    droneWidth = ((useCsvDataStore.getState().filename.stats[el+(i+1).toString()].isAliveEndIndex/dataLength).toFixed(4)*100)
                }
                lifeSpan[el+"/"+el+(i+1).toString()] = droneWidth

                for(let j=0; j<4; j++){
                    let mrmWidth
                    let mrmFired
                    if(useCsvDataStore.getState().filename.stats[el+(i+1).toString()].fireIndex[j] == -1){
                        mrmWidth = 0
                        mrmFired = 0
                    }else{
                        mrmFired = (useCsvDataStore.getState().filename.stats[el+(i+1).toString()].fireIndex[j]/dataLength).toFixed(4)*100
                        
                        if(useCsvDataStore.getState().filename.stats[el+(i+1).toString()].fireEndIndex[j]==-1){
                            mrmWidth = 100 - mrmFired
                        }else{
                            mrmWidth = (useCsvDataStore.getState().filename.stats[el+(i+1).toString()].fireEndIndex[j]/dataLength).toFixed(4)*100 - mrmFired
                        }
                        mrmWidth = mrmWidth
                        mrmFired = mrmFired 
                        
                    }
                    lifeSpanMRM[el+"/"+el+(i+1).toString()+":"+"Missile"+(j+1).toString()] = mrmWidth
                    firedMRM[el+"/"+el+(i+1).toString()+":"+"Missile"+(j+1).toString()] = mrmFired
                }
            }
            
        })
        setDroneLifeSpan(lifeSpan)
        setMrmLifeSpan(lifeSpanMRM)
        setMrmFired(firedMRM)
    },[])
    

    return(
        <Box position="relative">
        {
            (droneLifeSpan.length!==0) && 
            items.map((item, i) =>
            (item.length) ?
                <Box>
                    {item.map((itemChild, index) =>
                    <Box position="relative" height={itemHeight} display={itemChild.display} alignItems="center" sx={{ borderBottom: 2, borderBottomColor: bColor}} >
                    {(itemChild.team=="Blue") ?
                    <Box sx={{marginLeft: mrmFired[itemChild.name].toString()+"%", width: mrmLifeSpan[itemChild.name].toString()+"%", height:itemHeight*0.5, borderRadius: 3, bgcolor: blueColor}} />:
                    <Box sx={{marginLeft: mrmFired[itemChild.name].toString()+"%", width: mrmLifeSpan[itemChild.name].toString()+"%", height:itemHeight*0.5, borderRadius: 3, bgcolor: redColor}} />}
                    </Box>
                    )}
                </Box>:
                <Box height={itemHeight} display={item.display} alignItems="center" sx={{ borderBottom: 2, borderBottomColor: bColor}}>
                    {(item.team=="Blue") ?
                    <Box position="relative"
                        sx={{
                            width: droneLifeSpan[item.name].toString()+"%", 
                            height:itemHeight*0.5, 
                            borderRadius: 3, 
                            bgcolor: blueColor, 
                            opacity: 1}}>
                    {
                        missiles.map((el)=>{
                            if(mrmFired[item.name+":"+el]!==0){
                                return(
                                <Box position="absolute" height={itemHeight*0.5} width={itemHeight*0.5}
                                sx={{
                                    backgroundImage: `url(${mrmImgPathBlue})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    left: (mrmFired[item.name+":"+el]/(droneLifeSpan[item.name]/100)).toString()+"%"
                                }}/>
                                )
                            } 
                        })
                    }
                    </Box>:
                    <Box position="relative" 
                        sx={{
                            width: droneLifeSpan[item.name].toString()+"%", 
                            height:itemHeight*0.5, 
                            borderRadius: 3, 
                            bgcolor: redColor,
                            opacity: 1}}>
                    {
                        missiles.map((el)=>{
                            if(mrmFired[item.name+":"+el]!==0){
                                return(
                                <Box position="absolute" height={itemHeight*0.5} width={itemHeight*0.5}
                                sx={{
                                    backgroundImage: `url(${mrmImgPathRed})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    left: (mrmFired[item.name+":"+el]/(droneLifeSpan[item.name]/100)).toString()+"%"
                                }}/>
                                )
                            } 
                        })
                    }
                    </Box>}
                </Box>    
            )
        }
        <TimeControlBar />
    </Box>
)
}


const TimeControlBar = ({}) => {
    const timeHUD = useCsvDataStore(state => state.timeHUD);
    const canvasRef = useRef(null);
    const parentRef = useRef(null);
    const [windowSize, setWindowSize] = useState([])
  
    const draw = () => {
        const ctx = canvasRef?.current?.getContext("2d");
        if (!ctx) {
          return;
        }
        ctx.clearRect(0,0,windowSize[0],windowSize[1])
        ctx.beginPath()
        ctx.moveTo(windowSize[0]*timeHUD, 0)
        ctx.lineTo(windowSize[0]*timeHUD, windowSize[1])
        ctx.strokeStyle = "#ffffff"
        ctx.stroke()
    };

    useEffect(() => {
        if (!parentRef.current) return;
            const resizeObserver = new ResizeObserver(() => {
                setWindowSize([parentRef.current.clientWidth,parentRef.current.clientHeight])
            });
            resizeObserver.observe(parentRef.current);
            return () => resizeObserver.disconnect(); // clean up 
    }, []);

    useEffect(()=>{
        draw()
    },[timeHUD, windowSize])

    return(
        <Box 
            className="TimeControlBarCanvasBox" 
            position="absolute" 
            sx={{
                top: 0, 
                bottom: 2, 
                right: 0,
                left: 0
            }}
            ref={parentRef}>
            <canvas ref={canvasRef} width={windowSize[0]} height={windowSize[1]} />       
        </Box>
        
    )

}

const TimeControlSliderThumb = ({}) => {
    const timeHUD = useCsvDataStore(state => state.timeHUD);
    const thumbRef = useRef(null);
    const canvasRef = useRef(null);
    const parentRef = useRef(null);
    const [windowSize, setWindowSize] = useState([])
    const thumbImgPath = import.meta.env.BASE_URL + "img/TimeControlThumb.png"
  
    const draw = () => {
        const ctx = canvasRef?.current?.getContext("2d");
        const thumb = thumbRef.current;
        if (!ctx || !thumb) {
            return;
          }
        ctx.clearRect(0,0,windowSize[0],windowSize[1])
        ctx.drawImage(thumb, windowSize[0]*timeHUD-2.5, 17, 5, 10);
    };

    useEffect(() => {
        const thumb = new Image();
        thumb.src = thumbImgPath;
        thumb.onload = () => {
            thumbRef.current = thumb;
        draw();
        };

        if (!parentRef.current) return;
            const resizeObserver = new ResizeObserver(() => {
                setWindowSize([parentRef.current.clientWidth,parentRef.current.clientHeight])
            });
            resizeObserver.observe(parentRef.current);
            return () => resizeObserver.disconnect(); // clean up 
    }, []);

    useEffect(()=>{
        draw()
    },[timeHUD, windowSize])

    return(
        <Box 
            className="TimeControlThumbCanvasBox" 
            position="absolute" 
            sx={{
                top: 0, 
                bottom: 0, 
                right: 0,
                left: 0
            }}
            ref={parentRef}>
            <canvas ref={canvasRef} width={windowSize[0]} height={windowSize[1]} />       
        </Box>
    )

}

const TimeControlSlider = ({}) => {
    const timeHUD = useCsvDataStore(state => state.timeHUD);
    const setTime = useCsvDataStore((state) => (state.setTime));
    const setTimeHUD = useCsvDataStore((state) => (state.setTimeHUD));

    const handleSliderChange = (e, newValue) => {
        setTime(parseFloat(newValue/100))
        setTimeHUD(parseFloat(newValue/100))
    }

    return(
        <Slider 
                step={0.1}
                value={timeHUD*100}
                onChange={handleSliderChange} 
                aria-label="small" 
                sx={{
                    '& .MuiSlider-rail': {
                        border: 'none',
                        color: "#d3d3d3",
                        opacity: 0
                      },
                    '& .MuiSlider-track': {
                      border: 'none',
                      color: "#d3d3d3",
                      opacity: 0
                    },
                    '& .MuiSlider-thumb': {
                      height: 16,
                      width: 16,
                      backgroundColor: '#fff',
                      opacity: 0,
                      border: 'none',
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: 'inherit',
                      },
                      '&:before': {
                        display: 'none',
                      },
                    }}} />
    )
}

const Ticks = ({}) => {
    const dataLength = useCsvDataStore.getState().dataLength
    const dT = 0.05
    const tickDeltaSec = 1 
    const tickDelta = tickDeltaSec/dT
    const tickDeltaSecLarge = 10 
    const tickDeltaLarge = tickDeltaSecLarge/dT
    const [tick, setTick] = useState([])
    const labelBoxWidth = 2.5
    
    useEffect(()=>{
        let Ticks = []
        for(let i=0; i<dataLength; i = i + tickDelta){
            Ticks.push({posX: (i/dataLength*100).toString() + "%" , label: TimeFormat(i*dT), isLarge: false})
        }
        for(let i=0; i<dataLength; i = i + tickDeltaLarge){
            Ticks.push({posX: (i*100/dataLength).toString() + "%" , label: TimeFormat(i*dT), isLarge: true, posXlabel: ((i*100/dataLength)-labelBoxWidth/2).toString() + "%"})
        }
        setTick(Ticks)
    },[])

    

    return(
        (tick.length !== 0 ) &&
        tick.map((el, i)=>{
            if(el.isLarge){
                return (
                <Box >
                    <Box position="absolute" sx={{marginLeft: el.posX, bottom: 0, width: "2px", height: "5px", bgcolor: "#ffffff"}}/>
                    <Box position="absolute" display="flex" justifyContent="center" sx={{marginLeft: el.posXlabel, top: 0, width: labelBoxWidth.toString()+"%", height: "20px"}}>
                        <Typography sx={{webkitUserSelect: "none", 
                            mozUserSelect: "none", 
                            msUserSelect: "none", 
                            userSelect: "none"}}
                            variant="h7">
                            {el.label}
                        </Typography>
                    </Box>
                </Box>) 
            }else{
               return (
                <Box >
                    <Box position="absolute" sx={{marginLeft: el.posX, bottom: 0, width: "1px", height: "2px", bgcolor: "#ffffff"}} />
                </Box>) 
            }
            
        })
    )
}

const TimeLine = ({fullScreenMode}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const animationSpeed = useCsvDataStore(state => state.animationSpeed);
    const setAnimationSpeed = useCsvDataStore(state => state.setAnimationSpeed);
    const [anchorEl, setAnchorEl] = useState(null);
    const isPaused = useCsvDataStore(state => state.isPaused);
    const setIsPaused = useCsvDataStore((state) => (state.setIsPaused));
    const setTimeLineState = useTimeLineStateStore((state) => (state.setTimeLineState)); 
    const timeLineState = useTimeLineStateStore(state => state.timeLineState);
    const borderColor = "#1D1D1F"
    const backGroundColor = "#10101f"

    useEffect(()=>{
        let states = []
        const teams = ["Blue", "Red"]
        const missiles = ["Missile1", "Missile2", "Missile3", "Missile4"]

        teams.forEach((el)=>{
            for(let i=0; i<2; i++){
                let childComponents = []
                states.push({name: el+"/"+el+(i+1), text: el+(i+1), team: el, display: "flex", isColapsed: true})
                missiles.forEach((el2)=>{
                    childComponents.push({name: el+"/"+el+(i+1)+":"+el2 , text: el2, team: el, display: "none", isColapsed: true})
                })
                states.push(childComponents)
                
            }
        })
        setTimeLineState(states)
    },[])

    const handlePlayAndPause = () => {
      setIsPaused(!isPaused)
    }

    const handlePopOver = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePlaySpeed = (rate) => {
        setAnimationSpeed(rate)
    }

    const open = Boolean(anchorEl);
    const id = open ? 'playbackrate-popover' : undefined;


  return (
    
    <Box className="timeline__div" 
    width="100%" 
    height="100%" 
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="space-between"
    overflow="hidden"
    >
      {/* Bottom Segment */}
        <Box className="timelineBox" width="100%" display="flex" alignItems="center" flexDirection="row" justifyContent="center" 
        m = {0}
        sx={{
            backgroundColor: (theme) => theme.palette.mode === "light"
                ? "#f5f5f5"
                : backGroundColor,
            borderTop: 2,
            borderTopColor: borderColor,
            borderBottom: 2,
            borderBottomColor: borderColor
        }}>

            <Button className='controls__icons' aria-label='reqind' onClick={handlePlayAndPause} sx={{padding: 0}}>
                    {
                      isPaused ? (
                        <PlayArrowSharp fontSize='small' sx={{color:'white'}}/>
                      ) : (
                        <PauseSharp fontSize='small' sx={{color:'white'}}/>
                      )
                    }
            </Button>

            <Button variant='text' onClick={handlePopOver} className='bottom__icons' sx={{padding: 0}}>
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
                <Box display="flex" flexDirection='column-reverse'>
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
                </Box>
                    
            </Popover>
        
            <Button className='bottom__icons' sx={{padding: 0}} onClick={fullScreenMode}>
                <Fullscreen fontSize='small' style={{ color: "white" }}/>
            </Button>
        </Box>
        
        <Box width="100%" display="flex" alignItems="center" direction="row" justifyContent="space-between"
            sx={{
                backgroundColor: (theme) => theme.palette.mode === "light"
            ? "#f5f5f5"
            : backGroundColor,
            borderBottom: 2,
            borderBottomColor: borderColor}}>
            <Box width="15%" display="flex" alignItems="center" direction="row" justifyContent="center">
                <Typography 
                sx={{webkitUserSelect: "none", 
                mozUserSelect: "none", 
                msUserSelect: "none", 
                userSelect: "none"}} variant="h6">ASSETS</Typography>
            </Box>
            <Box position="relative" className="tickDiv" 
            width="85%" height="100%" display="flex" 
            alignItems="center" direction="row"
            >
                <Ticks />
                <TimeControlSliderThumb />
                <TimeControlSlider />
            </Box> 
        </Box>
         
        <Box width="100%" display="flex" direction="row" justifyContent="space-between" flexGrow={1}
        sx={{overflow:"auto", 
        overflowY: "scroll", 
        MsOverflowStyle: "none", 
        scrollbarWidth: "none",
        backgroundColor: (theme) => theme.palette.mode === "light"
                ? "#f5f5f5"
                : backGroundColor,
        borderBottom: 2,
        borderBottomColor: borderColor
        }}>
        
            <Box width="15%" sx={{borderRight: 1, borderRightColor: borderColor}}>
                {timeLineState &&
                <ListComponent items={timeLineState} itemHeight={20} bColor={borderColor}/>
                }
            </Box>
            
            <Box  width="85%" >
                {timeLineState &&
                <GanttComponent items={timeLineState} itemHeight={20} bColor={borderColor} blueColor="#67bddf" redColor="#ff3fc3"/>
                }
            </Box> 
        
        </Box>
    </Box>
    
  );
};

export default TimeLine;