import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: '금융 계산기 모음 | Future Worth',
  description:
    '미래가치, 예금/적금, 대출 상환, 퇴직 자금, 예산 계획, 주식 물타기 등 다양한 금융 계산기를 제공합니다.',
  keywords:
    '금융 계산기, 미래가치 계산기, 예금 계산기, 적금 계산기, 대출 계산기, 퇴직금 계산기, 예산 계산기, 주식 물타기 계산기',
  openGraph: {
    title: '금융 계산기 모음 | Future Worth',
    description:
      '미래가치, 예금/적금, 대출 상환, 퇴직 자금, 예산 계획, 주식 물타기 등 다양한 금융 계산기를 제공합니다.',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
