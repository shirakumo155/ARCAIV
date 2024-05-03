import { Box, IconButton, Typography, useTheme, Grid, FormControl, InputLabel, MenuItem, Select, Button, Menu } from "@mui/material";
import React, { useEffect, useState, useRef } from "react"
import { tokens } from "../../theme";
import { useCsvDataListStore } from "../../Store"


const BattleStatsHeader = (props) =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fileArr = useCsvDataListStore(state => state.fileArr);
    const [agentName, setAgentName] = React.useState(props.name);
    const [agentNameList, setAgentNameList] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.target);
    };
    const handleClose = (event, name) => {
        if(event.currentTarget.dataset.name){
           setAgentName(event.currentTarget.dataset.name); 
        }
        setAnchorEl(null);
    };

    useEffect(()=>{
        // get the list of blue name
        let nameList = []
        fileArr.forEach((el,i)=>{
            if(props.name=="Blue"){
                if(!nameList.includes(el.nameB)){
                nameList.push(el.nameB)
                }
            }else{
                if(!nameList.includes(el.nameR)){
                    nameList.push(el.nameR)
                }
            }
        })
        setAgentNameList(nameList)
    },[])
    

    return(
        <Box>
            <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{
                    color: colors.grey[100], 
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                        '&:hover': {
                        backgroundColor: colors.blueAccent[600],
                    }}}
            >
                <Typography variant="h4" color={colors.grey[100]}>
                    {agentName}
                </Typography>
                
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClick={(e) => handleClose(e)}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
            >
            <MenuItem onClick={(e) => handleClose(e)} data-name={"none"}>
                <em>None</em>
            </MenuItem>
            {agentNameList.map((el,i)=>{
                return(
                <MenuItem onClick={(e) => handleClose(e)} key={i} data-name={el}>{el}</MenuItem>  
                )
            })}
            </Menu>
        </Box>
                    
    )
}

export default BattleStatsHeader
