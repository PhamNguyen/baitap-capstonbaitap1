import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata: Metadata = { title: 'CyberSoft Shoes Store', description: 'Cửa hàng giày thể thao CyberSoft' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><Providers><Header/><main>{children}</main><Footer/></Providers></body></html>}
