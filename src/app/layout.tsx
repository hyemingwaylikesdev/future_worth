import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: '미래자산 계산기 | 투자, 대출, 연금 계산 한번에',
  description:
    '주식 투자, 대출 상환, 연금 계산 등 복잡한 금융 계산을 쉽고 빠르게 해보세요. 무료로 제공되는 전문 금융 계산기로 미래 자산을 계획하세요.',
  keywords:
    '주식 투자 계산기, 대출 이자 계산기, 연금 계산기, 예금 적금 계산기, 주식 물타기 계산기, 미래가치 계산기, 투자 수익률 계산기, 대출 상환 계산기, 은퇴 자금 계산기, 예산 계획 계산기',
  openGraph: {
    title: '미래자산 계산기 | 투자, 대출, 연금 계산 한번에',
    description:
      '주식 투자, 대출 상환, 연금 계산 등 복잡한 금융 계산을 쉽고 빠르게 해보세요. 무료로 제공되는 전문 금융 계산기로 미래 자산을 계획하세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '미래자산 계산기',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://future-worth.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <head>
        <Script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR-CLIENT-ID'
          crossOrigin='anonymous'
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
