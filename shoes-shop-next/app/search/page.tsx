'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { useSearchParams } from 'next/navigation';
import { apiGet, unwrap } from '@/lib/api';

function getCategoryText(product: any): string[] {
  const values: any[] = [];
  const add = (value: any) => {
    if (value == null) return;
    if (Array.isArray(value)) { value.forEach(add); return; }
    if (typeof value === 'string' || typeof value === 'number') { values.push(String(value)); return; }
    if (typeof value === 'object') {
      // API responses can return category as an object, an array, or a single string.
      for (const key of ['category', 'categoryName', 'name', 'alias', 'title', 'gender', 'value']) {
        if (value[key] != null && (typeof value[key] === 'string' || typeof value[key] === 'number')) values.push(String(value[key]));
      }
      for (const key of ['categories', 'categoryList', 'items']) if (value[key] != null) add(value[key]);
    }
  };
  add(product?.categories);
  add(product?.category);
  add(product?.categoryName);
  add(product?.gender);
  add(product?.description);
  return values.map(v => v.toLocaleLowerCase());
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('default');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    apiGet('/Product')
      .then(r => {
        const d = unwrap<any>(r);
        const list = Array.isArray(d) ? d : (Array.isArray(d?.items) ? d.items : Array.isArray(d?.products) ? d.products : Array.isArray(d?.content) ? d.content : []);
        setProducts(list);
      })
      .catch(() => setError('Không thể kết nối API. Vui lòng thử tải lại trang.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const name = String(p?.name ?? p?.alias ?? '').toLocaleLowerCase();
      const matchesQuery = name.includes(q.toLocaleLowerCase());
      if (!category) return matchesQuery;
      const cat = category.toLocaleLowerCase();
      const categoryValues = getCategoryText(p);
      const aliases: Record<string, string[]> = {
        men: ['men', 'male', 'nam', 'man', '1'],
        women: ['women', 'woman', 'female', 'nữ', 'nu', '2'],
        kid: ['kid', 'kids', 'children', 'child', 'trẻ em', 'tre em', '3'],
        sport: ['sport', 'sports', 'thể thao', 'the thao']
      };
      const terms = aliases[cat] || [cat];
      const matchesCategory = categoryValues.some(value => terms.some(term => value.includes(term)));
      return matchesQuery && matchesCategory;
    });
    if (sort === 'asc') list = [...list].sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    if (sort === 'desc') list = [...list].sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    return list;
  }, [products, q, sort, category]);

  useEffect(() => { setPage(1); }, [q, sort, category]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return <div className="page-container">
    <div className="breadcrumbs">Trang chủ / <b>Tìm kiếm sản phẩm</b></div>
    <section className="search-panel"><span className="eyebrow">TÌM ĐÚNG PHONG CÁCH</span><h1>Tìm kiếm<span>.</span></h1>
      <form onSubmit={e => e.preventDefault()} className="search-large"><input value={q} onChange={e => setQ(e.target.value)} placeholder="Nhập tên sản phẩm bạn muốn tìm..."/><button type="submit">Tìm kiếm ↗</button></form>
    </section>
    <div className="section-heading results-heading"><div><span className="eyebrow">DÀNH CHO BẠN</span><h2>{category ? `Sản phẩm ${category === 'Men' ? 'nam' : category === 'Women' ? 'nữ' : category === 'Kid' ? 'trẻ em' : category}` : 'Kết quả tìm kiếm'}</h2><p>{filtered.length} sản phẩm · Trang {Math.min(page, pageCount)}/{pageCount}</p></div>
      <label className="sort-label">Sắp xếp <select value={sort} onChange={e => setSort(e.target.value)}><option value="default">Mặc định</option><option value="asc">Giá tăng dần</option><option value="desc">Giá giảm dần</option></select></label>
    </div>
    {loading ? <div className="empty-state">Đang tải sản phẩm...</div> : error ? <div className="api-note">{error}</div> : <>
      {filtered.length ? <ProductGrid products={visible}/> : <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>}
      {filtered.length > pageSize && <div className="pagination"><button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>← Trước</button>{Array.from({ length: pageCount }, (_, i) => i + 1).map(n => <button key={n} className={page === n ? 'current' : ''} onClick={() => setPage(n)}>{n}</button>)}<button disabled={page === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>Sau →</button></div>}
    </>}
  </div>;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="page-container"><div className="empty-state">Đang tải sản phẩm...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
