import {useLoader} from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
///////////////////////////////// Ground /////////////////////////////////
export default function GroundPlaneBase(){
  const backgroundPath = import.meta.env.BASE_URL + "texture/alphaMapGround3.png"
    const alphaMap = useLoader(TextureLoader, backgroundPath)
    return (
      <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -0.25, 0]}>
        <planeGeometry args={[50, 50]}/>
        <meshBasicMaterial alphaMap={alphaMap} color={0x696969} transparent={true}/>
      </mesh>
    )
  }
  