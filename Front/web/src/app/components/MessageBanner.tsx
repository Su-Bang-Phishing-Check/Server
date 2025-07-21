"use client";
import { useRouter } from "next/navigation";

const MessageBanner = () => {
  const router = useRouter();
  const handleBannerClick = () => {
    router.push("/analyse");
  };

  return (
    <div
      onClick={handleBannerClick}
      className="cursor-pointer flex flex-col items-center justify-center bg-white border-3 border-[#CEE3FF] p-4 my-4 mx-2 rounded-lg shadow-sm text-black w-[450px] h-[200px]"
    >
      메세지 배너 컴포넌트
    </div>
  );
};

export default MessageBanner;
