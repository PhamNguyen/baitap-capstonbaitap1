'use client';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, Shoe } from '@/store/cartSlice';
import { RootState } from '@/store';
import { toggleFavorite } from '@/store/favoritesSlice';
export function productImage(p:any){return p?.image || p?.imageUrl || p?.img || 'https://placehold.co/600x450/f5f5f5/333?text=Shoes'}
export default function ProductCard({product}:{product:Shoe}){
 const dispatch=useDispatch(); const id=product.id ?? product._id;
 const liked=useSelector((s:RootState)=>s.favorites.items.some(p=>String(p.id??p._id)===String(id)));
 return <article className="product-card"><button className={`favorite ${liked?'liked':''}`} onClick={()=>dispatch(toggleFavorite({...product,id,image:productImage(product)}))} aria-label={liked?'Bỏ yêu thích':'Thêm yêu thích'} title={liked?'Bỏ yêu thích':'Thêm yêu thích'}><Heart size={22} fill={liked?'currentColor':'none'}/></button><Link href={`/product/${id}`} className="product-image"><img src={productImage(product)} alt={product.name||'Giày'} loading="lazy"/></Link><div className="product-info"><Link href={`/product/${id}`} className="product-name">{product.name||'Sản phẩm giày'}</Link><p>{product.shortDescription||product.description||'Thiết kế năng động, thoải mái cho mọi hoạt động.'}</p></div><div className="product-actions"><button onClick={()=>dispatch(addToCart({...product,id, image:productImage(product)}))}><ShoppingBag size={15}/> Thêm giỏ</button><strong>{Number(product.price||0).toLocaleString('vi-VN')}<small>đ</small></strong></div></article>
}
