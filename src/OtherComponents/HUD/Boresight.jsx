

export default function Boresight(props){
    const w = props.canvasW
    const h = props.canvasH   
    const imgSize = props.size
    
    return(  
        <image
        key={"Boresight"}
        href={'/HUDicons/boresight.png'}
        width={imgSize}
        height={imgSize}
        transform ={"translate(" + (w/2-imgSize/2) + " ," + (h/2-imgSize/2) + ")"}
        />
    )
}
