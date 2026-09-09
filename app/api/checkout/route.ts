import {env} from 'cloudflare:workers';
import {validateCheckout,readLimitedJson,sameOrigin} from '@/lib/commerce/validation';
import {paymentConfig,createSandboxPayment,sha256,type PaymentConfig} from '@/lib/commerce/payment';
import {saveOrder,updateStatus} from '@/lib/commerce/orders';
const headers={'Cache-Control':'no-store'};
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'This checkout request is not allowed.'},{status:403,headers});
 let order;try{order=validateCheckout(await readLimitedJson(request));}catch(error){return Response.json({error:error instanceof SyntaxError?'Invalid request.':error instanceof Error?error.message:'Invalid checkout.'},{status:400,headers});}
 let config;try{config=paymentConfig(env as PaymentConfig);}catch{return Response.json({error:'Sandbox payment is not configured. Please contact the store owner.'},{status:503,headers});}
 const id=`${config.mode==='demo'?'DEMO':'C'}-${crypto.randomUUID()}`;
 // Demo makes no external call and stores neither customer details nor orders.
 if(config.mode==='demo')return Response.json({id,total:order.total,mode:'demo'},{headers});
 try{
 const token=crypto.randomUUID();
 await saveOrder({id,tokenHash:await sha256(token),amount:order.total,itemsJson:JSON.stringify(order.items)});
 let redirectUrl;try{redirectUrl=await createSandboxPayment(config,{...order,id,token});}catch{await updateStatus(id,'failed');throw new Error('Payment unavailable.');}
 return Response.json({id,total:order.total,mode:'sandbox',redirectUrl},{headers});
 }catch{return Response.json({error:'Payment is temporarily unavailable. Your bag is unchanged; please try again.'},{status:503,headers});}
}
