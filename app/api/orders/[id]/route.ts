import {env} from 'cloudflare:workers';
import {findOrder} from '@/lib/commerce/orders';
import {sha256,paymentConfig,type PaymentConfig} from '@/lib/commerce/payment';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer'};
 try{const config=paymentConfig(env as PaymentConfig);if(config.mode!=='sandbox')return Response.json({error:'No real order exists in demo mode.'},{status:404,headers});
 const {id}=await params;const token=request.headers.get('Authorization')?.replace(/^Bearer /,'')??'';
 if(!/^[a-f0-9-]{36}$/.test(token)||id.length>50)return Response.json({error:'Order not found.'},{status:404,headers});
 const order=await findOrder(id);if(!order||order.token_hash!==await sha256(token))return Response.json({error:'Order not found.'},{status:404,headers});
 return Response.json({id:order.id,total:order.amount,status:order.status,mode:'sandbox'},{headers});
 }catch{return Response.json({error:'Order status is temporarily unavailable. Try again.'},{status:503,headers});}
}
