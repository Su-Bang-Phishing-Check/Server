"use client";
import { createPortal } from "react-dom";
import { useMemo, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ResultModalProps {
  t_type: string[];
  x_type: string[];
  isOpen: boolean;
  onClose?: () => void;
}

const ResultModal = ({ t_type, x_type, isOpen, onClose }: ResultModalProps) => {
  const result = useMemo(() => {
    const t = t_type.length > 0;
    const x = x_type.length > 0;
    if (!t && !x) return 0;
    if (t && !x) return 1;
    if (!t && x) return 2;
    return 3;
  }, [t_type, x_type]);

  // 스크롤 막기
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (typeof window === "undefined" || !isOpen) return null;

  const renderList = (list: string[], colorClass: string) => (
    <div
      className={`block text-2xl font-bold mt-4 mb-4 text-center ${colorClass}`}
    >
      {list.map((item, index) => (
        <span key={`${item}-${index}`}>
          {item}
          {index % 2 === 1 ? <br /> : index < list.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.40)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="bg-gray-100 px-4 py-8 rounded-lg border-blue-300 border-2 shadow-md text-base font-medium">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={20} className="text-black" />
          </button>
        )}
        <h1 className="mb-2">선택하신 내용은</h1>
        {result === 0 && (
          <div className="text-blue-700">사기 유형을 알 수 없습니다.</div>
        )}
        {result === 1 && (
          <>
            <div>
              금융감독원에서 공지하는{" "}
              <span className="text-blue-700">주요 사기 유형</span>중
            </div>
            {renderList(t_type, "text-red-600")}
            <div>와 일치합니다.</div>
          </>
        )}
        {result === 2 && (
          <>
            <div>
              금융감독원에서 발표한{" "}
              <span className="text-blue-700">피해사례</span> 중
            </div>
            {renderList(x_type, "text-red-600")}
            <div>와 일치합니다.</div>
          </>
        )}
        {result === 3 && (
          <>
            <div>
              금융감독원에서 공지한{" "}
              <span className="text-blue-700">주요 사기 유형</span>과{" "}
              <span className="text-blue-700">피해사례</span>
            </div>
            {renderList(t_type, "text-red-600")}
            {renderList(x_type, "text-red-600")}
            <div>와 일치합니다.</div>
          </>
        )}
        <div className="text-center text-[#001C52] text-xl mt-2">
          ※ 자세한 내용은 금융감독원이나 경찰청으로 문의하시기 바랍니다.
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ResultModal;
