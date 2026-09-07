export const sizes = ["S", "M", "L", "XL"] as const;
export type Size = typeof sizes[number];
export const products = [
  { id: "after-hours-tee", name: "After Hours Tee", category: "T-SHIRTS", number: "01", price: 450000, image: 0, attitude: "A quiet surface. A loud presence.", description: "An oversized, drop-shoulder silhouette with a dense cotton feel. Washed black. Cut to sit away from the body.", fabric: "Heavyweight cotton study", fit: "Oversized / dropped shoulder" },
  { id: "pressure-jacket", name: "Pressure Jacket", category: "JACKETS", number: "02", price: 1450000, image: 1, attitude: "Built to hold your ground.", description: "A cropped, boxy jacket with a clean metal closure and a deliberate shoulder. Structure without ceremony.", fabric: "Technical cotton study", fit: "Boxy / cropped length" },
  { id: "nightfall-coat", name: "Nightfall Coat", category: "OUTERWEAR", number: "03", price: 1950000, image: 2, attitude: "Carry the weight. Own the night.", description: "An elongated hooded shell shaped around movement. Deep folds, a generous volume, and a silhouette that stays with you.", fabric: "Dense weather-shell study", fit: "Longline / relaxed volume" },
] as const;
export type Product = typeof products[number];
export type CartLine = { id: string; size: Size; quantity: number };
export const currency = (value: number) => `IDR ${new Intl.NumberFormat("en-US", {maximumFractionDigits:0}).format(value)}`;
export const deliveryFee = 30000;
export function getProduct(id: string) { return products.find(product => product.id === id); }
export function calculateCart(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, line) => sum + (getProduct(line.id)?.price ?? 0) * line.quantity, 0);
  return { subtotal, shipping: lines.length ? deliveryFee : 0, total: subtotal + (lines.length ? deliveryFee : 0) };
}
