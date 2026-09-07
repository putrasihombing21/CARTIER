import {env} from 'cloudflare:workers';
export function ordersDb(){if(!env.DB)throw new Error('Order storage is unavailable.');return env.DB;}
export type StoredOrder={id:string;token_hash:string;amount:number;status:string;created_at:number};
export async function findOrder(id:string){return ordersDb().prepare('SELECT id, token_hash, amount, status, created_at FROM orders WHERE id = ?').bind(id).first<StoredOrder>();}
export async function saveOrder(order:{id:string;tokenHash:string;amount:number;itemsJson:string}){const now=Date.now();return ordersDb().prepare('INSERT INTO orders (id, token_hash, amount, items_json, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(order.id,order.tokenHash,order.amount,order.itemsJson,'pending',now,now).run();}
export async function updateStatus(id:string,status:string){
 // A delayed pending/failed webhook cannot overwrite paid or refunded state.
 return ordersDb().prepare("UPDATE orders SET status = ?, updated_at = ? WHERE id = ? AND status != 'refunded' AND (status != 'paid' OR ? = 'refunded')").bind(status,Date.now(),id,status).run();
}
