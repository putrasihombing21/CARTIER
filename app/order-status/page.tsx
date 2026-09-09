"use client";
import {useEffect,useState} from 'react';
import {currency} from '@/lib/commerce/catalog';
export default function OrderStatus(){
 const [order,setOrder]=useState<{id:string;total:number;status:string}|null>(null);const [message,setMessage]=useState('Checking your sandbox payment…');
 const [busy,setBusy]=useState(false);
 async function check(){setBusy(true);try{const query=new URLSearchParams(window.location.search);const id=query.get('id')??'';const token=query.get('token')??'';if(!id||!token)throw new Error('No order reference was found.');const response=await fetch(`/api/orders/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${token}`}});const result=await response.json() as {id:string;total:number;status:string;error?:string};if(!response.ok)throw new Error(result.error);setOrder(result);setMessage(result.status==='paid'?'Sandbox payment confirmed. No real charge was made.':result.status==='pending'?'Your sandbox payment is pending. Check again after completing payment.':result.status==='refunded'?'This sandbox payment was refunded.':'This sandbox payment was not completed.');}catch(error){setMessage(error instanceof Error?error.message:'Status is unavailable.');}finally{setBusy(false);}}
 useEffect(()=>{void check();},[]);
 return <main className="success-panel" style={{minHeight:'100svh',paddingTop:130}}><img src="/assets/wordmark.svg" alt="CARTIER" width="185" height="50" style={{margin:'0 auto 50px'}}/><span className="demo-tag">SANDBOX / NO REAL CHARGE</span><h1 style={{fontFamily:'var(--font-display)',fontSize:64,marginTop:30}}>PAYMENT STATUS</h1><p aria-live="polite">{message}</p>{order&&<p className="mono">{order.id}<br/>{currency(order.total)}</p>}<button className="outline-button" style={{margin:'30px auto'}} onClick={check} disabled={busy}>{busy?'CHECKING…':'CHECK AGAIN'}</button><a className="text-link" href="/">BACK TO THE WORLD</a></main>;
}
