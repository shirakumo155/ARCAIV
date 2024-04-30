import { Box } from "@mui/material";
import React, {useEffect, useRef, useState} from "react"
import { useCsvDataStore } from "../../Store"
import img  from '/texture/GroundTextureMiniMap.png';

const MiniMap = (props) =>{
    const w = props.w
    const h = props.h
    const reduceRatio = 0.9
    const timeHUD = useCsvDataStore(state => state.timeHUD);
    const dataLength = useCsvDataStore.getState().dataLength
    const droneBlueRefs = useRef([]);
    const droneMrmBlueRefs = useRef([[],[]]);
    const droneRedRefs = useRef([]);
    const droneMrmRedRefs = useRef([[],[]]);
    const canvasRef = useRef(null);
    const canvasBackGroundRef = useRef(null);
    const parentRef = useRef(null);
    const backgroundRef = useRef(null);
    const [windowSize, setWindowSize] = useState([])
    const droneNum = 2
    const missileNums = 4
    const droneSize = 12
    const mrmSize = 8
    const dpr = 2
    const dprBackGround = 2

    // Init
    useEffect(() => {
        const backgound = new Image();
        backgound.src = '/texture/GroundTextureMiniMap.png';
        backgound.onload = () => {backgroundRef.current = backgound}


        const setImage = (ImgPath, index, team, name, type) => {
            const asset = new Image();
            asset.src = ImgPath;
            asset.onload = () => {
                if(team=="Blue" && type=="Drone"){
                    droneBlueRefs.current[index] = asset;
                }else if(team=="Red" && type=="Drone"){
                    droneRedRefs.current[index] = asset;
                }else if(team=="Blue" && name=="Blue1" && type=="MRM"){
                    droneMrmBlueRefs.current[0][index] = asset;
                }else if(team=="Blue" && name=="Blue2" && type=="MRM"){
                    droneMrmBlueRefs.current[1][index] = asset;
                }else if(team=="Red" && name=="Red1" && type=="MRM"){
                    droneMrmRedRefs.current[0][index] = asset;
                }else if(team=="Red" && name=="Red2" && type=="MRM"){
                    droneMrmRedRefs.current[1][index] = asset;
                }
            };
        }

        const teams = ["Blue", "Red"]
        teams.forEach((teamEl)=>{
            for(let i=0; i<droneNum; i++){
                setImage('/img/IconDrone'+ teamEl +'.png', i, teamEl, teamEl+(i+1), "Drone")
                for(let j=0; j<missileNums; j++){
                    setImage('/img/IconMissile'+ teamEl +'.png', j, teamEl, teamEl+(i+1), "MRM")
                }
            }
        })

        // This defines an event canvas parent box is resized
        if (!parentRef.current) return;
            const resizeObserver = new ResizeObserver(() => {
                setWindowSize([
                    parentRef.current.clientWidth, 
                    parentRef.current.clientHeight])
            });
        resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect(); // clean up 
    }, []);

    useEffect(()=>{
        const drones = ["Blue/Blue1","Blue/Blue2","Red/Red1","Red/Red2"]
        const missiles = ["Missile1","Missile2","Missile3","Missile4"]
        let index = (timeHUD * dataLength).toFixed() - 1 
        index = Math.min(Math.max(index, 0), dataLength-1);

        const draw = () => {
            const ctx = canvasRef?.current?.getContext("2d");
            if (!ctx) {
                return;
            }
            // Start Drawing
            ctx.scale(dpr, dpr);
            ctx.clearRect(0,0,windowSize[0],windowSize[1])

            drones.forEach((element, i) => {
                
                missiles.forEach((element2, i2) => {
                    
                    if(useCsvDataStore.getState().data[index][element + ":" + element2 + ".isFlying"]=="True"){
                        let x = useCsvDataStore.getState().data[index][element + ":" + element2 + ".pos.x[m]"] 
                        let y = useCsvDataStore.getState().data[index][element + ":" + element2 + ".pos.y[m]"]
                        let yaw = useCsvDataStore.getState().data[index][element + ":" + element2 + ".att.yaw[rad]"]
                        let PosX = (y * windowSize[0]/50000)*reduceRatio +  windowSize[0]/2
                        let PosY = (x * windowSize[1]/50000)*reduceRatio +  windowSize[1]/2

                        // if target isAlive
                        const target = useCsvDataStore.getState().data[index][element + ":" + element2 + ".target.truth"]
                        if(useCsvDataStore.getState().data[index][target + ".isAlive"]=="True"){
                            // target pos
                            let xTgt = useCsvDataStore.getState().data[index][target + ".pos.x[m]"] 
                            let yTgt = useCsvDataStore.getState().data[index][target + ".pos.y[m]"]
                            let PosXTgt = (yTgt * windowSize[0]/50000)*reduceRatio +  windowSize[0]/2
                            let PosYTgt = (xTgt * windowSize[1]/50000)*reduceRatio +  windowSize[1]/2
                            // draw line
                            ctx.lineWidth = 0.5;
                            ctx.beginPath()
                            ctx.setLineDash([4, 1]);
                            ctx.moveTo(PosX, PosY)
                            ctx.lineTo(PosXTgt, PosYTgt)
                            ctx.strokeStyle = "#ffffff"
                            ctx.stroke()
                        }       

                        let ref
                        if(i<droneNum){
                            ref = droneMrmBlueRefs.current[i][i2];
                        }else{
                            ref = droneMrmRedRefs.current[i-droneNum][i2];
                        }  
                        ctx.save(); //saves the state of canvas
                        ctx.translate(PosX, PosY); //let's translate
                        ctx.rotate(-yaw+Math.PI); //increment the angle and rotate the image 
                        ctx.drawImage(ref, -mrmSize/2, -mrmSize/2, mrmSize, mrmSize);
                        ctx.restore(); //restore the state of canvas
   
                    }
                })

                if(useCsvDataStore.getState().data[index][element + ".isAlive"]=="True"){
                    let x = useCsvDataStore.getState().data[index][element + ".pos.x[m]"] 
                    let y = useCsvDataStore.getState().data[index][element + ".pos.y[m]"]
                    let yaw = useCsvDataStore.getState().data[index][element + ".att.yaw[rad]"]
                    let PosX = (y * windowSize[0]/50000)*reduceRatio +  windowSize[0]/2
                    let PosY = (x * windowSize[1]/50000)*reduceRatio +  windowSize[1]/2
                    let ref
                    if(i<droneNum){
                        ref = droneBlueRefs.current[i];
                    }else{
                        ref = droneRedRefs.current[i-droneNum];
                    }  
                    ctx.save(); //saves the state of canvas
                    ctx.translate(PosX, PosY); //let's translate
                    ctx.rotate(-yaw+Math.PI); //increment the angle and rotate the image 
                    ctx.drawImage(ref, -droneSize/2, -droneSize/2, droneSize, droneSize);
                    ctx.restore(); //restore the state of canvas
                }
            })

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
        }
        // Draw after windowsize set
        if(windowSize[0]&&windowSize[1]){
            draw()
        }
        
    },[timeHUD])

    useEffect(()=>{
        if(windowSize[0]&&windowSize[1]){
            const ctx = canvasBackGroundRef?.current?.getContext("2d");
            if (!ctx || !backgroundRef.current) {
                return;
            }
            ctx.clearRect(0,0,windowSize[0],windowSize[1])
            ctx.scale(dprBackGround, dprBackGround);
            ctx.save(); //saves the state of canvas
            ctx.translate(windowSize[0]/2, windowSize[1]/2); //let's translate
            ctx.drawImage(backgroundRef.current, -windowSize[0]*reduceRatio/2 , -windowSize[1]*reduceRatio/2, windowSize[0]*reduceRatio,windowSize[1]*reduceRatio);
            ctx.restore(); //restore the state of canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    },[windowSize, backgroundRef.current, canvasBackGroundRef.current])

    return(
        <Box 
            className="MiniMapCanvasBox" 
            position="relative"
            width={w}
            height={h}
            ref={parentRef}
            sx={{
                backgroundColor: (theme) => theme.palette.mode === "light"
                    ? "#121221"
                    : "#121221",
                opacity: 0.8
            }}>
            <canvas ref={canvasRef} width={windowSize[0]* dpr} height={windowSize[1]* dpr} style={{position:"absolute", zIndex:2, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/>      
            <canvas ref={canvasBackGroundRef} width={windowSize[0]* dprBackGround} height={windowSize[1]* dprBackGround} style={{position:"absolute", zIndex:1, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/> 
        </Box>
    )
}

export default MiniMap 