import { getProduct, type CartLine } from './catalog';
export type PaymentConfig={PAYMENT_MODE?:string;MIDTRANS_SERVER_KEY?:string;SITE_ORIGIN?:string};
export function paymentConfig(env:PaymentConfig){
 const mode=env.PAYMENT_MODE??'demo';
 if(mode==='demo')return {mode:'demo' as const};
 // Production is intentionally unavailable while sample garments/prices remain.
 if(mode!=='midtrans_sandbox')throw new Error('Live payments are not enabled for this prototype.');
 if(!env.MIDTRANS_SERVER_KEY?.startsWith('SB-Mid-server-'))throw new Error('Sandbox payment is not configured.');
 const origin=new URL(env.SITE_ORIGIN??'invalid');if(origin.protocol!=='https:')throw new Error('A secure return address is required.');
 return {mode:'sandbox' as const,key:env.MIDTRANS_SERVER_KEY,origin:origin.origin};
}
export async function createSandboxPayment(config:{key:string;origin:string},order:{id:string;token:string;total:number;shipping:number;items:CartLine[];customer:{name:string;email:string;phone:string;address:string;city:string;postalCode:string}}){
 const response=await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions',{method:'POST',signal:AbortSignal.timeout(12000),headers:{Authorization:`Basic ${btoa(config.key+':')}`,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({transaction_details:{order_id:order.id,gross_amount:order.total},item_details:[...order.items.map(line=>({id:`${line.id}-${line.size}`,price:getProduct(line.id)!.price,quantity:line.quantity,name:`${getProduct(line.id)!.name} / ${line.size}`})),{id:'delivery',price:order.shipping,quantity:1,name:'Standard delivery (demo)'}],customer_details:{first_name:order.customer.name,email:order.customer.email,phone:order.customer.phone,shipping_address:{first_name:order.customer.name,phone:order.customer.phone,address:order.customer.address,city:order.customer.city,postal_code:order.customer.postalCode,country_code:'IDN'}},credit_card:{secure:true},callbacks:{finish:`${config.origin}/order-status?id=${order.id}&token=${order.token}`},expiry:{unit:'hours',duration:1}})});
 if(!response.ok)throw new Error('The payment provider is unavailable. Please try again.');
 const body=await response.json() as {redirect_url?:string};
 if(!body.redirect_url)throw new Error('The payment provider returned an incomplete response.');
 const url=new URL(body.redirect_url);
 if(url.origin!=='https://app.sandbox.midtrans.com')throw new Error('Unexpected payment redirect.');
 return url.toString();
}
export async function sha256(value:string){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));}
function hex(value:ArrayBuffer){return [...new Uint8Array(value)].map(byte=>byte.toString(16).padStart(2,'0')).join('');}
export async function verifyNotification(body:{order_id:string;status_code:string;gross_amount:string;signature_key:string},key:string){
 const expected=hex(await crypto.subtle.digest('SHA-512',new TextEncoder().encode(body.order_id+body.status_code+body.gross_amount+key)));
 if(body.signature_key.length!==expected.length)return false;
 let diff=0;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^body.signature_key.charCodeAt(i);return diff===0;
}
export function normalizePaymentStatus(status:string,fraud?:string){
 if(status==='settlement'||(status==='capture'&&fraud==='accept'))return 'paid';
 if(status==='refund'||status==='partial_refund')return 'refunded';
 if(['cancel','deny','expire'].includes(status))return 'failed';
 return 'pending';
}
export async function getProviderStatus(id:string,key:string){
 const response=await fetch(`https://api.sandbox.midtrans.com/v2/${encodeURIComponent(id)}/status`,{headers:{Authorization:`Basic ${btoa(key+':')}`,Accept:'application/json'},signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('Payment status could not be verified.');
 return await response.json() as {order_id:string;gross_amount:string;transaction_status:string;fraud_status?:string;currency?:string};
}
