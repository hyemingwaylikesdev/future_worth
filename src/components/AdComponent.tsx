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
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className='adsbygoogle'
      style={style || { display: 'block' }}
      data-ad-client='YOUR-CLIENT-ID'
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive='true'
    />
  );
}
