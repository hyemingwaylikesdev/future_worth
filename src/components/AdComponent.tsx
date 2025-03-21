'use client';

import { useEffect } from 'react';

interface AdComponentProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdComponent({
  slot,
  format = 'auto',
  style,
}: AdComponentProps) {
  useEffect(() => {
    try {
      // 광고가 표시될 컨테이너가 렌더링된 후에 광고를 로드
      const timer = setTimeout(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, 100);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const defaultStyle = {
    display: 'block',
    minHeight: '100px', // 최소 높이 설정
    width: '100%',
    ...style,
  };

  return (
    <div style={{ width: '100%', margin: '1rem 0' }}>
      <ins
        className='adsbygoogle'
        style={defaultStyle}
        data-ad-client='YOUR-CLIENT-ID'
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive='true'
      />
    </div>
  );
}
