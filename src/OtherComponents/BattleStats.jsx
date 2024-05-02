import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Header from "./global/Header";
import * as d3 from 'd3'
import React, { useEffect, useState, useRef } from "react"
import { useCsvDataListStore } from "../Store"
import {csvToArr, readUploadedFileAsText} from '../Utils'

const BattleStats = () =>{
    const index = 0
    const fileArr = useCsvDataListStore(state => state.fileArr);

    useEffect(()=>{
        
    }, [])


    return(
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title='BATTLE STATS' subtitle="Under Construction" />
            </Box>
            
        </Box>
    )
}

export default BattleStats