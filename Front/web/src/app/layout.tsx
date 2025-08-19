import './globals.css';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import { ReactNode } from 'react';

export const metadata = {
  title: '피싱체크',
  description: '보이스피싱과 스미싱 위험도를 알려주는 서비스',
  themeColor: '#eff6ff',
  icons: {
    icon: '/assets/logo-192.png',
    apple: '/assets/logo-192.png',
    android: '/assets/logo-192.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="max-w-[940px] mx-auto text-black select-none">
        <Header />
        <main className="md:px-4 min-h-screen bg-[#f7fbff]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
