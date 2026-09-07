import {env} from 'cloudflare:workers';
import {z} from 'zod';
import {readLimitedJson} from '@/lib/commerce/validation';
import {paymentConfig,verifyNotification,getProviderStatus,normalizePaymentStatus,type PaymentConfig} from '@/lib/commerce/payment';
import {findOrder,updateStatus} from '@/lib/commerce/orders';
const schema=z.object({order_id:z.string().min(1).max(50),status_code:z.string().max(10),gross_amount:z.string().max(20),signature_key:z.string().length(128)});
export async function POST(request:Request){
 let config;try{config=paymentConfig(env as PaymentConfig);}catch{return new Response('Unavailable',{status:503});}
 if(config.mode!=='sandbox')return new Response('Payment integration is inactive',{status:503});
 let body;try{body=schema.parse(await readLimitedJson(request,20000));}catch{return new Response('Invalid notification',{status:400});}
 if(!await verifyNotification(body,config.key))return new Response('Invalid signature',{status:401});
 try{
 const order=await findOrder(body.order_id);if(!order)return new Response('Order not found',{status:404});
 if(Number(body.gross_amount)!==order.amount)return new Response('Amount mismatch',{status:409});
 // Fetch authoritative status; redirects and webhook fields alone never mark paid.
 const verified=await getProviderStatus(order.id,config.key);
 if(verified.order_id!==order.id||Number(verified.gross_amount)!==order.amount||verified.currency&&verified.currency!=='IDR')return new Response('Transaction mismatch',{status:409});
 await updateStatus(order.id,normalizePaymentStatus(verified.transaction_status,verified.fraud_status));
 return Response.json({received:true});
 }catch{return new Response('Please retry later',{status:503});}
}
