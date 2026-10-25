'use client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { setCart } from '@/store/cartSlice';
import { setFavorites } from '@/store/favoritesSlice';
export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try { const saved = localStorage.getItem('shoe-cart'); if (saved) store.dispatch(setCart(JSON.parse(saved))); } catch {}
    try { const saved = localStorage.getItem('shoe-favorites'); if (saved) store.dispatch(setFavorites(JSON.parse(saved))); } catch {}
    const unsubscribe = store.subscribe(() => {
      try { localStorage.setItem('shoe-cart', JSON.stringify(store.getState().cart.items)); } catch {}
      try { localStorage.setItem('shoe-favorites', JSON.stringify(store.getState().favorites.items)); } catch {}
    });
    return unsubscribe;
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
