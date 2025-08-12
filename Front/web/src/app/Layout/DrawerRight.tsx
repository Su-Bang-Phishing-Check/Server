"use client";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

const DrawerRight = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(true)} className="p-3 cursor-pointer">
        <FiMenu size={24} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden={!isOpen}
          className="fixed inset-0 z-40 transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
           ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 flex justify-between items-center border-b select-none">
          <h2 className="text-lg font-bold">전체메뉴</h2>
          <button onClick={() => setIsOpen(false)} className="cursor-pointer">
            <FiX size={24} />
          </button>
        </div>
        <ul className="p-4 space-y-2 cursor-pointer">
          <li
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => router.push("/chatbot")}
          >
            챗봇으로 확인
          </li>
          <li
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => router.push("/analyse")}
          >
            스미싱 문자 AI 분석
          </li>
          <li
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => router.push("/contact-book")}
          >
            금융기관 연락처
          </li>
          <li
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => router.push("/safe-manual")}
          >
            대응 매뉴얼
          </li>
          <li
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => router.push("/feedback")}
          >
            의견보내기
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DrawerRight;
