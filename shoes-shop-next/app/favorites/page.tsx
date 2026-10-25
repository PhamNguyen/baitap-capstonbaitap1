'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import ProductGrid from '@/components/ProductGrid';
import { clearFavorites } from '@/store/favoritesSlice';
export default function FavoritesPage(){
 const items=useSelector((s:RootState)=>s.favorites.items); const dispatch=useDispatch();
 return <div className="page-container"><div className="breadcrumbs">Trang chủ / <b>Sản phẩm yêu thích</b></div><div className="section-heading cart-title"><div><span className="eyebrow">YOUR WISHLIST</span><h1>Sản phẩm yêu thích<span>.</span></h1><p className="muted">{items.length} sản phẩm đã lưu</p></div>{items.length>0&&<button className="outline-button" onClick={()=>dispatch(clearFavorites())}>Xóa danh sách</button>}</div>{items.length?<ProductGrid products={items}/>:<div className="empty-cart"><div className="empty-icon">♡</div><h2>Chưa có sản phẩm yêu thích</h2><p>Nhấn biểu tượng trái tim ở sản phẩm để lưu lại tại đây.</p><Link href="/search" className="primary-button">Khám phá sản phẩm ↗</Link></div>}</div>
}
