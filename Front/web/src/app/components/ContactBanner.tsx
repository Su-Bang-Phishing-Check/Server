"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ContactBanner = () => {
  const router = useRouter();
  const handleBannerClick = () => {
    router.push("/contact-book");
  };
  return (
    <div
      onClick={handleBannerClick}
      className="cursor-pointer 
      flex items-center justify-center 
      bg-white p-4 text-black 
      w-full h-[150px] md:h-[200px]
      border-3 border-blue-100 rounded-xl
      hover:shadow-md active:scale-95 transition-transform"
    >
      <div className="w-1/2 p-3">
        <div className="text-lg font-semibold">금융기관 연락처 확인</div>
        <div className="text-sm md:text-base text-left mt-2">
          금융기관 연락처 및 공식 페이지 이동
        </div>
      </div>
      <div
        className="w-1/4 p-3
            flex items-center justify-center"
      ></div>
    </div>
  );
};

export default ContactBanner;
