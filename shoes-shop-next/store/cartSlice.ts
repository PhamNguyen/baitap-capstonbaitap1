import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type Shoe = { id: number | string; name: string; price: number; image?: string; imageUrl?: string; description?: string; shortDescription?: string; quantity?: number; selectedSize?: string; [key: string]: any };
type CartState = { items: Shoe[] };
const initialState: CartState = { items: [] };
const sameLine = (a:Shoe,b:Shoe) => String(a.id ?? a._id) === String(b.id ?? b._id) && String(a.selectedSize||'') === String(b.selectedSize||'');
const cartSlice = createSlice({ name: 'cart', initialState, reducers: {
  addToCart(state, action: PayloadAction<Shoe>) { const found = state.items.find(i => sameLine(i,action.payload)); if (found) found.quantity = (found.quantity || 1) + (action.payload.quantity || 1); else state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 }); },
  removeFromCart(state, action: PayloadAction<string | number | {id:string|number;selectedSize?:string}>) { const target:{id:string|number;selectedSize?:string}=typeof action.payload==='object'?action.payload:{id:action.payload}; state.items = state.items.filter(i => !(String(i.id)===String(target.id) && (target.selectedSize===undefined || String(i.selectedSize||'')===String(target.selectedSize||'')))); },
  setQuantity(state, action: PayloadAction<{id: string | number; quantity: number; selectedSize?:string}>) { const found = state.items.find(i => String(i.id) === String(action.payload.id) && String(i.selectedSize||'')===String(action.payload.selectedSize||'')); if (found) found.quantity = Math.max(1, action.payload.quantity); },
  clearCart(state) { state.items = []; }, setCart(state, action: PayloadAction<Shoe[]>) { state.items = action.payload; }
}});
export const { addToCart, removeFromCart, setQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
