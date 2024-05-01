import {useLoader} from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
///////////////////////////////// Ground /////////////////////////////////
export default function GroundPlane(){
const backgroundPath = import.meta.env.BASE_URL + "texture/alphaMapGround3.png"
const alphaMap = useLoader(TextureLoader, backgroundPath)
return (
    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
    <planeGeometry args={[50, 50]}/>
    <meshBasicMaterial alphaMap={alphaMap} color={0x788e9d} transparent={true}/>
    </mesh>
)
}