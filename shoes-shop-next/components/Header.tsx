'use client';
import Link from 'next/link';
import { Search, ShoppingCart, UserRound, Heart, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect, useState } from 'react';

type UserInfo = { name?: string; email?: string; avatar?: string; picture?: string; provider?: string };
export default function Header() {
  const [q, setQ] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);
  const count = useSelector((s: RootState) => s.cart.items.reduce((n, i) => n + (i.quantity || 1), 0));
  const favorites = useSelector((s: RootState) => s.favorites.items.length);
  useEffect(() => {
    const readUser = () => { try { const raw = localStorage.getItem('shoe-user'); setUser(raw ? JSON.parse(raw) : null); } catch { setUser(null); } };
    readUser(); window.addEventListener('storage', readUser); window.addEventListener('shoe-auth-changed', readUser);
    return () => { window.removeEventListener('storage', readUser); window.removeEventListener('shoe-auth-changed', readUser); };
  }, []);
  function logout() {
    localStorage.removeItem('shoe-user'); localStorage.removeItem('shoe-token'); localStorage.removeItem('shoe-facebook-user');
    setUser(null); window.dispatchEvent(new Event('shoe-auth-changed')); window.location.href = '/';
  }
  const avatar = user?.avatar || user?.picture;
  const displayName = user?.name || user?.email?.split('@')[0] || 'Tài khoản';
  return <header className="site-header"><div className="topbar">
    <Link href="/" className="brand"><span className="brand-mark">C</span><span>CYBERSOFT<small>SHOES STORE</small></span></Link>
    <form className="search-mini" action="/search"><input name="q" value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm kiếm sản phẩm..."/><button aria-label="Tìm kiếm"><Search size={18}/></button></form>
    <div className="top-links">
      <Link href="/favorites" className="cart-link" title="Sản phẩm yêu thích"><Heart size={17}/><span>Yêu thích</span><b>{favorites}</b></Link>
      <Link href="/cart" className="cart-link"><ShoppingCart size={18}/><span>Giỏ hàng</span><b>{count}</b></Link>
      {user ? <><Link href="/profile" className="user-chip" title={displayName}>{avatar ? <img className="header-avatar" src={avatar} alt="Ảnh đại diện"/> : <span className="header-avatar-fallback">{displayName.slice(0,1).toUpperCase()}</span>}<span className="header-user-name">{displayName}</span></Link><button type="button" className="header-logout" onClick={logout} title="Đăng xuất"><LogOut size={15}/><span>Thoát</span></button></> : <><Link href="/login"><UserRound size={17}/> Đăng nhập</Link><Link href="/register">Đăng ký</Link></>}
    </div>
  </div><nav className="nav"><Link href="/">Trang chủ</Link><Link href="/search?category=Men">Nam</Link><Link href="/search?category=Women">Nữ</Link><Link href="/search?category=Kid">Trẻ em</Link><Link href="/search?category=Sport">Thể thao</Link><Link href="/profile">Tài khoản</Link></nav></header>;
}
