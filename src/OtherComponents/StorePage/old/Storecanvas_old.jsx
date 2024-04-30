import { Box } from "@mui/material";
import React, {useEffect, useRef, useContext} from "react"
import StoreBackground from "./StoreBackGround";
import { useCsvDataStore } from "../../Store"
import { isOpenContext } from "../videoLayerComponents/TableItem";

const Storecanvas = (props) =>{
    const w = props.w
    const h = props.h
    const name = props.name
    const backgroundColor = props.bkColor
    const time = useCsvDataStore(state => state.time);
    const dataLength = useCsvDataStore.getState().dataLength
    const MRMimageSize=30
    const offsetY = 20
    const pos = [{x: 11, y: 15-offsetY},{x: -11, y: 15-offsetY},{x: 4, y: 10-offsetY},{x: -4, y: 10-offsetY}]
    const MRMrefs = useRef([])
    const isOpen = useContext(isOpenContext);

    useEffect(()=>{
        if(dataLength !== 0 ){
            let index = (time * dataLength).toFixed() - 1 
            index = Math.min(Math.max(index, 0), dataLength-1);
            if((useCsvDataStore.getState().data[index][props.name + ".isAlive"]=="True") && isOpen){
                //console.log(ref.current.getAttribute('transform'))
                
                let numMRM = (useCsvDataStore.getState().data[index][props.name + ".MRM"] )
 
                if(numMRM==4){
                    for(let i=0;i<4;i++){
                        MRMrefs.current[i].setAttribute('visibility',"visible")
                    }
                }else if(numMRM==3){
                    MRMrefs.current[0].setAttribute('visibility',"hidden")
                    MRMrefs.current[1].setAttribute('visibility',"visible")
                    MRMrefs.current[2].setAttribute('visibility',"visible")
                    MRMrefs.current[3].setAttribute('visibility',"visible")
                }else if(numMRM==2){
                    MRMrefs.current[0].setAttribute('visibility',"hidden")
                    MRMrefs.current[1].setAttribute('visibility',"hidden")
                    MRMrefs.current[2].setAttribute('visibility',"visible")
                    MRMrefs.current[3].setAttribute('visibility',"visible")
                }else if(numMRM==1){
                    MRMrefs.current[0].setAttribute('visibility',"hidden")
                    MRMrefs.current[1].setAttribute('visibility',"hidden")
                    MRMrefs.current[2].setAttribute('visibility',"hidden")
                    MRMrefs.current[3].setAttribute('visibility',"visible")
                }else if(numMRM==0){
                    MRMrefs.current[0].setAttribute('visibility',"hidden")
                    MRMrefs.current[1].setAttribute('visibility',"hidden")
                    MRMrefs.current[2].setAttribute('visibility',"hidden")
                    MRMrefs.current[3].setAttribute('visibility',"hidden")
                }
                //console.log(move)
            }else{
                for(let i=0;i<4;i++){
                    MRMrefs.current[i].setAttribute('visibility',"hidden")
                }
            }
        }
    },[time])

    return(  
        <Box 
        width={w} 
        height={h}>
                <svg 
                position="relative"
                width={w} 
                height={h}
                style={{ 
                backgroundColor: backgroundColor,
                backgroundSize: "100%", 
                backgroundPosition: "center",
                }}> 
                <StoreBackground canvasW={w} canvasH={h} size={w*0.8} offset={offsetY}/>
                {
                    pos.map((el,i)=>{
                        return(
                            <image
                                key={"MRM"+i}
                                href={'/HUDicons/MRM.png'}
                                width={MRMimageSize}
                                height={MRMimageSize}
                                transform ={"translate(" + (w/2-MRMimageSize/2+el.x) + " ," + (h/2-MRMimageSize/2+el.y) + ")"}
                                ref={element => MRMrefs.current[i] = element}
                                />
                        )
                    })
                }
                
                </svg>
        </Box>
    )
}

export default Storecanvas