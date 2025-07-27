'use client';
import ChatStepIcon from './ChatStepIcon';
import { useRouter } from 'next/navigation';

const ChatbotBanner = () => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push('/chatbot');
  };

  return (
    <div
      onClick={handleChatClick}
      className="cursor-pointer 
      flex flex-col items-center justify-center 
      bg-white p-4 my-2 md:my-4 mx-2 text-black 
      w-full md:w-[450px] h-[150px] md:h-[200px]
      border-3 border-blue-100 rounded-xl
      hover:shadow-md active:scale-95 transition-transform"
    >
      <div className="text-lg font-semibold">
        상황선택 → 요구사항선택 → 위험도 확인
      </div>
      <div>
        <ChatStepIcon />
      </div>
      <div className="text-sm md:text-base text-center mt-2">
        상황 및 요구 내용을 통해 보이스피싱 위험을 알려드립니다.
      </div>
    </div>
  );
};

export default ChatbotBanner;
