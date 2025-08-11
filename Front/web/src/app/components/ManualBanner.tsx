"use client";
import { useRouter } from "next/navigation";

const ManualBanner = () => {
  const router = useRouter();
  const handleBannerClick = () => {
    router.push("/safe-manual");
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
        <div className="text-lg font-semibold">보이스피싱 매뉴얼</div>
        <div className="text-sm md:text-base text-left mt-2">
          보이스피싱을 이미 당했다면?{" "}
        </div>
      </div>
      <div
        className="w-1/4 p-3
        flex items-center justify-center"
      ></div>
    </div>
  );
};

export default ManualBanner;
