import { Box } from "@mui/material";
import React, {useEffect, useRef, useState, useContext} from "react"
import { isOpenContext } from "../videoLayerComponents/TableItem";
import { useCsvDataStore } from "../../Store"

function getDeltaDegree(angle, tickAngle){
    if((tickAngle - angle)<-90){
        return (tickAngle - angle) + 360
    }else if((tickAngle - angle)>180){
        return (tickAngle - angle) - 360
    }else{
        return (tickAngle - angle)
    }
}

const HUDcanvasSimple = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.name
    const backgroundColor = props.bkColor
    const timeHUD = useCsvDataStore(state => state.timeHUD)
    const dataLength = useCsvDataStore.getState().dataLength
    const parentRef = useRef()
    const canvasBackGroundRef = useRef()
    const canvasRef = useRef()
    const [HUDObjects, setHUDObjects] = useState([])
    const [windowSize, setWindowSize] = useState([])
    const isOpen = useContext(isOpenContext);
    const dprBackGround = 2
    const dpr = 2
    const headdingRangeOnCanvas = 20
    const pitchLadderRangeOnCanvas = 20
    const campassTopPos = 10
    const dy = 7
    const tickSizeLarge = [1, 5]
    const tickSize = [1, 3]
    const pitchLadderSize = [40, 4]
    const pitchLadderPosImgPath = import.meta.env.BASE_URL + "HUDicons/pitch_positive.png"
    const pitchLadderNegImgPath = import.meta.env.BASE_URL + "HUDicons/pitch_negative.png"
    const pitchLadderHorImgPath = import.meta.env.BASE_URL + "HUDicons/pitch_horizon.png"
    const tickImgPath = import.meta.env.BASE_URL + "HUDicons/tick_small.png"
    const tickLargeImgPath = import.meta.env.BASE_URL + "HUDicons/tick_large.png"
    const boresightImgPath = import.meta.env.BASE_URL + "HUDicons/boresight.png"
    const indicatorImgPath = import.meta.env.BASE_URL + "HUDicons/indicator.png"
    const indicatorAltImgPath = import.meta.env.BASE_URL + "HUDicons/indicatorAlt.png"

    // Init
    useEffect(() => {
        let HUDobjectsArr = []
        const setHUDobject = (ImgPath, name, text, type, val)=>{
            let HUDObject = {}
            const img = new Image();
            img.src = ImgPath;
            img.onload = () => {
                HUDObject.name = name
                HUDObject.text = text
                HUDObject.img = img
                HUDObject.type = type
                HUDObject.value = val
                HUDobjectsArr.push(HUDObject)
                setHUDObjects(HUDobjectsArr)
            };
        }

        // setCompassTicks
        for(let i=1; i<=360; i++){
            if(i%5==0){
                if(i==90){
                    setHUDobject(tickLargeImgPath, name, "E", 'headding_large', i)
                }else if(i==180){
                    setHUDobject(tickLargeImgPath, name, "S", 'headding_large', i)  
                }else if(i==270){
                    setHUDobject(tickLargeImgPath, name, "W", 'headding_large', i)  
                }else if(i==360){
                    setHUDobject(tickLargeImgPath, name, "N", 'headding_large', i)   
                }else{
                    setHUDobject(tickLargeImgPath, name, i.toString(), 'headding_large', i) 
                }
            }else{
                setHUDobject(tickImgPath, name, i.toString(), 'headding', i)
            }
        }

        // setPitchLadder
        for(let i=-125; i<126; i=i+5){
            if (i==0){
                setHUDobject(pitchLadderHorImgPath, name, (i).toString(), 'pitch_ladder', i)
            }else if(i<0){
                setHUDobject(pitchLadderNegImgPath, name, (i).toString(), 'pitch_ladder', i)
            }else{
                setHUDobject(pitchLadderPosImgPath, name, (i).toString(), 'pitch_ladder', i)
            }
        }

        // set BoreSight
        setHUDobject(boresightImgPath, name, "0", 'boresight', 0)
        // set IndicatorSpeed
        setHUDobject(indicatorImgPath, name, "0", 'indicator', 0)
        // set IndicatorAlt
        setHUDobject(indicatorAltImgPath, name, "0", 'indicatorAlt', 0)

        // This defines an event canvas parent box is resized
        if (!parentRef.current) return;
            const resizeObserver = new ResizeObserver(() => {
                setWindowSize([
                    parentRef.current.clientWidth, 
                    parentRef.current.clientHeight])
            });
            resizeObserver.observe(parentRef.current);
            return () => resizeObserver.disconnect(); // clean up 
    }, [])

    useEffect(()=>{
        let index = (timeHUD * dataLength).toFixed() - 1 
        index = Math.min(Math.max(index, 0), dataLength-1);
        const ctx = canvasRef?.current?.getContext("2d");
        if (!ctx ) {
            return;
        }
        ctx.font = "6px Arial";
        ctx.fillStyle = "white"
        ctx.scale(dpr, dpr);
        ctx.clearRect(0,0,windowSize[0]*dpr,windowSize[1]*dpr)
        if((useCsvDataStore.getState().data[index][name + ".isAlive"]=="True") && isOpen){
            // Compass
            let yaw = +useCsvDataStore.getState().data[index][name + ".att.yaw[rad]"] * 180/Math.PI
            const CompassTicksFiltered = HUDObjects
                .filter((el)=>{return (el.type=="headding_large" || el.type=="headding")})
                .filter((el)=>{
                    let delta = getDeltaDegree(yaw,el.value)
                    return (delta<=headdingRangeOnCanvas/2)&&(delta>-headdingRangeOnCanvas/2)
                })
            CompassTicksFiltered.forEach((el, i) => {
                let delta = getDeltaDegree(yaw,el.value)
                
                if(el.type=="headding_large"){
                    let x =  Math.floor((delta/headdingRangeOnCanvas * windowSize[0]) + windowSize[0]/2)
                    ctx.save(); //saves the state of canvas
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(el.text, x, campassTopPos);
                    ctx.restore(); //restore the state of canvas 

                    ctx.save(); //saves the state of canvas
                    ctx.translate(x, campassTopPos+dy); //let's translate
                    ctx.drawImage(el.img, -tickSizeLarge[0]/2 , -tickSizeLarge[1]/2, tickSizeLarge[0], tickSizeLarge[1]);
                    ctx.restore(); //restore the state of canvas
                }else{
                    let x =  (delta/headdingRangeOnCanvas * windowSize[0]) + windowSize[0]/2
                    ctx.save(); //saves the state of canvas
                    ctx.translate(x, campassTopPos+dy+(tickSizeLarge[1]-tickSize[1])/2); //let's translate
                    ctx.drawImage(el.img, -tickSize[0]/2 , -tickSize[1]/2, tickSize[0], tickSize[1]);
                    ctx.restore(); //restore the state of canvas
                }
            })

            // Pitch Ladder
            let pitch = (useCsvDataStore.getState().data[index][name + ".att.pitch[rad]"] )*180/Math.PI
            let roll = -(useCsvDataStore.getState().data[index][name + ".att.roll[rad]"] )*180/Math.PI
                
            if(pitch>90){
                roll= roll + 180
                pitch = 180 - pitch
            }else if (pitch<-90){
                roll= roll - 180
                pitch = 180 - pitch
            }

            const PitchLadderFiltered = HUDObjects
            .filter((el)=>{return (el.type=="pitch_ladder")})
            .filter((el)=>{
                let delta = -getDeltaDegree(pitch,el.value)
                return (delta<=pitchLadderRangeOnCanvas/2)&&(delta>-pitchLadderRangeOnCanvas/2)
            })
            
            PitchLadderFiltered.forEach((el, i) => {
                let delta = -getDeltaDegree(pitch,el.value)
                
                //let x = Math.floor(windowSize[0]/2)
                //let y = Math.floor((delta/pitchLadderRangeOnCanvas * windowSize[1]*0.6) + windowSize[1]/2)
                let x = 0
                let y = Math.floor(delta/pitchLadderRangeOnCanvas * windowSize[1]*0.6)
                ctx.translate(windowSize[0]/2,  windowSize[1]/2); //let's translate
                ctx.rotate(roll*Math.PI/180);

                ctx.save(); //saves the state of canvas
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(el.text, x+30, y);
                ctx.restore(); //restore the state of canvas 

                ctx.save(); //saves the state of canvas
                ctx.translate(x, y); //let's translate
                ctx.drawImage(el.img, -pitchLadderSize[0]/2 , -pitchLadderSize[1]/2, pitchLadderSize[0], pitchLadderSize[1]);
                ctx.restore(); //restore the state of canvas
                ctx.rotate(-roll*Math.PI/180);
                ctx.translate(-windowSize[0]/2,  -windowSize[1]/2); // Get Back to origin
            })

            // speed indicate
            let vt = useCsvDataStore.getState().data[index][props.name + ".vt[m/s]"] * 1.944
            ctx.font = "10px Arial";
            ctx.save(); //saves the state of canvas
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(vt.toFixed().toString(), 2, windowSize[1]/2);
            ctx.restore(); //restore the state of canvas 

             // Alt indicate
             let alt = -useCsvDataStore.getState().data[index][props.name + ".pos.z[m]"]*3.28084
            alt = (alt/10).toFixed().toString() + "0" 
            if(alt>=10000){
                alt = alt.slice(0,2) + "," + alt.slice(2,5)
            }else{
                alt = alt.slice(0,1) + "," + alt.slice(1,4)
            }

             ctx.save(); //saves the state of canvas
             ctx.textAlign = "right";
             ctx.textBaseline = "middle";
             ctx.fillText(alt, windowSize[0], windowSize[1]/2);
             ctx.restore(); //restore the state of canvas 

            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset dpr scale
        }

    },[timeHUD])

    useEffect(()=>{
        if(windowSize[0]&&windowSize[1]&&HUDObjects.length!==0){
            const ctxBK = canvasBackGroundRef?.current?.getContext("2d");
            const boresight = HUDObjects.filter((el)=>{return(el.type=="boresight")})[0]
            const indicator = HUDObjects.filter((el)=>{return(el.type=="indicator")})[0]
            const indicatorAlt = HUDObjects.filter((el)=>{return(el.type=="indicatorAlt")})[0]
            if (!ctxBK || !boresight || !indicator || !indicatorAlt) {
                return;
            }
            const boresightSize = [10,6]
            const indicatorSize = [30,13]
            const indicatorAltSize = [40,13]
            
            ctxBK.clearRect(0,0,windowSize[0]*dprBackGround,windowSize[1]*dprBackGround)
            ctxBK.scale(dprBackGround, dprBackGround);
            ctxBK.save(); //saves the state of canvas
            ctxBK.translate(windowSize[0]/2, windowSize[1]/2); //let's translate
            ctxBK.drawImage(boresight.img, -boresightSize[0]/2 , -boresightSize[1]/2, boresightSize[0], boresightSize[1]);
            ctxBK.restore(); //restore the state of canvas
            ctxBK.setTransform(1, 0, 0, 1, 0, 0); // reset dpr scale
            /*
            ctxBK.save(); //saves the state of canvas
            ctxBK.drawImage(indicator.img, 0, Math.floor(windowSize[1]/2-indicatorSize[1]/2), indicatorSize[0], indicatorSize[1]);
            ctxBK.restore(); //restore the state of canvas

            ctxBK.save(); //saves the state of canvas
            ctxBK.translate(Math.floor(windowSize[0]-indicatorAltSize[0]/2), Math.floor(windowSize[1]/2-indicatorAltSize[1]/2)); //let's translate
            ctxBK.rotate(Math.PI)
            ctxBK.drawImage(indicatorAlt.img, Math.floor(-indicatorAltSize[0]/2), Math.floor(-indicatorAltSize[1]), indicatorAltSize[0], indicatorAltSize[1]);
            ctxBK.restore(); //restore the state of canvas
            ctxBK.setTransform(1, 0, 0, 1, 0, 0);
            */

        }
    },[windowSize, canvasBackGroundRef.current, HUDObjects])
    

    
    return(  
        <Box 
        className="HUDCanvasBox" 
        width={w} 
        height={h}
        position="relative"
        ref={parentRef}>
            <canvas ref={canvasRef} width={windowSize[0]* dpr} height={windowSize[1]* dpr} style={{position:"absolute", zIndex:2, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/>      
            <canvas ref={canvasBackGroundRef} width={windowSize[0]* dprBackGround} height={windowSize[1]* dprBackGround} style={{position:"absolute", zIndex:1, top:0, left:0, width: windowSize[0] + "px", height: windowSize[1]+ "px"}}/> 
        </Box>
    )
}

export default HUDcanvasSimple