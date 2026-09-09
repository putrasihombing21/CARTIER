import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
// Sandbox orders only. Contact details are sent to the provider, never saved here.
export const orders=sqliteTable('orders',{
 id:text('id').primaryKey(), tokenHash:text('token_hash').notNull(),
 amount:integer('amount').notNull(), itemsJson:text('items_json').notNull(),
 status:text('status').notNull().default('pending'),
 createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull(),
},table=>[index('idx_orders_created_at').on(table.createdAt)]);
