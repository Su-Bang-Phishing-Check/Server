'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ChatbotBanner = () => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push('/chatbot');
  };

  return (
    <div
      onClick={handleChatClick}
      className="cursor-pointer 
        flex items-center justify-center 
        bg-white p-4 text-black 
        w-full h-[150px] md:h-[200px]
        border-3 border-blue-100 rounded-xl hover:bg-blue-100
        hover:shadow-md active:scale-95 transition-transform"
    >
      <div className="w-5/7 p-4">
        <div className="text-lg font-bold">
          챗봇으로 사기 유형 확인
        </div>
        <div className="text-sm md:text-base text-left mt-2">
          <span className="font-bold">상황</span> 및{' '}
          <span className="font-bold">요구 내용</span>을 통해
          <span className="font-bold"> 보이스피싱 </span>
          <span className="font-bold text-red-500">위험</span>을
          알려드립니다.
          <br />
        </div>
      </div>
      <div
        className="w-1/4
                  flex items-center justify-center"
      >
        <Image
          src="/assets/img-2.png"
          alt="Chatbot Icon"
          width={110}
          height={110}
          className="-translate-y-1 md:-translate-y-2 object-contain"
        />
      </div>
    </div>
  );
};

export default ChatbotBanner;
