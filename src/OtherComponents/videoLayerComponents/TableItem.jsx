import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useCsvDataStore } from "../../Store"
import React, { useEffect, useRef, useState, createContext } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import HUDcanvasSimple from "../HUD/HUDcanvasSimple";
import TACcanvas from "../TACview/TACcanvas";
import Storecanvas from "../StorePage/Storecanvas";
import RWRcanvas from "../RWR/RWRcanvas";
export const isOpenContext = React.createContext();

const TableItem = ({ team, index }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const file = useCsvDataStore(state => state.filename)
    const time = useCsvDataStore(state => state.time)
    const dataLength = useCsvDataStore.getState().dataLength
    const refScore = useRef()
    const [heightval, setheightval] = useState(300)
    const [isOpen, setIsOpen] = useState(true)
    const name = (team + index.toString()).toString()

    const handleItemClose = (e) => {
        const h = (heightval == 0) ? 300 : 0;
        setheightval(h)
        const open = isOpen ? false : true;
        setIsOpen(open)
      } 

    useEffect(()=>{
        let index = (time * dataLength).toFixed() - 1 
        index = Math.min(Math.max(index, 0), dataLength-1);
        if(team=="Blue"){
            refScore.current.textContent = file.stats[name].scoreHist[index].toFixed(2).toString()
            refScore.current.style.color = "#3399FF"
        }else{
            refScore.current.textContent = file.stats[name].scoreHist[index].toFixed(2).toString()
            refScore.current.style.color = "#FF007F"
        }
    },[time])

    return (
        <Box width={"100%"} sx={{borderTop: "1px solid #3B3838", borderBottom: "1px solid #3B3838"}}>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{borderBottom: "1px solid #3B3838"}}>
                <Box ml={2} flexGrow={1} display="flex" justifyContent="space-evenly" alignItems="center">
                    <img src={team=="Blue" ? "./src/images/img/IconDroneBlue.png" : "./src/images/img/IconDroneRed.png"} width="25" height="25" />
                    {team=="Blue" ? 
                    <Typography variant="h4" color={"#3399FF"} fontWeight="bold">{name}</Typography>:
                    <Typography variant="h4" color={"#FF007F"} fontWeight="bold">{name}</Typography> }
                    <Typography variant="h4" fontWeight="bold" ref={refScore}></Typography>
                </Box>
                <Box display="flex">
                        <IconButton className='video_icon' aria-label='reqind'>
                            <VideocamIcon />
                        </IconButton> 
                        <IconButton className='close_icon' aria-label='reqind' onClick={(e)=>{handleItemClose(e)}}>
                            <KeyboardArrowDownIcon id="item1"/>
                        </IconButton>
                </Box>
            </Box>

            
            <Box height={heightval} p={heightval==0 ? 0 : 1} visibility={heightval!==300 ? "hidden" : "visible"} sx={{transition: "height 0.5s"}} >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{pointerEvents: "none"}}>
                    <isOpenContext.Provider value={isOpen}>
                    <TACcanvas w={180} h={180} team={team} name={name} bkColor="rgba(0,0,0,0.6)"/>

                    <Box display="flex"  flexDirection="row" justifyContent="space-between" alignItems="center" >
                        <HUDcanvasSimple w={100} h={100} name={team+"/"+name} bkColor="rgba(0,0,0,0.6)"/>
                        <Box display="flex"  flexDirection="column" justifyContent="center" alignItems="center" >
                            <RWRcanvas w={100} h={50} team={team} name={name} bkColor="rgba(0,0,0,0.6)"/>
                            <Storecanvas w={100} h={50} name={team+"/"+name} bkColor="rgba(0,0,0,0.6)"/>
                        </Box>
                    </Box>
                    </isOpenContext.Provider>
                </Box>
            </Box>

        </Box>
    );
};
  
export default TableItem;