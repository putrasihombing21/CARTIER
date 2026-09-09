"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
function Sculpture({paused}:{paused:boolean}){
  const group=useRef<THREE.Group>(null);
  const pointer=useRef({x:0,y:0});
  const elapsed=useRef(0);
  const {gl,scene}=useThree();
  const geometry=useMemo(()=>{
    const points=[[258,58],[222,119],[192,98],[131,90],[90,127],[82,195],[111,240],[177,248],[216,219],[256,240],[220,289],[180,307],[97,290],[44,237],[29,170],[47,98],[101,42],[180,26]];
    const shape=new THREE.Shape(points.map(([x,y])=>new THREE.Vector2((x-145)/100,(170-y)/100)));
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.065,bevelThickness:.065,curveSegments:8});
    geo.center();geo.computeVertexNormals();return geo;
  },[]);
  useEffect(()=>{
    const pmrem=new THREE.PMREMGenerator(gl);
    const room=new RoomEnvironment();
    const target=pmrem.fromScene(room,.04);
    scene.environment=target.texture;
    const move=(event:PointerEvent)=>{pointer.current={x:event.clientX/window.innerWidth-.5,y:event.clientY/window.innerHeight-.5};};
    window.addEventListener("pointermove",move,{passive:true});
    return ()=>{window.removeEventListener("pointermove",move);scene.environment=null;target.dispose();room.dispose();pmrem.dispose();geometry.dispose();};
  },[gl,scene,geometry]);
  useFrame((_,delta)=>{
    if(!group.current||paused)return;
    elapsed.current+=Math.min(delta,.05);
    const t=elapsed.current;
    group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,.15+pointer.current.y*.25,.035);
    group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,Math.sin(t*.19)*.42+pointer.current.x*.4,.035);
    group.current.rotation.z=-.24+Math.sin(t*.13)*.045;
    group.current.position.y=Math.sin(t*.35)*.045;
  });
  return <group ref={group} rotation={[.15,-.18,-.24]}>
    <mesh geometry={geometry}><meshStandardMaterial color="#c6c9ca" metalness={1} roughness={.19} envMapIntensity={2.5}/></mesh>
    <mesh position={[.97,.04,.1]} rotation={[0,0,.35]}><boxGeometry args={[.48,.2,.28]}/><meshStandardMaterial color="#c6c9ca" metalness={1} roughness={.18} envMapIntensity={2.5}/></mesh>
  </group>;
}

export default function MetalScene({paused,onReady,onFail}:{paused:boolean;onReady:()=>void;onFail:()=>void}){
  const container=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(true);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(container.current)observer.observe(container.current);return ()=>observer.disconnect();},[]);
  return <div ref={container} className="hero-3d"><Canvas dpr={[1,1.35]} camera={{position:[0,0,5.5],fov:41}} frameloop={paused||!visible?"demand":"always"} gl={{antialias:true,alpha:true,powerPreference:"low-power"}} onCreated={({gl})=>{gl.domElement.addEventListener("webglcontextlost",onFail,{once:true});onReady();}} fallback={null}>
    <ambientLight intensity={.4}/><directionalLight position={[2,4,4]} intensity={4}/><pointLight position={[-3,-1,2]} color="#a3a6ac" intensity={15}/><Sculpture paused={paused}/>
  </Canvas></div>;
}
