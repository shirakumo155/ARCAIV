import {Canvas} from "@react-three/fiber"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useEffect, useState, useRef } from "react"
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "./global/Header";
import Scene from "../SceneComponents/Scene"
import ControlIcons from "./videoLayerComponents/ControlIcons";
import { useCsvDataStore } from "../Store"
import screenfull from 'screenfull';
import {csvToArr, readUploadedFileAsText} from '../Utils'
import { Stats } from '@react-three/drei'

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const clearColorOpacity = 0.5
const initialCamRadius = 80
const initialCamHeight = 40

const QuickView = () =>{
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const loaded = useCsvDataStore(state => state.data);
    const setFileName = useCsvDataStore((state)=>(state.setFileName))
    const updateData = useCsvDataStore((state)=>(state.setData))
    const updateDataLength = useCsvDataStore((state)=>(state.setLength))
    const resetData = useCsvDataStore((state)=>(state.resetData))
    const resetTime = useCsvDataStore((state)=>(state.resetTime))
    const resetIndex = useCsvDataStore((state)=>(state.resetIndex))
    const playerDivRef = useRef(null);

    useEffect(()=>{
        resetData()
    },[])

    const handleFileChange = async (e) => {
        
        // Check if user has entered the file
        if (e.target.files.length) {
            const allowedExtensions = ["csv"];
            const inputFile = e.target.files[0];

            // Check the file extensions, if it not
            // included in the allowed extensions
            // we show the error
            const fileExtension =
                inputFile?.type.split("/")[1];
            if (
                !allowedExtensions.includes(fileExtension)
            ) {
                setError("Please input a csv file");
                return;
            }
            // If input type is correct set the state
            setFileName(inputFile);
            resetData()
            resetTime()
            resetIndex()
        }

        const csvfile = useCsvDataStore.getState().filename
        if (!csvfile) return alert("Enter a valid file")
        // reset useCsvDataStore.data
        
        e.preventDefault();
        //const reader = new FileReader();

        try {
            const fileContents = await readUploadedFileAsText(csvfile)  
            //simData = csvToArr(fileContents, ",")
            updateData(csvToArr(fileContents, ","))
            updateDataLength(csvToArr(fileContents, ",").length)
        } catch (e) {
            console.warn(e.message)
        }
        } 
        
    const handleFullScreenMode = () => {
        screenfull.toggle(playerDivRef.current)
    }

    return(
        <Box pl={4} pr={4} pb={0} display="flex" flexDirection="column" height="100%">
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title='Quick View' subtitle="Select a file to review"/>
                <Box>
                <form>
                    <Button variant="contained" component="label" 
                    sx={{backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100], 
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",'&:hover': {
                                backgroundColor: colors.blueAccent[600],
                            }}}>
                        Select File
                        <input type="file" id="csvInput" accept=".csv" onChange={handleFileChange} hidden/>
                    </Button>
                </form> 
                </Box>
            </Box>
        </Box>
        <Box position="relative" flex-grow="1" height="100%" overflow="hidden" ref={playerDivRef}>
        {
            // If you have data, then render a scene
            useCsvDataStore.getState().data[0] &&
            <Canvas 
                camera={
                    {fov: 45, aspect: windowWidth / windowHeight, near: 0.1, far: 1000, position: [0, initialCamHeight, initialCamRadius]}}
                    onCreated={state => state.gl.setClearColor(0x070707, clearColorOpacity)}>
                <color attach="background" args={[colors.r3fCanvasBackground]} />
                <Scene />
                {(theme.palette.mode=="dark") &&
                <EffectComposer>
                    <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={2} />
                    <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={1} />
                </EffectComposer>
                }
                <Stats />
            </Canvas>
        }
        {
            useCsvDataStore.getState().data[0] &&
            <ControlIcons fullScreenMode={handleFullScreenMode} />
        }
        </Box>
        
        </Box>
    )
}

export default QuickView