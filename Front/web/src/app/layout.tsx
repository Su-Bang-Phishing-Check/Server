import './globals.css';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import { ReactNode } from 'react';

export const metadata = {
  title: '피싱체크',
  description: '보이스피싱, 스미싱 위험을 빠르게 확인하세요',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="max-w-[940px] mx-auto px-4 bg-white text-brack">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
