"use client";
import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react";
const Scene = lazy(() => import("./metal-scene"));
class CanvasBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onError();}
  render(){return this.state.failed?null:this.props.children;}
}
export default function HeroObject({paused}:{paused:boolean}) {
  const [enabled,setEnabled]=useState(false);
  const [ready,setReady]=useState(false);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
    const evaluate=()=>{
      const forced=new URLSearchParams(window.location.search).get("three")==="off";
      if(media.matches||forced||nav.connection?.saveData||(nav.deviceMemory&&nav.deviceMemory<4)){setEnabled(false);return;}
      // Probe browser support before importing Three, including disabled GPU contexts.
      let supported=false;
      try{const probe=document.createElement("canvas");const context=probe.getContext("webgl2");supported=!!context;context?.getExtension("WEBGL_lose_context")?.loseContext();}catch{supported=false;}
      setEnabled(supported);
    };
    const timer=window.setTimeout(evaluate,1250);
    media.addEventListener("change",evaluate);
    return ()=>{clearTimeout(timer);media.removeEventListener("change",evaluate);};
  },[]);
  return <div className={`hero-object ${ready&&enabled&&!failed?"canvas-ready":""}`} role="img" aria-label="An original split-ring chrome emblem floating in darkness">
    <img className="hero-static" src="/assets/emblem.svg" width="300" height="340" alt="" fetchPriority="high" />
    {enabled&&!failed&&<CanvasBoundary onError={()=>{setFailed(true);setReady(false);}}><Suspense fallback={null}><Scene paused={paused} onReady={()=>setReady(true)} onFail={()=>{setFailed(true);setReady(false);}} /></Suspense></CanvasBoundary>}
  </div>;
}
