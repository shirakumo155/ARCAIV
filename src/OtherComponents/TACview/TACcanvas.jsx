import { Box } from "@mui/material";
import React, {useEffect, useRef, useState, useContext} from "react"
import { useCsvDataStore } from "../../Store"
import { isOpenContext } from "../videoLayerComponents/TableItem";

const TACcanvas = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.team + "/" + props.name
    const backgroundColor = props.bkColor
    const reduceRatio = 0.9
    const radius = w*reduceRatio/2
    const originImgSize = [15, 15]
    const markerImgSize = [9, 16]
    const mrmImgSize = [3, 10]
    const timeHUD = useCsvDataStore(state => state.timeHUD);
    const dataLength = useCsvDataStore.getState().dataLength
    const [ticks, setTicks] = useState([])
    const [windowSize, setWindowSize] = useState([])
    const [radarObjects, setRadarObjects] = useState([])
    const parentRef = useRef()
    const canvasBackGroundRef = useRef()
    const canvasRef = useRef()
    const backgroundRef = useRef(null);
    const originIconRef = useRef(null);
    const isOpen = useContext(isOpenContext);
    const dprBackGround = 4
    const dpr = 4
    const numDrones = 2
    const numMissiles = 4

    // Init
    useEffect(() => {
        let StateArr = []
        const loadImage = (ImgPath, team, name, type)=>{
            let radarObject = {}
            const img = new Image();
            img.src = ImgPath;
            img.onload = () => {
                radarObject.team = team
                radarObject.name = name
                radarObject.img = img
                radarObject.type = type
                StateArr.push(radarObject)
                setRadarObjects(StateArr)
            };
        }

        const teams = ["Blue","Red"]
        teams.forEach((team)=>{
            for(let i=0; i<numDrones; i++){
                const droneName = team + "/" + team + (i+1)
                if(name !== droneName){
                    if(team == props.team){
                        loadImage('./src/images/HUDicons/friend.png', team, droneName, 'friend')
                        for(let j=0; j<numMissiles; j++){
                            const missileName = droneName + ":Missile" + (j+1)
                            loadImage('./src/images/HUDicons/MRMfriend.png', team, missileName, 'friendMRM')
                        }
                    }else{
                        loadImage('./src/images/HUDicons/target.png', team, droneName, 'enemy')
                    }
                }else{
                    for(let j=0; j<numMissiles; j++){
                        const missileName = droneName + ":Missile" + (j+1)
                        loadImage('./src/images/HUDicons/MRMown.png', team, missileName, 'ownMRM')
                    }
                }
            }
        })

        // load back ground
        const backgound = new Image();
        backgound.src = './src/images/HUDicons/RadarMap.png';
        backgound.onload = () => {backgroundRef.current = backgound}

        // load origin icon
        const originIcon = new Image();
        originIcon.src = './src/images/HUDicons/DroneRadarOrigin.png';
        originIcon.onload = () => {originIconRef.current = originIcon}


        // setTicks
        let tickArr =[]
        for(let i=30; i<=360; i=i+30){
            tickArr.push({text: i.toString(), value: i, type: "radius"})
        }
        for(let i=20; i<=60; i=i+20){
            tickArr.push({text: i.toString(), value: i, type: "range"})
        }
        setTicks(tickArr)

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
        let index = (timeHUD * dataLength).toFixed() - 1 
        index = Math.min(Math.max(index, 0), dataLength-1);
        const ctx = canvasRef?.current?.getContext("2d");
        const ctxBK = canvasBackGroundRef?.current?.getContext("2d");
        if (!ctx || !ctxBK || !backgroundRef.current) {
            return;
        }
        ctx.clearRect(0,0,windowSize[0]*dpr,windowSize[1]*dpr)
        if((useCsvDataStore.getState().data[index][name + ".isAlive"]=="True") && isOpen){
            let yawOrigin = +useCsvDataStore.getState().data[index][name + ".att.yaw[rad]"]
            radarObjects.forEach((obj)=>{ 
                if(useCsvDataStore.getState().data[index][obj.name + ".isAlive"]=="True"){
                    let dx = useCsvDataStore.getState().data[index][obj.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][name + ".pos.x[m]"]
                    let dy = useCsvDataStore.getState().data[index][obj.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][name + ".pos.y[m]"]
                    let dr = Math.pow(dx*dx+dy*dy,0.5)/1000 // km
                    let theta = Math.atan2(dx,dy) + yawOrigin + Math.PI
                    let yaw = useCsvDataStore.getState().data[index][obj.name + ".att.yaw[rad]"]
                    let PosX = windowSize[0]/2 + dr * Math.cos(theta) * 0.539957 * radius/20 // km -> NM
                    let PosY = windowSize[1]/2 + dr * Math.sin(theta) * 0.539957 * radius/20 // km -> NM
                    
                    ctx.scale(dpr, dpr);
                    ctx.save(); //saves the state of canvas
                    ctx.translate(PosX, PosY); //let's translate
                    ctx.rotate(-yaw + yawOrigin); //increment the angle and rotate the image
                    ctx.drawImage(obj.img, -markerImgSize[0]/2 , -markerImgSize[1]/2, markerImgSize[0], markerImgSize[1]);
                    ctx.restore(); //restore the state of canvas
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }

                if(useCsvDataStore.getState().data[index][obj.name + ".isFlying"]=="True"){
                    let dx = useCsvDataStore.getState().data[index][obj.name + ".pos.x[m]"] - useCsvDataStore.getState().data[index][name + ".pos.x[m]"]
                    let dy = useCsvDataStore.getState().data[index][obj.name + ".pos.y[m]"] - useCsvDataStore.getState().data[index][name + ".pos.y[m]"]
                    let dr = Math.pow(dx*dx+dy*dy,0.5)/1000 // km
                    let theta = Math.atan2(dx,dy) + yawOrigin + Math.PI
                    let yaw = useCsvDataStore.getState().data[index][obj.name + ".att.yaw[rad]"]
                    let PosX = windowSize[0]/2 + dr * Math.cos(theta) * 0.539957 * radius/20 // km -> NM
                    let PosY = windowSize[1]/2 + dr * Math.sin(theta) * 0.539957 * radius/20 // km -> NM
                    
                    ctx.scale(dpr, dpr);
                    ctx.save(); //saves the state of canvas
                    ctx.translate(PosX, PosY); //let's translate
                    ctx.rotate(-yaw + yawOrigin); //increment the angle and rotate the image
                    ctx.drawImage(obj.img, -mrmImgSize[0]/2 , -mrmImgSize[1]/2, mrmImgSize[0], mrmImgSize[1]);
                    ctx.restore(); //restore the state of canvas
                    ctx.setTransform(1, 0, 0, 1, 0, 0);

                    // if target isAlive
                    const target = useCsvDataStore.getState().data[index][obj.name + ".target.truth"]
                    if(useCsvDataStore.getState().data[index][target + ".isAlive"]=="True"){
                        // target pos
                        let dxTgt = useCsvDataStore.getState().data[index][target + ".pos.x[m]"] - useCsvDataStore.getState().data[index][name + ".pos.x[m]"]
                        let dyTgt = useCsvDataStore.getState().data[index][target + ".pos.y[m]"] - useCsvDataStore.getState().data[index][name + ".pos.y[m]"]
                        let drTgt = Math.pow(dxTgt*dxTgt+dyTgt*dyTgt,0.5)/1000 // km
                        let thetaTgt = Math.atan2(dxTgt,dyTgt) + yawOrigin + Math.PI
                        let yawTgt = useCsvDataStore.getState().data[index][target + ".att.yaw[rad]"]
                        let PosXTgt = windowSize[0]/2 + drTgt * Math.cos(thetaTgt) * 0.539957 * radius/20 // km -> NM
                        let PosYTgt = windowSize[1]/2 + drTgt * Math.sin(thetaTgt) * 0.539957 * radius/20 // km -> NM
                        
                        // draw line
                        ctx.lineWidth = 0.5;
                        ctx.scale(dpr, dpr);
                        ctx.save(); //saves the state of canvas
                        ctx.beginPath()
                        ctx.setLineDash([4, 1]);
                        ctx.moveTo(PosX, PosY)
                        ctx.lineTo(PosXTgt, PosYTgt)
                        ctx.strokeStyle = "#ffffff"
                        ctx.stroke()
                        ctx.restore(); //restore the state of canvas
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                    }       
                }
            })

            ctxBK.clearRect(0,0,windowSize[0]*dprBackGround,windowSize[1]*dprBackGround)
            ctxBK.scale(dprBackGround, dprBackGround);
            ctxBK.save(); //saves the state of canvas
            ctxBK.translate(windowSize[0]/2, windowSize[1]/2); //let's translate
            ctxBK.rotate(yawOrigin);
            ctxBK.drawImage(backgroundRef.current, -windowSize[0]*reduceRatio/2 , -windowSize[1]*reduceRatio/2, windowSize[0]*reduceRatio,windowSize[1]*reduceRatio);
            ctxBK.restore(); //restore the state of canvas

            ctxBK.font = "6px Arial";
            ctxBK.fillStyle = "white"
            ticks.forEach((el)=>{
                if(el.type=="radius"){
                    let x = 15 * Math.sin(el.value*Math.PI/180-yawOrigin) * radius/20 + windowSize[0]/2
                    let y = 15 * Math.cos(el.value*Math.PI/180-yawOrigin) * radius/20 + windowSize[1]/2
                    ctxBK.save(); //saves the state of canvas
                    ctxBK.textAlign = "center";
                    ctxBK.textBaseline = "middle";
                    ctxBK.fillText(el.text, x, y);
                    ctxBK.restore(); //restore the state of canvas
                }else{
                    ctxBK.font = "8px Arial";
                    let x = (el.value/3+1) * Math.sin(150*Math.PI/180) * radius/20 + windowSize[0]/2
                    let y = (el.value/3+1) * Math.cos(150*Math.PI/180) * radius/20 + windowSize[1]/2
                    ctxBK.save(); //saves the state of canvas
                    ctxBK.textAlign = "center";
                    ctxBK.textBaseline = "middle";
                    ctxBK.fillText(el.text, x, y);
                    ctxBK.restore(); //restore the state of canvas 
                }
            })

            ctxBK.save(); //saves the state of canvas
            ctxBK.drawImage(originIconRef.current, windowSize[0]/2-5, windowSize[0]/2-5, 10, 10);
            ctxBK.restore(); //restore the state of canvas
            ctxBK.setTransform(1, 0, 0, 1, 0, 0);
        }
        //console.log(radarObjects)
    },[timeHUD, radarObjects])

    useEffect(()=>{
        if(windowSize[0]&&windowSize[1]&&ticks.length!==0){
            const ctx = canvasBackGroundRef?.current?.getContext("2d");
            if (!ctx || !backgroundRef.current || !originIconRef.current) {
                return;
            }

            ctx.clearRect(0,0,windowSize[0],windowSize[1])
            ctx.scale(dprBackGround, dprBackGround);
            ctx.font = "6px Arial";
            ctx.fillStyle = "white"
            ticks.forEach((el)=>{
                if(el.type=="radius"){
                    let x = 15 * Math.sin(el.value*Math.PI/180) * radius/20 + windowSize[0]/2
                    let y = 15 * Math.cos(el.value*Math.PI/180) * radius/20 + windowSize[1]/2
                    ctx.save(); //saves the state of canvas
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(el.text, x, y);
                    ctx.restore(); //restore the state of canvas 
                }else{
                    ctx.font = "8px Arial";
                    let x = (el.value/3+1) * Math.sin(150*Math.PI/180) * radius/20 + windowSize[0]/2
                    let y = (el.value/3+1) * Math.cos(150*Math.PI/180) * radius/20 + windowSize[1]/2
                    ctx.save(); //saves the state of canvas
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(el.text, x, y);
                    ctx.restore(); //restore the state of canvas 
                }
                
            })

            ctx.save(); //saves the state of canvas
            ctx.translate(windowSize[0]/2, windowSize[1]/2); //let's translate
            ctx.drawImage(backgroundRef.current, -windowSize[0]*reduceRatio/2 , -windowSize[1]*reduceRatio/2, windowSize[0]*reduceRatio,windowSize[1]*reduceRatio);
            ctx.restore(); //restore the state of canvas

            ctx.save(); //saves the state of canvas
            ctx.drawImage(originIconRef.current, windowSize[0]/2-5, windowSize[0]/2-5, 10, 10);
            ctx.restore(); //restore the state of canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    },[windowSize, backgroundRef.current, originIconRef.current, canvasBackGroundRef.current, ticks])
    
    return(  
        <Box 
        className="TACCanvasBox" 
        width={w} 
        height={h}
        position="relative"
        ref={parentRef}>
            <canvas ref={canvasRef} width={windowSize[0]* dpr} height={windowSize[1]* dpr} style={{position:"absolute", zIndex:2, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/>      
            <canvas ref={canvasBackGroundRef} width={windowSize[0]* dprBackGround} height={windowSize[1]* dprBackGround} style={{position:"absolute", zIndex:1, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/> 
        </Box>
    )
}

export default TACcanvas