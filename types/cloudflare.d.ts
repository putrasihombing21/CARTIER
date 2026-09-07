/// <reference types="@cloudflare/workers-types" />
declare namespace Cloudflare {
 interface Env {DB?:D1Database;PAYMENT_MODE?:string;MIDTRANS_SERVER_KEY?:string;SITE_ORIGIN?:string;}
}
