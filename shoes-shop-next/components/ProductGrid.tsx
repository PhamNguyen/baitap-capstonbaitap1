import ProductCard from './ProductCard';
export default function ProductGrid({products}:{products:any[]}){if(!products?.length)return <div className="empty-state">Chưa tìm thấy sản phẩm phù hợp.</div>;return <div className="product-grid">{products.map((p:any,i:number)=><ProductCard key={p.id??p._id??i} product={p}/>)}</div>}
