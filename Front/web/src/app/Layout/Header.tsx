'use client';
import { useRouter } from 'next/navigation';
import DrawerRight from './DrawerRight';
import PWABtn from './PWABtn';

export default function Header() {
  const router = useRouter();

  return (
    <header
      className="flex items-center justify-between px-4 
    bg-blue-50 shadow-md h-14 md:h-20"
    >
      <h1
        onClick={() => router.push('/')}
        className="text-xl md:text-2xl font-bold text-gray-800 cursor-pointer"
      >
        피싱체크
      </h1>
      <div className="flex items-center gap-2">
        <PWABtn />
        <DrawerRight />
      </div>
    </header>
  );
}
