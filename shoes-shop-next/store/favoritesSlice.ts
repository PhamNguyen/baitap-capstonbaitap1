import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Shoe } from './cartSlice';
type FavoritesState = { items: Shoe[] };
const favoritesSlice = createSlice({ name: 'favorites', initialState: { items: [] } as FavoritesState, reducers: {
  toggleFavorite(state, action: PayloadAction<Shoe>) {
    const id = String(action.payload.id ?? action.payload._id);
    const index = state.items.findIndex(p => String(p.id ?? p._id) === id);
    if (index >= 0) state.items.splice(index, 1);
    else state.items.push(action.payload);
  },
  setFavorites(state, action: PayloadAction<Shoe[]>) { state.items = action.payload; },
  clearFavorites(state) { state.items = []; }
}});
export const { toggleFavorite, setFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
