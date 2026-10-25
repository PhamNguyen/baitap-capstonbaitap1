'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    FB?: {
      init: (options: Record<string, unknown>) => void;
      login: (callback: (response: any) => void, options?: Record<string, unknown>) => void;
      api: (path: string, callback: (response: any) => void) => void;
    };
    fbAsyncInit?: () => void;
  }
}

type Props = { onError: (message: string) => void };

export default function FacebookLogin({ onError }: Props) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  useEffect(() => {
    if (!appId || typeof window === 'undefined') return;
    if (window.FB) {
      window.FB.init({ appId, cookie: true, xfbml: false, version: 'v23.0' });
      setReady(true);
      return;
    }
    window.fbAsyncInit = () => {
      window.FB?.init({ appId, cookie: true, xfbml: false, version: 'v23.0' });
      setReady(true);
    };
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, [appId]);

  function signIn() {
    onError('');
    if (!appId) {
      onError('Bạn cần cấu hình NEXT_PUBLIC_FACEBOOK_APP_ID trong file .env.local trước.');
      return;
    }
    if (!window.FB || !ready) {
      onError('Facebook SDK đang tải. Vui lòng thử lại sau vài giây.');
      return;
    }
    setBusy(true);
    window.FB.login((response: any) => {
      if (!response?.authResponse?.accessToken) {
        setBusy(false);
        onError('Bạn đã hủy đăng nhập Facebook hoặc chưa cấp quyền.');
        return;
      }
      window.FB?.api('/me?fields=id,name,email,picture.type(large)', (profile: any) => {
        setBusy(false);
        if (!profile || profile.error || !profile.id) {
          onError('Không lấy được thông tin Facebook. Hãy kiểm tra quyền email và cài đặt ứng dụng Meta.');
          return;
        }
        const user = {
          id: profile.id,
          name: profile.name || 'Người dùng Facebook',
          email: profile.email || '',
          picture: profile.picture?.data?.url || '',
          provider: 'facebook',
        };
        localStorage.setItem('shoe-facebook-user', JSON.stringify(user));
        localStorage.setItem('shoe-user', JSON.stringify({ name: user.name, email: user.email, avatar: user.picture, provider: 'facebook' }));
        window.dispatchEvent(new Event('shoe-auth-changed'));
        router.push('/profile');
      });
    }, { scope: 'public_profile,email', return_scopes: true });
  }

  return <div>
    <button type="button" className="facebook-login-button" onClick={signIn} disabled={busy}>
      <span className="facebook-mark">f</span>
      {busy ? 'Đang kết nối Facebook…' : 'Tiếp tục với Facebook'}
    </button>
    {!appId && <p className="facebook-hint">Cần App ID từ Meta for Developers để bật đăng nhập thật.</p>}
  </div>;
}
