import {z} from 'zod';
import {calculateCart,getProduct,sizes,type CartLine} from './catalog';
export const checkoutSchema=z.object({
  items:z.array(z.object({id:z.string().max(60),size:z.enum(sizes),quantity:z.number().int().min(1).max(5)}).strict()).min(1).max(12),
  customer:z.object({name:z.string().trim().min(2).max(80),email:z.string().trim().email().max(254),phone:z.string().trim().regex(/^[+0-9 ()-]{8,20}$/),address:z.string().trim().min(5).max(200),city:z.string().trim().min(2).max(80),postalCode:z.string().regex(/^\d{5}$/)}).strict(),
}).strict();
export function validateCheckout(value:unknown){
 const parsed=checkoutSchema.safeParse(value);
 if(!parsed.success)throw new Error('Check your contact details, address and five-digit postal code.');
 const {items,customer}=parsed.data;
 const seen=new Set<string>();
 for(const line of items){if(!getProduct(line.id))throw new Error('A piece in your bag is unavailable. Please remove it.');const key=`${line.id}:${line.size}`;if(seen.has(key))throw new Error('Duplicate bag entries are not accepted.');seen.add(key);}
 return {items:items as CartLine[],customer,...calculateCart(items as CartLine[])};
}
export async function readLimitedJson(request:Request,maxBytes=12000){
 if(!request.headers.get('content-type')?.includes('application/json'))throw new Error('JSON is required.');
 const reader=request.body?.getReader();if(!reader)throw new Error('Request body is required.');
 const chunks:Uint8Array[]=[];let total=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>maxBytes){await reader.cancel();throw new Error('Request is too large.');}chunks.push(value);}}finally{reader.releaseLock();}
 const joined=new Uint8Array(total);let offset=0;for(const chunk of chunks){joined.set(chunk,offset);offset+=chunk.length;}
 return JSON.parse(new TextDecoder().decode(joined));
}
export function sameOrigin(request:Request){return request.headers.get('origin')===new URL(request.url).origin;}
