'use client';

import { FiMenu } from 'react-icons/fi';

export default function Header() {
  const handleMenuClick = () => {
    alert('메뉴 클릭됨');
  };
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">피싱체크</h1>
      <button onClick={handleMenuClick} className="p-2">
        <FiMenu size={24} />
      </button>
    </header>
  );
}
