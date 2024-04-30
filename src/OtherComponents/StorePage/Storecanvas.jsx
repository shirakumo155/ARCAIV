import { Box } from "@mui/material";
import React, {useEffect, useRef, useState, useContext} from "react"
import { useCsvDataStore } from "../../Store"
import { isOpenContext } from "../videoLayerComponents/TableItem";

const Storecanvas = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.name
    const backgroundColor = props.bkColor
    const isOpen = useContext(isOpenContext);
    const dprBackGround = 2
    const dpr = 2
    const timeHUD = useCsvDataStore(state => state.timeHUD)
    const dataLength = useCsvDataStore.getState().dataLength
    const parentRef = useRef()
    const canvasBackGroundRef = useRef()
    const backgroundRef = useRef()
    const mrmRef = useRef()
    const canvasRef = useRef()
    const [windowSize, setWindowSize] = useState([])
    const mrmImgSize = [12, 25]
    const mrmImgPos = [[-4,-6],[4,-6],[-10,-1],[10,-1]]

    useEffect(()=>{

        // load mrm image
        const mrm = new Image();
        mrm.src = './src/images/HUDicons/MRM.png';
        mrm.onload = () => {mrmRef.current = mrm}
  
        // load back ground
        const backgound = new Image();
        backgound.src = './src/images/HUDicons/DroneDetail.png';
        backgound.onload = () => {backgroundRef.current = backgound}

        // This defines an event canvas parent box is resized
        if (!parentRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            setWindowSize([
                parentRef.current.clientWidth, 
                parentRef.current.clientHeight])
        });
        resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect(); // clean up 
    },[])

    useEffect(()=>{
        if(dataLength !== 0 ){
            let index = (timeHUD * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1)
            const ctx = canvasRef?.current?.getContext("2d");
            if (!ctx || !mrmRef.current) {
                return;
            }
            
            ctx.scale(dpr, dpr);
            ctx.clearRect(0,0,windowSize[0]*dpr,windowSize[1]*dpr)
            
            if((useCsvDataStore.getState().data[index][name + ".isAlive"]=="True") && isOpen){
                let numMRM = (useCsvDataStore.getState().data[index][name + ".MRM"] )
                for(let i=0;i<numMRM;i++){
                    ctx.save(); //saves the state of canvas
                    ctx.translate(windowSize[0]/2, windowSize[1]/2); //let's translate
                    ctx.drawImage(mrmRef.current, -mrmImgSize[0]/2 + mrmImgPos[i][0], -mrmImgSize[1]/2 + mrmImgPos[i][1], mrmImgSize[0], mrmImgSize[1]);
                    ctx.restore(); //restore the state of canvas
                }
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset dpr scale
        }
    },[timeHUD])


    useEffect(()=>{
        if(windowSize[0]&&windowSize[1]){
            const ctxBK = canvasBackGroundRef?.current?.getContext("2d");
            if (!ctxBK || !backgroundRef.current) {
                return;
            }
            
            ctxBK.clearRect(0,0,windowSize[0]*dprBackGround,windowSize[1]*dprBackGround)
            ctxBK.scale(dprBackGround, dprBackGround);
            ctxBK.save(); //saves the state of canvas
            ctxBK.translate(windowSize[0]/2, 0); //let's translate
            ctxBK.drawImage(backgroundRef.current, -windowSize[1]/2*1.2, -windowSize[1]/2, windowSize[1]*1.2, windowSize[1]*1.4);
            ctxBK.restore(); //restore the state of canvas
            ctxBK.setTransform(1, 0, 0, 1, 0, 0); // reset dpr scale

        }
    },[windowSize, canvasBackGroundRef.current, backgroundRef.current])

    return(  
        <Box 
        className="RWRCanvasBox" 
        width={w} 
        height={h}
        position="relative"
        ref={parentRef}>
            <canvas ref={canvasRef} width={windowSize[0]* dpr} height={windowSize[1]* dpr} style={{position:"absolute", zIndex:2, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/>      
            <canvas ref={canvasBackGroundRef} width={windowSize[0]* dprBackGround} height={windowSize[1]* dprBackGround} style={{position:"absolute", zIndex:1, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/> 
        </Box>
    )
}

export default Storecanvas