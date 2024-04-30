import { Box } from "@mui/material";
import React, {useEffect, useRef, useState, useContext} from "react"
import { useCsvDataStore } from "../../Store"
import { isOpenContext } from "../videoLayerComponents/TableItem";

const RWRcanvas = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.name
    const team = props.team
    const backgroundColor = props.bkColor
    const isOpen = useContext(isOpenContext);
    const dprBackGround = 2
    const dpr = 2
    const timeHUD = useCsvDataStore(state => state.timeHUD)
    const dataLength = useCsvDataStore.getState().dataLength
    const parentRef = useRef()
    const canvasBackGroundRef = useRef()
    const backgroundRef = useRef()
    const canvasRef = useRef()
    const [RWRObjects, setRWRObjects] = useState([])
    const [windowSize, setWindowSize] = useState([])

    useEffect(()=>{
        let RWRobjectsArr = []
        const setRWRobject = (name, text)=>{
            let RWRObject = {}
            RWRObject.name = name
            RWRObject.text = text
            RWRobjectsArr.push(RWRObject)
            setRWRObjects(RWRobjectsArr)
        }

        if(team=="Blue"){
            setRWRobject("Red/Red1", "FX")
            setRWRobject("Red/Red2", "FX")
            setRWRobject("Red/Red1:Missile1", "M")
            setRWRobject("Red/Red1:Missile2", "M")
            setRWRobject("Red/Red1:Missile3", "M")
            setRWRobject("Red/Red1:Missile4", "M")
            setRWRobject("Red/Red2:Missile1", "M")
            setRWRobject("Red/Red2:Missile2", "M")
            setRWRobject("Red/Red2:Missile3", "M")
            setRWRobject("Red/Red2:Missile4", "M")
            
        }else{
            setRWRobject("Blue/Blue1", "FX")
            setRWRobject("Blue/Blue2", "FX")
            setRWRobject("Blue/Blue1:Missile1", "M")
            setRWRobject("Blue/Blue1:Missile2", "M")
            setRWRobject("Blue/Blue1:Missile3", "M")
            setRWRobject("Blue/Blue1:Missile4", "M")
            setRWRobject("Blue/Blue2:Missile1", "M")
            setRWRobject("Blue/Blue2:Missile2", "M")
            setRWRobject("Blue/Blue2:Missile3", "M")
            setRWRobject("Blue/Blue2:Missile4", "M")
        }

        // load back ground
        const backgound = new Image();
        backgound.src = './src/images/HUDicons/RWR.png';
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
            if (!ctx ) {
                return;
            }
            ctx.font = "6px Arial";
            ctx.fillStyle = "white"
            ctx.scale(dpr, dpr);
            ctx.clearRect(0,0,windowSize[0]*dpr,windowSize[1]*dpr)

            if((useCsvDataStore.getState().data[index][props.team + "/" + props.name + ".isAlive"]=="True") && isOpen){
                RWRObjects.forEach((element, i) => {
                    if(useCsvDataStore.getState().data[index][element.name + ".isAlive"]=="True"){
                        let dx = useCsvDataStore.getState().data[index][element.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.x[m]"]
                        let dy = useCsvDataStore.getState().data[index][element.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.y[m]"]
                        let yaw = +useCsvDataStore.getState().data[index][team+"/"+name + ".att.yaw[rad]"]
                        let theta = Math.atan2(dx,dy) + yaw + Math.PI
                        let dr = windowSize[1]/2*0.8
                        let PosX = windowSize[0]/2 + dr * Math.cos(theta)  
                        let PosY = windowSize[1]/2 + dr * Math.sin(theta)
                        // draw
                        ctx.font = "6px Arial";
                        ctx.save(); //saves the state of canvas
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(element.text, PosX, PosY);
                        ctx.restore(); //restore the state of canvas
                    }

                    if(useCsvDataStore.getState().data[index][element.name + ".isFlying"]=="True"){
                        let dx = useCsvDataStore.getState().data[index][element.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.x[m]"]
                        let dy = useCsvDataStore.getState().data[index][element.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.y[m]"]
                        let dz = useCsvDataStore.getState().data[index][element.name + ".pos.z[m]"] - useCsvDataStore.getState().data[index][team+"/"+name + ".pos.z[m]"]
                        let yaw = +useCsvDataStore.getState().data[index][team+"/"+name + ".att.yaw[rad]"]
                        let theta = Math.atan2(dx,dy) + yaw + Math.PI
                        let distance = Math.pow(dx*dx+dy*dy+dz*dz,0.5)
                        let dr = windowSize[1]/2*0.8
                        let PosX = windowSize[0]/2 + dr * Math.cos(theta)  
                        let PosY = windowSize[1]/2 + dr * Math.sin(theta)
                        
                        if((useCsvDataStore.getState().data[index][element.name + ".target.truth"]==team+"/"+name)
                        &&  distance<10000){
                            // draw
                            ctx.font = "10px Arial";
                            ctx.save(); //saves the state of canvas
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillText(element.text, PosX, PosY);
                            ctx.restore(); //restore the state of canvas
                        }
                    }
                })
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
            ctxBK.translate(windowSize[0]/2, windowSize[1]/2); //let's translate
            ctxBK.drawImage(backgroundRef.current, -windowSize[1]/2, -windowSize[1]/2, windowSize[1], windowSize[1]);
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

export default RWRcanvas