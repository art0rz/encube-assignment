import { extend } from "@react-three/fiber";
import { DoubleSide } from "three";
import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";

const TeapotGeometryElement = extend(TeapotGeometry);

export default function Teapot() {
  return (
    <mesh>
      <TeapotGeometryElement args={[0.7, 12]} />
      <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.15} side={DoubleSide} />
    </mesh>
  );
}
