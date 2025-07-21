"use client";
import { useRouter } from "next/navigation";

import { FiMenu } from "react-icons/fi";

export default function Header() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleMenuClick = () => {
    alert("메뉴 클릭됨");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1
        onClick={handleLogoClick}
        className="text-2xl font-bold text-gray-800 cursor-pointer"
      >
        피싱체크
      </h1>
      <button onClick={handleMenuClick} className="p-2">
        <FiMenu size={24} />
      </button>
    </header>
  );
}
